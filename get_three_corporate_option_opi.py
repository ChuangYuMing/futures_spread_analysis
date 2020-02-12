# encoding: utf-8
# 三大法人選擇權未平倉量
# 只能撈前三年！！！
# https://www.taifex.com.tw/cht/3/callsAndPutsDate

import requests
from bs4 import BeautifulSoup
import json
import time
import datetime
import collections
from decimal import Decimal
from re import sub
from random import randint
from package.tools import check_date, is_settle, format_number
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

print('START ############## OptionOpiCrawler', datetime.datetime.now())


class OptionOpiCrawler:
    def __init__(self):
        self.url = 'https://www.taifex.com.tw/cht/3/callsAndPutsDate'
        self.data = collections.OrderedDict()
        self.params = {
            "queryType": 1,
            "goDay": "",
            "doQuery": 1,
            "dateaddcnt": -1,
            "queryDate": "2018/01/19",
            "commodityId": "TXO"
        }

    def main(self):
        cred = credentials.Certificate('firebase-adminsdk.json')
        default_app = firebase_admin.initialize_app(cred)
        self.db = firestore.client()

        self.request_data()

    def get_last_update_date(self):
        docs = self.db.collection('three_corporate_option_opi').stream()

        for lastDoc in docs:
            pass

        sortedDoc = sorted(lastDoc.to_dict().items())
        return sortedDoc[-1][0]

    def saveDatas(self):
        lastItemDate = next(reversed(self.data))
        year = str(lastItemDate).split("/")[0]

        ref = self.db.collection('three_corporate_option_opi').document(year)
        ref.set(self.data, merge=True)
        self.data = collections.OrderedDict()

    def request_data(self):
        last_update_date = self.get_last_update_date()
        next_date = datetime.datetime.strptime(last_update_date, "%Y/%m/%d").date()
        now_date = datetime.date.today()

        while (next_date <= now_date):
            syear = str(next_date.year)
            smonth = str(next_date.month) if len(
                str(next_date.month)) != 1 else "0" + str(next_date.month)
            sday = str(next_date.day) if len(str(next_date.day)
                                             ) != 1 else "0" + str(next_date.day)
            datestart = syear + "/" + smonth + "/" + sday
            isValidDate = check_date(datestart, "/")
            self.params["queryDate"] = datestart
  
            if isValidDate:
                try:
                    res = requests.post(self.url, data=self.params)
                    time.sleep(randint(1, 2))
                except requests.exceptions.RequestException as e:
                    print(e)
                    time.sleep(120)
                    print('re connect')
                    res = requests.post(self.url, data=self.params)

                soup = BeautifulSoup(res.text, "lxml")

                table = soup.select_one(".sidebar_right").select("table")[2]
                
                if table.find_all("table"):
                    print(self.params["queryDate"])
                    table = table.select("table")[0]

                    f_buy_call = table.select("tr")[5].select("td")[7].text.strip()
                    f_buy_put = table.select("tr")[8].select("td")[7].text.strip()
                    f_buy_call_amount = table.select("tr")[5].select("td")[8].text.strip()
                    f_buy_put_amount = table.select("tr")[8].select("td")[8].text.strip()

                    f_sell_call = table.select("tr")[5].select("td")[9].text.strip()
                    f_sell_put = table.select("tr")[8].select("td")[9].text.strip()
                    f_sell_call_amount = table.select("tr")[5].select("td")[10].text.strip()
                    f_sell_put_amount = table.select("tr")[8].select("td")[10].text.strip()

                    self_buy_call = table.select("tr")[3].select("td")[10].text.strip()
                    self_buy_put = table.select("tr")[6].select("td")[8].text.strip()
                    self_buy_call_amount = table.select("tr")[3].select("td")[11].text.strip()
                    self_buy_put_amount = table.select("tr")[6].select("td")[9].text.strip()

                    self_sell_call = table.select("tr")[3].select("td")[12].text.strip()
                    self_sell_put = table.select("tr")[6].select("td")[10].text.strip()
                    self_sell_call_amount = table.select("tr")[3].select("td")[13].text.strip()
                    self_sell_put_amount = table.select("tr")[6].select("td")[11].text.strip()

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

                    datestart = self.params["queryDate"]
                    self.data[datestart] = {}
                    self.data[datestart]["f_buy_call"] = format_number(f_buy_call)
                    self.data[datestart]["f_buy_put"] = format_number(f_buy_put)
                    self.data[datestart]["f_buy_call_amount"] = format_number(f_buy_call_amount)
                    self.data[datestart]["f_buy_put_amount"] = format_number(f_buy_put_amount)
                    self.data[datestart]["f_sell_call"] = format_number(f_sell_call)
                    self.data[datestart]["f_sell_put"] = format_number(f_sell_put)
                    self.data[datestart]["f_sell_call_amount"] = format_number(f_sell_call_amount)
                    self.data[datestart]["f_sell_put_amount"] = format_number(f_sell_put_amount)
                    self.data[datestart]["self_buy_call"] = format_number(self_buy_call)
                    self.data[datestart]["self_buy_put"] = format_number(self_buy_put)
                    self.data[datestart]["self_buy_call_amount"] = format_number(self_buy_call_amount)
                    self.data[datestart]["self_buy_put_amount"] = format_number(self_buy_put_amount)
                    self.data[datestart]["self_sell_call"] = format_number(self_sell_call)
                    self.data[datestart]["self_sell_put"] = format_number(self_sell_put)
                    self.data[datestart]["self_sell_call_amount"] = format_number(self_sell_call_amount)
                    self.data[datestart]["self_sell_put_amount"] = format_number(self_sell_put_amount)
                    self.data[datestart]["f_long"] = f_long
                    self.data[datestart]["f_long_amount"] = f_long_amount
                    self.data[datestart]["f_short"] = f_short
                    self.data[datestart]["f_short_amount"] = f_short_amount
                    self.data[datestart]["f_net"] = f_net
                    self.data[datestart]["f_net_amount"] = f_net_amount
                    self.data[datestart]["self_long"] = self_long
                    self.data[datestart]["self_long_amount"] = self_long_amount
                    self.data[datestart]["self_short"] = self_short
                    self.data[datestart]["self_short_amount"] = self_short_amount
                    self.data[datestart]["self_net"] = self_net
                    self.data[datestart]["self_net_amount"] = self_net_amount
                    
                    self.data[datestart]["is_settle"] = is_settle(datestart, "/")
                        
                else:
                    print(self.params["queryDate"], "no data")

            next_date = next_date + datetime.timedelta(days=1)

            if str(next_date.year) != syear:
                self.saveDatas()
                
        self.saveDatas()
            # print('--', next_date < now_date)
            # print('--', next_date.strftime("%Y-%m-%d"))


Crawler = OptionOpiCrawler()

if __name__ == "__main__":
    Crawler.main()

print('END ##############')
