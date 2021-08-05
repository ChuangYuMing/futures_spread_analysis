# encoding: utf-8
# pylint: disable=E1101
# 融券 ＆＆借券賣出
# http://www.twse.com.tw/zh/page/trading/exchange/TWT93U.html

# scrapy crawl securities_loan_and_stock_lending -a start=20210730  -a end=20210730

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
import re
import csv
import traceback

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
            self.params['date'] = self.getFormatDate(targetDateObj['datetime'])
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
        data = json.loads(response.text)
       

        if len(data["data"]) == 0:
            print(queryDate, "no data")
            return

        print(queryDate)

        for row in data["data"]:
            try:
                code = row[0]

                if code == '':
                    continue

                credit_data = {
                    "date": queryDate,
                    "sl_preDay_balance": format_number(row[2]),
                    "sl_sell": format_number(row[3]),
                    "sl_buy": format_number(row[4]),
                    "sl_cash_stock": format_number(row[5]),
                    "sl_day_balance": format_number(row[6]),
                    "sl_limit": format_number(row[7]),
                    "bw_preDay_balance": format_number(row[8]),
                    "bw_sell_on_day": format_number(row[9]),
                    "bw_return_on_day": format_number(row[10]),
                    "bw_adjust_on_day": format_number(row[11]),
                    "bw_day_balance": format_number(row[12]),
                    "bw_limit_on_next_business_day": format_number(row[13])
                }
    
                if code not in self.data:
                    credit_data_item = {}
                    credit_data_item[queryDate] = credit_data
                    self.data[code] = {
                        "code": code,
                        "name": row[1],
                        "credit_data": credit_data_item
                    }
                else:
                    self.data[code]['credit_data'][queryDate] = credit_data
            except:
                traceback.print_exc()
                continue

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(CreditSpider, cls).from_crawler(crawler, *args, **kwargs)
        crawler.signals.connect(spider.spider_closed, signal=signals.spider_closed)
        return spider

    def spider_closed(self, spider):
        fileName = 'loan-and-lending'
        newData = dict()
        try:
            newData = self.dataStorage.getOldData(fileName)
        except:
            pass
        
        for code in self.data:
            if code not in newData:
                newData[code] = self.data[code]
            else:
                for date in self.data[code]['credit_data']:
                    item = self.data[code]['credit_data'][date]
                    if date in newData[code]['credit_data']:
                        newData[code]['credit_data'][date].update(item)
                    else:
                        newData[code]['credit_data'][date] = item

        self.dataStorage.saveData(fileName, newData)

            


# ['2424', '隴華', '0', '0', '0', '0', '0', '7,500,000',|| '0', '0', '0', '0', '0', '1,400', '', '']

# 融券||借券賣出
# 股票代號, 股票名稱, 前日餘額, 賣出, 買進, 現券, 今日餘額, 限額,|| 前日餘額, 當日賣出, 當日還券, 當日調整, 當日餘額, 次一營業日可限額

# 1.「借券賣出當日餘額＝前日餘額+當日賣出-當日還券+當日調整」數額。
# 2. 借券賣出股數含鉅額交易股數。
# 3.「當日調整」數額：為當日集中市場交易類別(普通部位)、(信用部位)與(借券部位)相互調整數額，及錯帳申報等數額。
# 4.「今日可借券賣出限額」：自106年2月23日起為每日盤中借券賣出委託量不得超過該種有價證券前三十個營業日之日平均成交數量之百分之三十。當發生信用額度分配時，依「借券總量控管」辦法產生融券限額與今日可借券賣出限額。
# 託額度之限制，故個股借券賣出成交數量可能大於其當日可借券賣出限額。
# 5. 配合標的證券維護作業系統完成之時間點，本項資訊將於每日晚間執行二次更新作業，更新時間分別約為20時30分及22時30分，實際視日結作業完成時間可能有所異動。