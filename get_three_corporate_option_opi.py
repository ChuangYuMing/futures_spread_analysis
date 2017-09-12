# encoding: utf-8
# 三大法人選擇權未平倉量
# 只能撈前三年！！！

import requests
from bs4 import BeautifulSoup
import json
import datetime
import collections
from re import sub
from decimal import Decimal

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


# 日期是否有意義
def check_date(date):
  date_arr = date.split('/')
  year = int(date_arr[0])
  month = int(date_arr[1]) if date_arr[1][0:1] != "0" else int(date_arr[1][-1])
  day = int(date_arr[2])

  try:
    n_date = datetime.date(year, month, day)
  except ValueError:
      return "ValueError"
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

def format_number(num):
  value = Decimal(sub(r'[^\d.]', '', num))
  value = value*-1 if "-" in num else value
  return str(value)

data = collections.OrderedDict()

for z in range(2016,2017):
  for y in range(1,13):
    for x in range(1,32):
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
      if settle != "ValueError":
        res = requests.post("http://www.taifex.com.tw/chinese/3/7_12_5.asp", data = params)
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

          print(datestart)

        else:
          print("no data")
          print(params["datestart"])

  # od = collections.OrderedDict(sorted(data.items(), key=lambda t: t[0]))
  jsonarray = json.dumps(data, sort_keys=True)
  with open('data/three_corporate_option_opi/' + str(z) + '.json', 'w') as outfile:
      json.dump(data, outfile)

  data = collections.OrderedDict()
