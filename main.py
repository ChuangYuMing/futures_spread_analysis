import requests
from bs4 import BeautifulSoup
import json
import datetime
import collections

params = {
  "qtype": 2,
  "commodity_id": "MTX",
  "commodity_id2": "",
  "goday": "",
  "dateaddcnt": 0,
  "DATA_DATE_Y": 2014,
  "DATA_DATE_M": "02",
  "DATA_DATE_D": "25",
  "syear": 2014,
  "smonth": "02",
  "sday": "25",
  "datestart": "2014/02/25",
  "commodity_idt": "MTX",
  "commodity_id2t": "",
  "commodity_id2t2": "",
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

def is_settle(date):
  date_arr = date.split('/')
  year = int(date_arr[0])
  month = int(date_arr[1]) if date_arr[1][0:1] != "0" else int(date_arr[1][-1])
  day = int(date_arr[2])

  try:
    n_date = datetime.date(year, month, day)
  except ValueError:
      return "ValueError"

  weekday = n_date.strftime("%w")
  if weekday == "3":
    bb_date = n_date + datetime.timedelta(days = -21)
    b_date = n_date + datetime.timedelta(days = -14)
    a_date = n_date + datetime.timedelta(days = 7)
    if b_date.month == month and a_date.month == month and bb_date.month != month:
      return True
  return False

data = collections.OrderedDict()

for y in range(1,13):
  for x in range(1,32):
    smonth = str(y) if len(str(y)) != 1 else "0" + str(y)
    sday = str(x) if len(str(x)) != 1 else "0" + str(x)
    params["DATA_DATE_M"] = smonth
    params["DATA_DATE_D"] = sday
    params["smonth"] = smonth
    params["sday"] = sday

    params["datestart"] = params["datestart"][0:5] + smonth + "/" + sday
    settle = is_settle(params["datestart"])
    if settle != "ValueError":
      res = requests.post("http://www.taifex.com.tw/chinese/3/3_1_1.asp", data = params)
      soup = BeautifulSoup(res.text, "lxml")

      if soup.select("table")[2].find_all("table"):
        table = soup.select("table")[2].select("table")[1]
        tr_index = find_tr_index(table)
        next_tr_index = tr_index + 2 if settle else tr_index + 1

        close_month_price = table.select("tr")[tr_index].select("td")[td_final_price].text.strip()
        next_month_price = table.select("tr")[next_tr_index].select("td")[td_final_price].text.strip()

        close_month = table.select("tr")[tr_index].select("td")[td_month].text.strip()
        next_month = table.select("tr")[next_tr_index].select("td")[td_month].text.strip()

        datestart = params["datestart"]
        data[datestart] = {}
        data[datestart]["close_month"] = close_month
        data[datestart]["close_month_price"] = close_month_price
        data[datestart]["next_month"] = next_month
        data[datestart]["next_month_price"] = next_month_price
        data[datestart]["spread"] = int(close_month_price) - int(next_month_price)
        data[datestart]["is_settle"] = is_settle(datestart)
        print(datestart)

      else:
        print("no data")
        print(params["datestart"])

# od = collections.OrderedDict(sorted(data.items(), key=lambda t: t[0]))
jsonarray = json.dumps(data, sort_keys=True)
with open('data2.json', 'w') as outfile:
    json.dump(data, outfile)


















