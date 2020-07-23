# encoding: utf-8
# 加權指數
# https://www.twse.com.tw/zh/page/trading/indices/MI_5MINS_HIST.html


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

# for cloud function call && scrapy crawl command call
# softlink package folder to root
try:
    from package.tools import check_date, is_settle, format_number
    from package.storage import Storage
except:
    from spiders.package.tools import check_date, is_settle, format_number
    from spiders.package.storage import Storage



class WeightedIndexSpider(scrapy.Spider):
    name = 'weighted_index'
        
    def __init__(self, category=None, *args, **kwargs):
        super(WeightedIndexSpider, self).__init__(*args, **kwargs)
        
        self.dataStorage = Storage('weighted_index')
        self.data = collections.OrderedDict()
        self.today = datetime.date.today()
        self.url = 'https://www.twse.com.tw/indicesReport/MI_5MINS_HIST'
        self.params = {
            'response': 'json',
            'date': '20110101'
        }
        self.startDate = getattr(self, 'start', self.getFormatDate(self.today))
        self.endDate = getattr(self, 'end', self.getFormatDate(self.today))
        self.startObj = self.parseDate(self.startDate)
        self.endObj = self.parseDate(self.endDate)

    def parseDate(self, dateString):
        year = int(dateString[0:4])
        month = int(dateString[4:6])
        day = int(dateString[6:8])
        return {
            'year': year,
            'month': month,
            'day': day,
            'datetime': datetime.date(year, month, day)
        }

    def getFormatDate(self, date):
        year = str(date.year)
        month = str(date.month) if len(str(date.month)) != 1 else "0" + str(date.month)
        day = '01'
        return year + month + day

    # 西元
    def format_ad_date(self, date):
        date_arr = date.split('/')
        year = date_arr[0]
        month = date_arr[1]
        day = date_arr[2]
        year = str(int(year) + 1911)
        return year + '/' + month + '/' + day

    def start_requests(self):
        targetDateObj = copy(self.startObj)
        while(targetDateObj['datetime'] <= self.endObj['datetime']):
            self.params['date'] = self.getFormatDate(targetDateObj['datetime'])
            url = self.url + '?' + urlencode(self.params)
            yield scrapy.Request(
                url=url,
                callback=self.parse,
                cb_kwargs=dict(targetDateObj=copy(targetDateObj)),
                errback=self.handle_failure)

            targetDateObj['datetime'] = targetDateObj['datetime'] + relativedelta(months=1)
            targetDateObj['year'] = targetDateObj['datetime'].year
            targetDateObj['month'] = targetDateObj['datetime'].month

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

    def parse(self, response, targetDateObj):
        print(targetDateObj['datetime'])
        result = json.loads(response.text)
        data = result['data']
        year = targetDateObj['year']
        for item in data:
            datestart = self.format_ad_date(item[0])
            if year not in self.data:
                self.data[year] = {}

            self.data[year][datestart] = {}
            self.data[year][datestart]["open"] = format_number(item[1].split(".")[0]) # 開盤
            self.data[year][datestart]["high"] = format_number(item[2].split(".")[0]) # 最高
            self.data[year][datestart]["low"] = format_number(item[3].split(".")[0])  # 最低
            self.data[year][datestart]["w_index"] = format_number(item[4].split(".")[0]) # 收盤
            self.data[year][datestart]["is_settle"] = is_settle(datestart, '/')

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(WeightedIndexSpider, cls).from_crawler(crawler, *args, **kwargs)
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

