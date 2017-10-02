# encoding: utf-8
# 融券 ＆＆借券賣出

from pymongo import MongoClient
import csv
import requests
import datetime
import re
import json
import time
from package.tools import check_date, format_number

client = MongoClient('mongodb://localhost:27017/')
db = client.finance


class CreditCrawler:
    def __init__(self):
        self.root = '/Users/yuming/Documents/futures_spread_analysis/'
        self.const_name = 'securities_loan_and_stock_lending'

    def request_data(self):
        now_date = datetime.date.today()
        ufile = open(self.root + 'data/last_update_date.json', 'r')
        last_time_obj = json.load(ufile)
        last_time = last_time_obj[self.const_name]
        final_request_date = {}
        for z in range(int(last_time['year']), now_date.year + 1):
            st_month = 1
            end_month = 12
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
                    settle = check_date(str(z) + "/" + str(y) + "/" + str(x))
                    params = syear + smonth + sday
                    if settle:
                        print(str(z) + "/" + str(y) + "/" + str(x))
                        csv_url = 'http://www.twse.com.tw/exchangeReport/TWT93U?response=csv&date=' + params
                        try:
                            download = requests.get(csv_url)
                        except requests.exceptions.ConnectionError as e:
                            print('ConnectionError')
                            # Launchctl do task immediately when mac wake up, but it don't have network
                            time.sleep(120)
                            print('re connect')
                            download = requests.get(csv_url)
                        cr = csv.reader(download.text.splitlines(), delimiter=',')
                        my_list = list(cr)
                        if len(my_list) < 200:
                            continue
                        else:
                            final_request_date["year"] = z
                            final_request_date["month"] = y
                            final_request_date["day"] = x
                        for row in my_list:
                            if len(row) != 16:
                                    continue
                            code = re.sub('=|"', '', row[0])
                            date = datetime.datetime(z, y, x)
                            item = db.credit.find({"code": code}).limit(1)
                            if item.count() == 0:
                                db.credit.insert_one({
                                    "code": code,
                                    "name": row[1],
                                    "credit_data": [{
                                        "date": date,
                                        "se1": format_number(row[2]),
                                        "se2": format_number(row[3]),
                                        "se3": format_number(row[4]),
                                        "se4": format_number(row[5]),
                                        "se5": format_number(row[6]),
                                        "se6": format_number(row[7]),
                                        "sl1": format_number(row[8]),
                                        "sl2": format_number(row[9]),
                                        "sl3": format_number(row[10]),
                                        "sl4": format_number(row[11]),
                                        "sl5": format_number(row[12]),
                                        "sl6": format_number(row[13])
                                    }]
                                })
                            else:
                                db.credit.update_one(
                                {"code": code, "credit_data.date": {"$ne": date}},
                                {"$set": {"name": row[1]},
                                 "$push":
                                    {"credit_data":
                                        {
                                            "date": date,
                                            "se1": format_number(row[2]),
                                            "se2": format_number(row[3]),
                                            "se3": format_number(row[4]),
                                            "se4": format_number(row[5]),
                                            "se5": format_number(row[6]),
                                            "se6": format_number(row[7]),
                                            "sl1": format_number(row[8]),
                                            "sl2": format_number(row[9]),
                                            "sl3": format_number(row[10]),
                                            "sl4": format_number(row[11]),
                                            "sl5": format_number(row[12]),
                                            "sl6": format_number(row[13])
                                        }
                                    }

                                }
                                )

        if len(final_request_date) > 0:
            ufile = open(self.root + 'data/last_update_date.json', 'w')
            last_time_obj[self.const_name]['year'] = final_request_date['year']
            last_time_obj[self.const_name]['month'] = final_request_date['month']
            last_time_obj[self.const_name]['day'] = final_request_date['day']
            json.dump(last_time_obj, ufile, sort_keys=True)


Crawler = CreditCrawler()
Crawler.request_data()

print('END ##############')


# ['2424', '隴華', '0', '0', '0', '0', '0', '7,500,000',|| '0', '0', '0', '0', '0', '1,400', '', '']

# 融券||借券賣出
# 股票代號, 股票名稱, 前日餘額, 賣出, 買進, 現券, 今日餘額, 限額,|| 前日餘額, 當日賣出, 當日還券, 當日調整, 當日餘額, 今日可限額

# 1.「借券賣出當日餘額＝前日餘額+當日賣出-當日還券+當日調整」數額。
# 2. 借券賣出股數含鉅額交易股數。
# 3.「當日調整」數額：為當日集中市場交易類別(普通部位)、(信用部位)與(借券部位)相互調整數額，及錯帳申報等數額。
# 4.「今日可借券賣出限額」：自106年2月23日起為每日盤中借券賣出委託量不得超過該種有價證券前三十個營業日之日平均成交數量之百分之三十。當發生信用額度分配時，依「借券總量控管」辦法產生融券限額與今日可借券賣出限額。
# 託額度之限制，故個股借券賣出成交數量可能大於其當日可借券賣出限額。
# 5. 配合標的證券維護作業系統完成之時間點，本項資訊將於每日晚間執行二次更新作業，更新時間分別約為20時30分及22時30分，實際視日結作業完成時間可能有所異動。
