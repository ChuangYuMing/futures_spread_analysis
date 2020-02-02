# encoding: utf-8
# 期貨大額交易人未沖銷部位
# https://www.taifex.com.tw/cht/3/largeTraderFutQry

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

print('START ############## TxOpenInterestCrawler', datetime.datetime.now())

class TxOpenInterestCrawler:
    def __init__(self):
        self.url = 'https://www.taifex.com.tw/cht/3/largeTraderFutQry'
        self.data = collections.OrderedDict()
        self.params = {
            'datecount': '',
            'contractId2': '',
            'queryDate': '2017/01/17',
            'contractId': 'TX',
        }

    def main(self):
        cred = credentials.Certificate('firebase-adminsdk.json')
        default_app = firebase_admin.initialize_app(cred)
        self.db = firestore.client()

        self.request_data()

    def saveDatas(self):

        lastItemDate = next(reversed(self.data))
        year = str(lastItemDate).split("/")[0]

        ref = self.db.collection('tx_open_interest').document(year)
        ref.set(self.data, merge=True)
        self.data = collections.OrderedDict()

    def get_last_update_date(self):
        docs = self.db.collection('tx_open_interest').stream()

        for lastDoc in docs:
            pass

        sortedDoc = sorted(lastDoc.to_dict().items())
        return sortedDoc[-1][0]

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

            if isValidDate:
                self.params["queryDate"] = datestart
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
                    tr = table.select("table")[0].select("tr")[4]

                    buy_top_five = tr.select("td")[1].stripped_strings
                    buy_top_ten = tr.select("td")[3].stripped_strings
                    sell_top_five = tr.select("td")[5].stripped_strings
                    sell_top_ten = tr.select("td")[7].stripped_strings
                    total = tr.select("td")[9].stripped_strings

                    datestart = self.params["queryDate"]
                    self.data[datestart] = {}
                    self.data[datestart]["buy_top_five"] = format_number(list(buy_top_five)[0])   # 買方-前五大交易人
                    self.data[datestart]["buy_top_ten"] = format_number(list(buy_top_ten)[0])     # 買方-前十大交易人
                    self.data[datestart]["sell_top_five"] = format_number(list(sell_top_five)[0]) # 賣方方-前五大交易人
                    self.data[datestart]["sell_top_ten"] = format_number(list(sell_top_ten)[0])   # 賣方-前十大交易人
                    self.data[datestart]["total"] = format_number(list(total)[0])                 # 市場未平倉
                    self.data[datestart]["is_settle"] = is_settle(datestart, "/")

                    print(self.params["queryDate"])

                else:
                    print(self.params["queryDate"])
                    print("no data")

            next_date = next_date + datetime.timedelta(days=1)

            if str(next_date.year) != syear:
                self.saveDatas()

        self.saveDatas()


Crawler = TxOpenInterestCrawler()

if __name__ == "__main__":
    Crawler.main()

print('END ##############')