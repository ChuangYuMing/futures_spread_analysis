# encoding: utf-8
# 加權指數

import requests
from bs4 import BeautifulSoup
import json
import time
import datetime
import collections
from re import sub
from decimal import Decimal

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


# 日期是否有意義
def check_date(year, month ,day):
  now_date = datetime.datetime.now()
  try:
    request_date = datetime.date(year, month, day)
    nowstamp = time.mktime(now_date.timetuple())
    requeststamp = time.mktime(request_date.timetuple())
    diff = requeststamp -  nowstamp
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
    bb_date = n_date + datetime.timedelta(days = -21)
    b_date = n_date + datetime.timedelta(days = -14)
    a_date = n_date + datetime.timedelta(days = 7)
    if b_date.month == month and a_date.month == month and bb_date.month != month:
      return True
  return False

def request_data(url, params):
    global count
    print(params.date)
    res = requests.get(crawl_url, params = params)
    aa = ''
    count = count + 1
    if count > 10:
        time.sleep( 2 )
        count = 0
    try:
      aa = json.loads(res.text)
      if isinstance(aa, dict) == True:
          return aa
    except:
        time.sleep( 2 )
        aa = request_data(url, params)
        if isinstance(aa, dict) == True:
            return aa

data = collections.OrderedDict()

for z in range(2017,2018):
  for y in range(9,10):
    for x in range(1,17):
      syear = str(z)
      smonth = str(y) if len(str(y)) != 1 else "0" + str(y)
      sday = str(x) if len(str(x)) != 1 else "0" + str(x)
      if check_date(z, y, x) != True:
          continue
      params["date"] = syear  + smonth  + sday
      crawl_url = "http://www.twse.com.tw/exchangeReport/MI_INDEX"
      aa = request_data(crawl_url, params)

      if (aa['stat']) == 'OK':
        first_row = aa['data1'][1]
        if first_row[0] == "發行量加權股價指數":
          w_index = first_row[1]
        else:
          w_index = soup.select("table")[0].select("tbody")[0].select("tr")[1].select("td")[1].text.strip()

        datestart = syear + "/" + smonth + "/" + sday
        data[datestart] = {}
        data[datestart]["w_index"] = format_number(w_index).split(".")[0]
        data[datestart]["is_settle"] = is_settle(datestart)
        print(datestart)

      else:
        print("no data")
        print(params["date"])

  # od = collections.OrderedDict(sorted(data.items(), key=lambda t: t[0]))
  jsonarray = json.dumps(data, sort_keys=True)
  with open('data/weighted_index/' + syear + '.json', 'w') as outfile:
      json.dump(data, outfile)

  data = collections.OrderedDict()
