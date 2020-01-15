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
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('firebase-adminsdk.json')
default_app = firebase_admin.initialize_app(cred)
db = firestore.client()

params = {
    'datecount': '',
    'contractId2': '',
    'queryDate': '2017/01/17',
    'contractId': 'TX',
}


# 日期是否有意義
def check_date(date):
    date_arr = date.split('/')
    year = int(date_arr[0])
    month = int(date_arr[1]) if date_arr[1][0:1] != "0" else int(date_arr[1][-1])
    day = int(date_arr[2])
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

def format_number(num):
    value = Decimal(sub(r'[^\d.]', '', num))
    value = value*-1 if "-" in num else value
    return str(value)

data = collections.OrderedDict()

for z in range(2018, 2020):
    for y in range(1, 13):
        for x in range(1, 32):
            syear = str(z)
            smonth = str(y) if len(str(y)) != 1 else "0" + str(y)
            sday = str(x) if len(str(x)) != 1 else "0" + str(x)
            params["datecount"] = ''
            params["contractId2"] = ''
            params["contractId"] = 'TX'
            params["queryDate"] = syear + "/" + smonth + "/" + sday

            isValidDate = check_date(params["queryDate"])
            if isValidDate:
                url = "https://www.taifex.com.tw/cht/3/largeTraderFutQry"
                try:
                    res = requests.post(url, data=params)
                    time.sleep(randint(1, 2))
                except requests.exceptions.RequestException as e:
                    print(e)
                    time.sleep(120)
                    print('re connect')
                    res = requests.post(url, data=params)

                soup = BeautifulSoup(res.text, "lxml")

                table = soup.select_one(".sidebar_right").select("table")[2]

                if table.find_all("table"):
                    tr = table.select("table")[0].select("tr")[4]

                    buy_top_five = tr.select("td")[1].stripped_strings
                    buy_top_ten = tr.select("td")[3].stripped_strings
                    sell_top_five = tr.select("td")[5].stripped_strings
                    sell_top_ten = tr.select("td")[7].stripped_strings
                    total = tr.select("td")[9].stripped_strings

                    datestart = params["queryDate"]
                    data[datestart] = {}
                    data[datestart]["buy_top_five"] = format_number(list(buy_top_five)[0])   # 買方-前五大交易人
                    data[datestart]["buy_top_ten"] = format_number(list(buy_top_ten)[0])     # 買方-前十大交易人
                    data[datestart]["sell_top_five"] = format_number(list(sell_top_five)[0]) # 賣方方-前五大交易人
                    data[datestart]["sell_top_ten"] = format_number(list(sell_top_ten)[0])   # 賣方-前十大交易人
                    data[datestart]["total"] = format_number(list(total)[0])                 # 市場未平倉
                    data[datestart]["is_settle"] = is_settle(datestart)

                    print(params["queryDate"])

                else:
                    print(params["queryDate"])
                    print("no data")

    ref = db.collection('tx_open_interest').document(str(z))
    ref.set(data)
    data = collections.OrderedDict()
