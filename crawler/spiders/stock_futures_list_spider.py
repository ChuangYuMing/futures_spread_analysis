# encoding: utf-8
# pylint: disable=E1101
# 股票期貨清單
# https://www.taifex.com.tw/cht/2/stockLists


import scrapy
from scrapy import signals, Spider
from urllib.parse import urlencode
import time
from random import randint
import datetime
import logging
from copy import copy
from dateutil.relativedelta import relativedelta
import collections
import json
from bs4 import BeautifulSoup
from random import randint
from zoneinfo import ZoneInfo

# for cloud function call && scrapy crawl command call
# softlink package folder to root
try:
    from package.tools import is_settle, format_number, getDateObj
    from package.storage import Storage
except:
    from spiders.package.tools import is_settle, format_number, getDateObj
    from spiders.package.storage import Storage



class StockFuturesListSpider(scrapy.Spider):
    name = 'stock_futures_list'
        
    def __init__(self, category=None, *args, **kwargs):
        super(StockFuturesListSpider, self).__init__(*args, **kwargs)
        
        self.dataStorage = Storage(self.name)
        self.data = collections.OrderedDict()
        self.url = 'https://www.taifex.com.tw/cht/2/stockLists'


    def start_requests(self):
        print('start request - %s' % self.name)
        time.sleep(randint(2,3))
        yield scrapy.FormRequest(
            url=self.url,
            callback=self.parse,
            errback=self.handle_failure)

    def handle_failure(self, failure):
        self.log(failure, level=logging.ERROR)
        # try with a new proxy
        self.log('restart from the failed url {}'.format(failure.request.url))
        time.sleep(120)
        yield scrapy.FormRequest(
            url=failure.request.url,
            callback=self.parse,
            errback=self.handle_failure)

    def parse(self, response):
        soup = BeautifulSoup(response.text, "lxml")
        table = soup.select_one("#myTable tbody")
        
        self.stockList = []
        try:
            trList = table.select("tr")

            for tr in trList:
                stockData = {}
 
                stockData['productCode'] = tr.select("td")[0].text.strip()
                stockData['code'] = tr.select("td")[2].text.strip()
                stockData['name'] = tr.select("td")[3].text.strip()
                stockData['isFutures'] = True if len(tr.select("td")[4].contents) > 1 else False
                stockData['isOption'] = True if len(tr.select("td")[5].contents) > 1 else False
                stockData['stockNumber'] = tr.select("td")[9].text.strip()

                self.stockList.append(stockData)

        except Exception as e:
            print('error - %s' % self.name)
            print(e)


    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(StockFuturesListSpider, cls).from_crawler(crawler, *args, **kwargs)
        crawler.signals.connect(spider.spider_closed, signal=signals.spider_closed)
        return spider

    def spider_closed(self, spider):
        fileName = self.name
        self.dataStorage.saveData(fileName, self.stockList)

