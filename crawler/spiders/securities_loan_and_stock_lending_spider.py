# encoding: utf-8
# pylint: disable=E1101
# 融券 ＆＆借券賣出
# http://www.twse.com.tw/zh/page/trading/exchange/TWT93U.html


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

# for cloud function call && scrapy crawl command call
# softlink package folder to root
try:
    from package.tools import is_settle, format_number, getDateObj
    from package.storage import Storage
except:
    from spiders.package.tools import is_settle, format_number, getDateObj
    from spiders.package.storage import Storage



class CreditSpider(scrapy.Spider):
    name = 'securities_loan_and_stock_lending'
        
    def __init__(self, category=None, *args, **kwargs):
        super(CreditSpider, self).__init__(*args, **kwargs)
        
        self.dataStorage = Storage(self.name)
        self.data = collections.OrderedDict()
        self.today = datetime.date.today()
        self.url = 'http://www.twse.com.tw/exchangeReport/TWT93U'
        self.params = {
            'response': 'csv',
            'date': '20190101'
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
        targetDateObj = copy(self.startObj)
        while(targetDateObj['datetime'] <= self.endObj['datetime']):
            self.params['date'] = self.getQueryDate(targetDateObj['datetime'])
            url = self.url + '?' + urlencode(self.params)
            time.sleep(randint(2,3))
            yield scrapy.Request(
                url=url,
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
        yield scrapy.Request(
            url=failure.request.url,
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
            table = table.select("table")[0]

            bull_self = table.select("tr")[3].select("td")[9].text.strip() #自營多方口數
            bull_self_amount = table.select("tr")[3].select("td")[10].text.strip()  #自營多方金額
            bull_foreign = table.select("tr")[5].select("td")[7].text.strip()  #外資多方口數
            bull_foreign_amount = table.select("tr")[5].select("td")[8].text.strip() #外資多方金額

            bear_self = table.select("tr")[3].select("td")[11].text.strip()  #自營空方口數
            bear_self_amount = table.select("tr")[3].select("td")[12].text.strip()  #自營空方金額
            bear_foreign = table.select("tr")[5].select("td")[9].text.strip()  #外資空方口數
            bear_foreign_amount = table.select("tr")[5].select("td")[10].text.strip()  #外資空方金額

            diff_self = table.select("tr")[3].select("td")[13].text.strip() #自營多空淨額口數
            diff_self_amount = table.select("tr")[3].select("td")[14].text.strip() #自營多空淨額金額
            diff_foreign = table.select("tr")[5].select("td")[11].text.strip()  #外資多空淨額口數
            diff_foreign_amount = table.select("tr")[5].select("td")[12].text.strip()  #外資多空淨額金額

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
            
        except:
            print('something error')


    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(CreditSpider, cls).from_crawler(crawler, *args, **kwargs)
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

