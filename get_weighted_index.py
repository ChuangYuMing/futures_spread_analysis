# encoding: utf-8
# 加權指數

import requests
import json
import time
import datetime
import collections
from re import sub
from decimal import Decimal
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('firebase-adminsdk.json')
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()

params = {
  "response": "json",
  "date": "20160105",
  "type": "MS"
}
count = 0

td_month = 1
td_final_price = 5


def find_tr_index(table):
    tr_index = 1
    month = table.select("tr")[tr_index].select("td")[td_month].text
    while "W" in month:

        tr_index = tr_index + 1
        month = table.select("tr")[tr_index].select("td")[td_month].text
    return tr_index


def format_year(year):
    n_year = int(year) + 1911
    return str(n_year)


def format_number(num):
    value = Decimal(sub(r'[^\d.]', '', num))
    value = value*-1 if "-" in num else value
    return str(value)

# 西元
def format_ad_date(date):
    date_arr = date.split('/')
    year = date_arr[0]
    month = date_arr[1]
    day = date_arr[2]
    year = str(int(year) + 1911)
    return year + '/' + month + '/' + day

# 日期是否有意義
def check_date(year, month, day):
    now_date = datetime.datetime.now()
    try:
        request_date = datetime.date(year, month, day)
        nowstamp = time.mktime(now_date.timetuple())
        requeststamp = time.mktime(request_date.timetuple())
        diff = requeststamp - nowstamp
        if now_date.day == day:
            if diff < -72000:
                return True
            else:
                return False
        else:
            if diff > 0:
                return False
            else:
                return True
    except ValueError:
        return False
    return True


# 是否為結算日
def is_settle(date):
    date_arr = date.split('/')
    year = int(date_arr[0])
    month = int(date_arr[1]) if date_arr[1][0:1] != "0" else int(date_arr[1][-1])
    day = int(date_arr[2])
    n_date = datetime.date(year, month, day)
    weekday = n_date.strftime("%w")

    if weekday == "3":
        bb_date = n_date + datetime.timedelta(days=-21)
        b_date = n_date + datetime.timedelta(days=-14)
        a_date = n_date + datetime.timedelta(days=7)
        if b_date.month == month and a_date.month == month and bb_date.month != month:
            return True
    return False


def request_data(url, params):
    global count
    print(params["date"])
    res = requests.get(crawl_url, params=params)
    aa = ''
    count = count + 1
    if count > 10:
        time.sleep(2)
        count = 0
    try:
        aa = json.loads(res.text)
        if isinstance(aa, dict) is True:
            return aa
    except:
        time.sleep(2)
        aa = request_data(url, params)
        if isinstance(aa, dict) is True:
            return aa


data = collections.OrderedDict()
for z in range(2018, 2021):
    for y in range(1, 13):
        syear = str(z)
        smonth = str(y) if len(str(y)) != 1 else "0" + str(y)
        sday = "01"
        if check_date(z, y, 1) is not True:
            continue
        params["date"] = syear + smonth + sday
        params["response"] = "json"
        crawl_url = "https://www.twse.com.tw/indicesReport/MI_5MINS_HIST"
        res = request_data(crawl_url, params)

        if (res['stat']) == 'OK':
            datas = res["data"]
            for item in datas:
                datestart = format_ad_date(item[0])
                data[datestart] = {}
                data[datestart]["open"] = format_number(item[1]).split(".")[0] # 開盤
                data[datestart]["high"] = format_number(item[2]).split(".")[0] # 最高
                data[datestart]["low"] = format_number(item[3]).split(".")[0]  # 最低
                data[datestart]["w_index"] = format_number(item[4]).split(".")[0] # 收盤
                data[datestart]["is_settle"] = is_settle(datestart)

        else:
            print("no data")
            print(params["date"])

    ref = db.collection('weighted_index').document(str(z))
    ref.set(data)
    data = collections.OrderedDict()
