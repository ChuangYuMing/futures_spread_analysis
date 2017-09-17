# encoding: utf-8
# 三大法人選擇權未平倉量
# 只能撈前三年！！！

import requests
from bs4 import BeautifulSoup
import json
import datetime
import time
import collections
from re import sub
from decimal import Decimal
import os
import sys, traceback

root = '/Users/yuming/Documents/futures_spread_analysis/'
const_name = 'get_three_corporate_option_opi'
params = {
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

print('START ##############')


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


def update_data(data, year):
    url = root + 'data/three_corporate_option_opi/' + year + '.json'
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


def main():
    data = collections.OrderedDict()
    now_date = datetime.date.today()
    ufile = open(root + 'data/last_update_date.json', 'r')
    last_time_obj = json.load(ufile)
    last_time = last_time_obj[const_name]
    for z in range(int(last_time['year']), now_date.year + 1):
        st_month = 1
        end_month = 12
        last_item = {}
        try:
            old_file = open(root + 'data/three_corporate_option_opi/' + str(z) + '.json', 'r')
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
                params["DATA_DATE_Y"] = syear
                params["DATA_DATE_M"] = smonth
                params["DATA_DATE_D"] = sday
                params["syear"] = syear
                params["smonth"] = smonth
                params["sday"] = sday

                params["datestart"] = syear + "/" + smonth + "/" + sday
                settle = check_date(params["datestart"])
                if settle:
                    print(last_item['f_buy_call'], params["datestart"])
                    res = requests.post("http://www.taifex.com.tw/chinese/3/7_12_5.asp", data=params)
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
                            print(last_item['f_buy_call'], f_buy_call)
                            if last_item['f_buy_call'] == f_buy_call and last_item['f_sell_put_amount'] == f_sell_put_amount:
                                break
                        datestart = params["datestart"]
                        data[datestart] = {}
                        data[datestart]["f_buy_call"] = format_number(f_buy_call)
                        data[datestart]["f_buy_put"] = format_number(f_buy_put)
                        data[datestart]["f_buy_call_amount"] = format_number(f_buy_call_amount)
                        data[datestart]["f_buy_put_amount"] = format_number(f_buy_put_amount)
                        data[datestart]["f_sell_call"] = format_number(f_sell_call)
                        data[datestart]["f_sell_put"] = format_number(f_sell_put)
                        data[datestart]["f_sell_call_amount"] = format_number(f_sell_call_amount)
                        data[datestart]["f_sell_put_amount"] = format_number(f_sell_put_amount)
                        data[datestart]["is_settle"] = is_settle(datestart)
                        last_item = data[datestart]
                    else:
                        print(params["datestart"], "no data")
        update_data(data, str(z))
        data = collections.OrderedDict()

    ufile = open(root + 'data/last_update_date.json', 'w')
    last_time_obj[const_name]['year'] = now_date.year
    last_time_obj[const_name]['month'] = now_date.month
    last_time_obj[const_name]['day'] = now_date.day
    json.dump(last_time_obj, ufile, sort_keys=True)


main()
print('END ##############')
