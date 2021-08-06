# encoding: utf-8
# pylint: disable=E1101
# 期貨大額交易人未沖銷部位
# https://www.taifex.com.tw/cht/3/largeTraderFutQry


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



class TxOpenInterestSpider(scrapy.Spider):
    name = 'tx_open_interest'
        
    def __init__(self, category=None, *args, **kwargs):
        super(TxOpenInterestSpider, self).__init__(*args, **kwargs)
        
        self.dataStorage = Storage(self.name)
        self.data = collections.OrderedDict()
        self.today = datetime.datetime.now(ZoneInfo("Asia/Taipei"))
        self.url = 'https://www.taifex.com.tw/cht/3/largeTraderFutQry'
        self.params = {
            'datecount': '',
            'contractId2': '',
            'queryDate': '2017/01/17',
            'contractId': 'TX',
        }
        self.startDate = getattr(self, 'start', self.getFormatDate(self.today))
        self.endDate = getattr(self, 'end', self.getFormatDate(self.today))
        self.startObj = getDateObj(self.startDate, None)
        self.endObj = getDateObj(self.endDate, None)

    def getFormatDate(self, date):
        year = str(date.year)
        month = str(date.month) if len(str(date.month)) != 1 else '0' + str(date.month)
        day = str(date.day) if len(str(date.day)) != 1 else '0' + str(date.day)
        return year + month + day

    def getQueryDate(self, date):
        year = str(date.year)
        month = str(date.month) if len(str(date.month)) != 1 else '0' + str(date.month)
        day = str(date.day) if len(str(date.day)) != 1 else '0' + str(date.day)
        return year + '/' + month+ '/' + day

    def start_requests(self):
        print('start request - %s' % self.name)
        targetDateObj = copy(self.startObj)
        while(targetDateObj['datetime'] <= self.endObj['datetime']):
            self.params['queryDate'] = self.getQueryDate(targetDateObj['datetime'])
            time.sleep(randint(2,3))
            yield scrapy.FormRequest(
                url=self.url,
                formdata=self.params,
                callback=self.parse,
                cb_kwargs=dict(targetDateObj=copy(targetDateObj), params=copy(self.params)),
                errback=self.handle_failure)

            targetDateObj['datetime'] = targetDateObj['datetime'] + relativedelta(days=1)
            targetDateObj['year'] = targetDateObj['datetime'].year
            targetDateObj['month'] = targetDateObj['datetime'].month
            targetDateObj['day'] = targetDateObj['datetime'].day

    def handle_failure(self, failure):
        self.log(failure, level=logging.ERROR)
        # try with a new proxy
        self.log('restart from the failed url {}'.format(failure.request.url))
        time.sleep(120)
        yield scrapy.FormRequest(
            url=failure.request.url,
            formdata=failure.request.cb_kwargs['params'],
            callback=self.parse,
            cb_kwargs=failure.request.cb_kwargs,
            errback=self.handle_failure)

    def parse(self, response, targetDateObj, params):
        queryDate = self.getQueryDate(targetDateObj['datetime'])
        soup = BeautifulSoup(response.text, "lxml")
        table = soup.select_one(".sidebar_right").select("table")[2]

        if len(table.find_all("table")) == 0:
            print(queryDate, "no data")
            return

        print(queryDate)

        try:
            tr = table.select("table")[0].select("tr")[4]

            buy_top_five = tr.select("td")[1].stripped_strings
            buy_top_ten = tr.select("td")[3].stripped_strings
            sell_top_five = tr.select("td")[5].stripped_strings
            sell_top_ten = tr.select("td")[7].stripped_strings
            total = tr.select("td")[9].stripped_strings

            year = targetDateObj['year']
            if year not in self.data:
                self.data[year] = {}
            datestart = queryDate

            self.data[year][datestart] = {}
            self.data[year][datestart]["buy_top_five"] = format_number(list(buy_top_five)[0])   # 買方-前五大交易人
            self.data[year][datestart]["buy_top_ten"] = format_number(list(buy_top_ten)[0])     # 買方-前十大交易人
            self.data[year][datestart]["sell_top_five"] = format_number(list(sell_top_five)[0]) # 賣方方-前五大交易人
            self.data[year][datestart]["sell_top_ten"] = format_number(list(sell_top_ten)[0])   # 賣方-前十大交易人
            self.data[year][datestart]["total"] = format_number(list(total)[0])                 # 市場未平倉
            self.data[year][datestart]["is_settle"] = is_settle(datestart, "/")
            
        except Exception as e:
            print('error - %s' % self.name)
            print(e)


    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(TxOpenInterestSpider, cls).from_crawler(crawler, *args, **kwargs)
        crawler.signals.connect(spider.spider_closed, signal=signals.spider_closed)
        return spider

    def spider_closed(self, spider):
        for year in self.data:
            newData = self.data[year]
            data = dict()

            try:
                data = self.dataStorage.getOldData(year)
            except:
                pass

            data.update(newData)
            self.dataStorage.saveData(year, data)

