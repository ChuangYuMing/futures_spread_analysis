# encoding: utf-8
# pylint: disable=E1101
# 三大法人期貨多空未平倉量
# 只能撈前三年！！
# https://www.taifex.com.tw/cht/3/futContractsDate


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



class FuturesOpiSpider(scrapy.Spider):
    name = 'three_corporate_open_interest'
        
    def __init__(self, category=None, *args, **kwargs):
        super(FuturesOpiSpider, self).__init__(*args, **kwargs)
        
        self.dataStorage = Storage(self.name)
        self.data = collections.OrderedDict()
        self.today = datetime.datetime.now(ZoneInfo("Asia/Taipei"))
        self.url = 'https://www.taifex.com.tw/cht/3/futContractsDate'
        self.params = {
            'queryType': '1',
            'goDay': '',
            'doQuery': '1',
            'dateaddcnt': '0',
            'queryDate': '2017/08/08',
            'commodityId': 'TXF'
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
        sidebar_right = soup.select_one(".sidebar_right")

        if sidebar_right is None:
             print(queryDate, "no data")
             return 
             
        table = sidebar_right.select("table")[2]

        if len(table.find_all("table")) == 0:
            print(queryDate, "no data")
            return

        print(queryDate)

        try:
            table = table.select("table")[0]
            bull_self = table.select("tr")[3].select("td")[6].text.strip() #自營多方口數
            bull_self_amount = table.select("tr")[3].select("td")[7].text.strip()  #自營多方金額
            bull_foreign = table.select("tr")[5].select("td")[6].text.strip()  #外資多方口數
            bull_foreign_amount = table.select("tr")[5].select("td")[7].text.strip() #外資多方金額

            bear_self = table.select("tr")[3].select("td")[8].text.strip()  #自營空方口數
            bear_self_amount = table.select("tr")[3].select("td")[9].text.strip()  #自營空方金額
            bear_foreign = table.select("tr")[5].select("td")[8].text.strip()  #外資空方口數
            bear_foreign_amount = table.select("tr")[5].select("td")[9].text.strip()  #外資空方金額

            diff_self = table.select("tr")[3].select("td")[10].text.strip() #自營多空淨額口數
            diff_self_amount = table.select("tr")[3].select("td")[11].text.strip() #自營多空淨額金額
            diff_foreign = table.select("tr")[5].select("td")[10].text.strip()  #外資多空淨額口數
            diff_foreign_amount = table.select("tr")[5].select("td")[11].text.strip()  #外資多空淨額金額

            year = targetDateObj['year']
            if year not in self.data:
                self.data[year] = {}
            datestart = queryDate

            self.data[year][datestart] = {}
            self.data[year][datestart]["bull_self"] = format_number(bull_self)
            self.data[year][datestart]["bull_self_amount"] = format_number(bull_self_amount)
            self.data[year][datestart]["bull_foreign"] = format_number(bull_foreign)
            self.data[year][datestart]["bull_foreign_amount"] = format_number(bull_foreign_amount)
            
            self.data[year][datestart]["bear_self"] = format_number(bear_self)
            self.data[year][datestart]["bear_self_amount"] = format_number(bear_self_amount)  
            self.data[year][datestart]["bear_foreign"] = format_number(bear_foreign)
            self.data[year][datestart]["bear_foreign_amount"] = format_number(bear_foreign_amount)
            
            self.data[year][datestart]["diff_self"] = format_number(diff_self)
            self.data[year][datestart]["diff_self_amount"] = format_number(diff_self_amount)
            self.data[year][datestart]["diff_foreign"] = format_number(diff_foreign)
            self.data[year][datestart]["diff_foreign_amount"] = format_number(diff_foreign_amount)       

            self.data[year][datestart]["is_settle"] = is_settle(datestart, "/")
            
        except Exception as e:
            print('error - %s' % self.name)
            print(e)


    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(FuturesOpiSpider, cls).from_crawler(crawler, *args, **kwargs)
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

