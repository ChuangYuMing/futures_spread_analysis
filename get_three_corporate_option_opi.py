# encoding: utf-8
# 三大法人選擇權未平倉量
# 只能撈前三年！！！

import requests
from bs4 import BeautifulSoup
import json
import datetime
import collections
import os
import sys
import traceback
from package.tools import check_date, is_settle, format_number

print('START ##############')


class OptionOpiCrawler:
    def __init__(self):
        self.url = 'http://www.taifex.com.tw/chinese/3/7_12_5.asp'
        self.data = collections.OrderedDict()
        self.root = '/Users/yuming/Documents/futures_spread_analysis/'
        self.const_name = 'three_corporate_option_opi'
        self.params = {
          "goday": "",
          "DATA_DATE_Y": 2012,
          "DATA_DATE_M": "02",
          "DATA_DATE_D": "25",
          "syear": 2012,
          "smonth": "02",
          "sday": "25",
          "datestart": "2012/02/25",
          "COMMODITY_ID": "TXO"
        }

    def update_data(self, data, year):
        url = self.root + 'data/' + self.const_name + '/' + year + '.json'
        if len(data) == 0:
            return
        if os.path.exists(url) is False:
            open(url, 'w')
            old = collections.OrderedDict()
        else:
            data_file = open(url, 'r')
            old = json.load(data_file)
        for k in data:
            old[k] = data[k]
        new_file = open(url, 'w')
        json.dump(old, new_file, sort_keys=True)

    def request_data(self):
        now_date = datetime.date.today()
        ufile = open(self.root + 'data/last_update_date.json', 'r')
        last_time_obj = json.load(ufile)
        last_time = last_time_obj[self.const_name]
        for z in range(int(last_time['year']), now_date.year + 1):
            st_month = 1
            end_month = 12
            last_item = {}
            try:
                old_file = open(self.root + 'data/' + self.const_name + '/' + str(z) + '.json', 'r')
                i = collections.OrderedDict(json.load(old_file))
                last_item = i[list(i.keys())[-1]]
                # print(last_item)
            except:
                ex_type, ex, tb = sys.exc_info()
                # traceback.print_tb(tb)
                traceback.print_exc()
                last_item = {}
            if z == now_date.year:
                st_month = int(last_time['month'])
                end_month = now_date.month
            for y in range(st_month, end_month + 1):
                st_day = 1
                end_day = 31
                if z == now_date.year and y == now_date.month:
                    st_day = int(last_time['day'] + 1)
                    end_day = now_date.day
                for x in range(st_day, end_day + 1):
                    syear = str(z)
                    smonth = str(y) if len(str(y)) != 1 else "0" + str(y)
                    sday = str(x) if len(str(x)) != 1 else "0" + str(x)
                    self.params["DATA_DATE_Y"] = syear
                    self.params["DATA_DATE_M"] = smonth
                    self.params["DATA_DATE_D"] = sday
                    self.params["syear"] = syear
                    self.params["smonth"] = smonth
                    self.params["sday"] = sday

                    self.params["datestart"] = syear + "/" + smonth + "/" + sday
                    settle = check_date(self.params["datestart"])
                    if settle:
                        print(self.params["datestart"])
                        res = requests.post(self.url, data=self.params)
                        soup = BeautifulSoup(res.text, "lxml")

                        if soup.select("table")[2].find_all("table"):
                            table = soup.select("table")[2].select("table")[0]

                            f_buy_call = table.select("tr")[5].select("td")[7].text.strip()
                            f_buy_put = table.select("tr")[8].select("td")[7].text.strip()
                            f_buy_call_amount = table.select("tr")[5].select("td")[8].text.strip()
                            f_buy_put_amount = table.select("tr")[8].select("td")[8].text.strip()

                            f_sell_call = table.select("tr")[5].select("td")[9].text.strip()
                            f_sell_put = table.select("tr")[8].select("td")[9].text.strip()
                            f_sell_call_amount = table.select("tr")[5].select("td")[10].text.strip()
                            f_sell_put_amount = table.select("tr")[8].select("td")[10].text.strip()

                            if len(last_item) > 0:
                                f_buy_call = format_number(f_buy_call)
                                f_sell_put_amount = format_number(f_sell_put_amount)
                                # print(last_item['f_buy_call'], f_buy_call)
                                if last_item['f_buy_call'] == f_buy_call and last_item['f_sell_put_amount'] == f_sell_put_amount:
                                    break
                            datestart = self.params["datestart"]
                            self.data[datestart] = {}
                            self.data[datestart]["f_buy_call"] = format_number(f_buy_call)
                            self.data[datestart]["f_buy_put"] = format_number(f_buy_put)
                            self.data[datestart]["f_buy_call_amount"] = format_number(f_buy_call_amount)
                            self.data[datestart]["f_buy_put_amount"] = format_number(f_buy_put_amount)
                            self.data[datestart]["f_sell_call"] = format_number(f_sell_call)
                            self.data[datestart]["f_sell_put"] = format_number(f_sell_put)
                            self.data[datestart]["f_sell_call_amount"] = format_number(f_sell_call_amount)
                            self.data[datestart]["f_sell_put_amount"] = format_number(f_sell_put_amount)
                            self.data[datestart]["is_settle"] = is_settle(datestart)
                            last_item = self.data[datestart]
                        else:
                            print(self.params["datestart"], "no data")
            self.update_data(self.data, str(z))
            self.data = collections.OrderedDict()

        ufile = open(self.root + 'data/last_update_date.json', 'w')
        last_time_obj[self.const_name]['year'] = now_date.year
        last_time_obj[self.const_name]['month'] = now_date.month
        last_time_obj[self.const_name]['day'] = now_date.day
        json.dump(last_time_obj, ufile, sort_keys=True)


Crawler = OptionOpiCrawler()
Crawler.request_data()

print('END ##############')
