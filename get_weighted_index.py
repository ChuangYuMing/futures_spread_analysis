# 加權指數

import requests
from bs4 import BeautifulSoup
import json
import datetime
import collections
from re import sub
from decimal import Decimal

params = {
  "download": "",
  "qdate": "105/06/02",
  "selectType": "MS"
}


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

data = collections.OrderedDict()

for z in range(105,106):
  for y in range(1,13):
    for x in range(1,32):
      syear = str(z)
      smonth = str(y) if len(str(y)) != 1 else "0" + str(y)
      sday = str(x) if len(str(x)) != 1 else "0" + str(x)

      params["qdate"] = syear + "/" + smonth + "/" + sday
      crawl_url = "http://www.twse.com.tw/ch/trading/exchange/MI_INDEX/MI_INDEX.php"
      res = requests.post(crawl_url, data = params)
      soup = BeautifulSoup(res.text, "lxml")

      if soup.select("table")[0].select("tbody")[0].select("tr td")[0].text.strip() != "查無資料":
        first_row = soup.select("table")[0].select("tbody")[0].select("tr")[0].select("td")[0].text.strip()
        if first_row == "發行量加權股價指數":
          w_index = soup.select("table")[0].select("tbody")[0].select("tr")[0].select("td")[1].text.strip()
        else:
          w_index = soup.select("table")[0].select("tbody")[0].select("tr")[1].select("td")[1].text.strip()

        datestart = format_year(z) + "/" + smonth + "/" + sday
        data[datestart] = {}
        data[datestart]["w_index"] = format_number(w_index).split(".")[0]
        print(datestart)

      else:
        print("no data")
        print(params["qdate"])

  # od = collections.OrderedDict(sorted(data.items(), key=lambda t: t[0]))
  jsonarray = json.dumps(data, sort_keys=True)
  with open('data/weighted_index/' + format_year(z) + '.json', 'w') as outfile:
      json.dump(data, outfile)

  data = collections.OrderedDict()
















