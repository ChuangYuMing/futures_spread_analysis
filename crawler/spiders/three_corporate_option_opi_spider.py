# encoding: utf-8
# pylint: disable=E1101
# 三大法人選擇權未平倉量
# 只能撈前三年！！！
# https://www.taifex.com.tw/cht/3/callsAndPutsDate


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



class OptionOpiSpider(scrapy.Spider):
    name = 'three_corporate_option_opi'
        
    def __init__(self, category=None, *args, **kwargs):
        super(OptionOpiSpider, self).__init__(*args, **kwargs)
        
        self.dataStorage = Storage(self.name)
        self.data = collections.OrderedDict()
        self.today = datetime.date.today()
        self.url = 'https://www.taifex.com.tw/cht/3/callsAndPutsDate'
        self.params = {
            'queryType': '1',
            'goDay': '',
            'doQuery': '1',
            'dateaddcnt': '',
            'queryDate': '2018/01/19',
            'commodityId': 'TXO'
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
            self.params['queryDate'] = self.getQueryDate(targetDateObj['datetime'])
            time.sleep(randint(4,6))
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
        wrapper = soup.select_one(".sidebar_right")

        if  wrapper is None:
            print(queryDate, 'can not query now')
            return

        table = wrapper.select("table")[2]

        if len(table.find_all("table")) == 0:
            print(queryDate, "no data")
            return

        print(queryDate)
        table = table.select("table")[0]

        try:
            f_buy_call = table.select("tr")[5].select("td")[6].text.strip()
            f_buy_put = table.select("tr")[8].select("td")[6].text.strip()
            f_buy_call_amount = table.select("tr")[5].select("td")[7].text.strip()
            f_buy_put_amount = table.select("tr")[8].select("td")[7].text.strip()

            f_sell_call = table.select("tr")[5].select("td")[8].text.strip()
            f_sell_put = table.select("tr")[8].select("td")[8].text.strip()
            f_sell_call_amount = table.select("tr")[5].select("td")[9].text.strip()
            f_sell_put_amount = table.select("tr")[8].select("td")[9].text.strip()

            self_buy_call = table.select("tr")[3].select("td")[6].text.strip()
            self_buy_put = table.select("tr")[6].select("td")[6].text.strip()
            self_buy_call_amount = table.select("tr")[3].select("td")[7].text.strip()
            self_buy_put_amount = table.select("tr")[6].select("td")[7].text.strip()

            self_sell_call = table.select("tr")[3].select("td")[8].text.strip()
            self_sell_put = table.select("tr")[6].select("td")[8].text.strip()
            self_sell_call_amount = table.select("tr")[3].select("td")[9].text.strip()
            self_sell_put_amount = table.select("tr")[6].select("td")[9].text.strip()

            f_long = format_number(f_buy_call) + format_number(f_sell_put) #外資多方口數
            f_long_amount = format_number(f_buy_call_amount) + format_number(f_sell_put_amount) #外資多方契約金額
            f_short = format_number(f_buy_put) + format_number(f_sell_call) #外資空方口數
            f_short_amount = format_number(f_buy_put_amount) + format_number(f_sell_call_amount) #外資空方契約金額
            f_net = f_long - f_short #多空淨額口數
            f_net_amount = f_long_amount - f_short_amount #多空淨額契約金額

            self_long = format_number(self_buy_call) + format_number(self_sell_put) #自營多方口數
            self_long_amount = format_number(self_buy_call_amount) + format_number(self_sell_put_amount) #自營多方契約金額
            self_short = format_number(self_buy_put) + format_number(self_sell_call) #自營空方口數
            self_short_amount = format_number(self_buy_put_amount) + format_number(self_sell_call_amount) #自營空方契約金額
            self_net = self_long - self_short #多空淨額口數
            self_net_amount = self_long_amount - self_short_amount #多空淨額契約金額

            year = targetDateObj['year']
            if year not in self.data:
                self.data[year] = {}
            datestart = queryDate

            self.data[year][datestart] = {}
            self.data[year][datestart]["f_buy_call"] = format_number(f_buy_call)
            self.data[year][datestart]["f_buy_put"] = format_number(f_buy_put)
            self.data[year][datestart]["f_buy_call_amount"] = format_number(f_buy_call_amount)
            self.data[year][datestart]["f_buy_put_amount"] = format_number(f_buy_put_amount)
            self.data[year][datestart]["f_sell_call"] = format_number(f_sell_call)
            self.data[year][datestart]["f_sell_put"] = format_number(f_sell_put)
            self.data[year][datestart]["f_sell_call_amount"] = format_number(f_sell_call_amount)
            self.data[year][datestart]["f_sell_put_amount"] = format_number(f_sell_put_amount)
            self.data[year][datestart]["self_buy_call"] = format_number(self_buy_call)
            self.data[year][datestart]["self_buy_put"] = format_number(self_buy_put)
            self.data[year][datestart]["self_buy_call_amount"] = format_number(self_buy_call_amount)
            self.data[year][datestart]["self_buy_put_amount"] = format_number(self_buy_put_amount)
            self.data[year][datestart]["self_sell_call"] = format_number(self_sell_call)
            self.data[year][datestart]["self_sell_put"] = format_number(self_sell_put)
            self.data[year][datestart]["self_sell_call_amount"] = format_number(self_sell_call_amount)
            self.data[year][datestart]["self_sell_put_amount"] = format_number(self_sell_put_amount)
            self.data[year][datestart]["f_long"] = f_long
            self.data[year][datestart]["f_long_amount"] = f_long_amount
            self.data[year][datestart]["f_short"] = f_short
            self.data[year][datestart]["f_short_amount"] = f_short_amount
            self.data[year][datestart]["f_net"] = f_net
            self.data[year][datestart]["f_net_amount"] = f_net_amount
            self.data[year][datestart]["self_long"] = self_long
            self.data[year][datestart]["self_long_amount"] = self_long_amount
            self.data[year][datestart]["self_short"] = self_short
            self.data[year][datestart]["self_short_amount"] = self_short_amount
            self.data[year][datestart]["self_net"] = self_net
            self.data[year][datestart]["self_net_amount"] = self_net_amount
            self.data[year][datestart]["is_settle"] = is_settle(datestart, "/")
            
        except Exception as e:
            print('something error')
            print(e)


    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(OptionOpiSpider, cls).from_crawler(crawler, *args, **kwargs)
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

