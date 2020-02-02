# encoding: utf-8
# 加權指數
# https://www.twse.com.tw/zh/page/trading/indices/MI_5MINS_HIST.html

import requests
import json
import time
import datetime
import collections
from random import randint
from re import sub
from decimal import Decimal
import firebase_admin
from package.tools import check_date, is_settle, format_number
from firebase_admin import credentials
from firebase_admin import firestore

print('START ############## WeightedIndextCrawler', datetime.datetime.now())

class WeightedIndextCrawler:
    def __init__(self):
        self.url = 'https://www.twse.com.tw/indicesReport/MI_5MINS_HIST'
        self.data = collections.OrderedDict()
        self.params = {
            "response": "json",
            "date": "20160105"
        }
    def main(self):
        cred = credentials.Certificate('firebase-adminsdk.json')
        default_app = firebase_admin.initialize_app(cred)
        self.db = firestore.client()

        self.request_data()

    def saveDatas(self, year):
        ref = self.db.collection('weighted_index').document(str(year))
        ref.set(self.data, merge=True)
        self.data = collections.OrderedDict()

    # 西元
    def format_ad_date(self, date):
        date_arr = date.split('/')
        year = date_arr[0]
        month = date_arr[1]
        day = date_arr[2]
        year = str(int(year) + 1911)
        return year + '/' + month + '/' + day

    def get_last_update_date(self):
        docs = self.db.collection('weighted_index').stream()

        for lastDoc in docs:
            pass

        sortedDoc = sorted(lastDoc.to_dict().items())
        return sortedDoc[-1][0]

    def request_data(self):
        last_update_date = self.get_last_update_date()
        last_update_datetime = datetime.datetime.strptime(last_update_date, "%Y/%m/%d").date()
        last_year = last_update_datetime.year
        last_month = last_update_datetime.month
        
        now_date = datetime.date.today()
        now_year = now_date.year
        now_month = now_date.month

        while (last_year <= now_year):
            if last_year < now_year:
                target_month = 12
            else :
                target_month = now_month

            while (last_month <= target_month):
                syear = str(last_year)
                smonth = str(last_month) if len(str(last_month)) != 1 else "0" + str(last_month)
                sday = "01"

                datestart = syear + "/" + smonth + "/" + sday
                isValidDate = check_date(datestart, "/")

                if isValidDate:
                    self.params["date"] = syear + smonth + sday
                    try:
                        print(self.params["date"])
                        res = requests.get(self.url, params=self.params)
                        time.sleep(randint(1, 2))
                    except requests.exceptions.RequestException as e:
                        print(e)
                        time.sleep(120)
                        print('re connect')
                        res = requests.get(self.url, params=self.params)

                    res = res.json()
                    if (res['stat']) == 'OK':
                        datas = res["data"]
                        for item in datas:
                            datestart = self.format_ad_date(item[0])
                            self.data[datestart] = {}
                            self.data[datestart]["open"] = format_number(item[1].split(".")[0]) # 開盤
                            self.data[datestart]["high"] = format_number(item[2].split(".")[0]) # 最高
                            self.data[datestart]["low"] = format_number(item[3].split(".")[0])  # 最低
                            self.data[datestart]["w_index"] = format_number(item[4].split(".")[0]) # 收盤
                            self.data[datestart]["is_settle"] = is_settle(datestart, '/')

                    else:
                        print("no data")

                last_month = last_month + 1

            self.saveDatas(last_year)
            last_year = last_year + 1
            last_month = 1

Crawler = WeightedIndextCrawler()

if __name__ == "__main__":
    Crawler.main()

print('END ##############')