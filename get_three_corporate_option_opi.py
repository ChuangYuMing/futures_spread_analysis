# encoding: utf-8
# 三大法人選擇權未平倉量
# 只能撈前三年！！！

import psycopg2
import psycopg2.extras
import requests
from bs4 import BeautifulSoup
import json
import datetime
import collections
import os
from package.tools import check_date, is_settle, format_number, format_date
import time
from random import randint

print('START ############## OptionOpiCrawler', datetime.datetime.now())


class OptionOpiCrawler:
    def __init__(self):
        self.url = 'http://www.taifex.com.tw/chinese/3/7_12_5.asp'
        self.data = collections.OrderedDict()
        self.root = '/Users/yuming/Documents/futures_spread_analysis/'
        self.const_name = 'three_corporate_option_opi'
        self.params = {
            "goday": "",
            "DATA_DATE_Y": 2012,
            "DATA_DATE_M": "02",
            "DATA_DATE_D": "25",
            "syear": 2012,
            "smonth": "02",
            "sday": "25",
            "datestart": "2012-02-25",
            "COMMODITY_ID": "TXO"
        }

    def main(self):
        try:
            self.dbconn = psycopg2.connect(
                host="localhost", port="5432", dbname="stock", user="yuming", password="")
        except psycopg2.OperationalError:
            print('DB Connection Falil')
        else:
            self.cursor = self.dbconn.cursor()
            print('DB Connection Success!')
        self.last_update_date = self.get_last_update_date()
        self.last_update_item = self.get_last_update_item()
        print('last_update_date:', self.last_update_date)
        print('today: ', datetime.date.today())
        self.request_data()

    def get_last_update_date(self):
        self.cursor.execute('SELECT corporate_option_open FROM update_date')
        rows = self.cursor.fetchall()
        for row in rows:
            return row[0]
            # return (row[0].strftime("%Y-%m-%d"))

    def get_last_update_item(self):
        self.cursor.execute(
            'SELECT * FROM corporate_option_open ORDER BY date DESC LIMIT 1')
        rows = self.cursor.fetchall()
        if len(rows) > 0:
            return rows[0]
        return

    def update_data(self):
        return
        # self.cursor.execute('SELECT corporate_option_open FROM update_date')
        # for row in self.cursor:
        #     print(row[0].strftime("%Y-%m-%d"))

    def request_data(self):
        now_date = datetime.date.today()
        # next_date = self.last_update_date
        next_date = self.last_update_date + datetime.timedelta(days=1)
        final_data = []
        while (next_date <= now_date):
            syear = str(next_date.year)
            smonth = str(next_date.month) if len(
                str(next_date.month)) != 1 else "0" + str(next_date.month)
            sday = str(next_date.day) if len(str(next_date.day)
                                             ) != 1 else "0" + str(next_date.day)
            datestart = syear + "-" + smonth + "-" + sday
            checkDate = check_date(datestart)
            self.params["DATA_DATE_Y"] = syear
            self.params["DATA_DATE_M"] = smonth
            self.params["DATA_DATE_D"] = sday
            self.params["syear"] = syear
            self.params["smonth"] = smonth
            self.params["sday"] = sday
            self.params["datestart"] = datestart
            if checkDate:
                try:
                    res = requests.post(self.url, data=self.params)
                    time.sleep(randint(1, 5))
                except requests.exceptions.ConnectionError as e:
                    print('ConnectionError')
                    # Launchctl do task immediately when mac wake up, but it don't have network
                    time.sleep(120)
                    print('re connect')
                    res = requests.post(self.url, data=self.params)
                soup = BeautifulSoup(res.text, "lxml")

                if soup.select("table")[2].find_all("table"):
                    print(self.params["datestart"])
                    table = soup.select("table")[2].select("table")[0]

                    f_buy_call = table.select("tr")[5].select("td")[
                        7].text.strip()
                    f_buy_put = table.select("tr")[8].select("td")[
                        7].text.strip()
                    f_buy_call_amount = table.select("tr")[5].select("td")[
                        8].text.strip()
                    f_buy_put_amount = table.select("tr")[8].select("td")[
                        8].text.strip()

                    f_sell_call = table.select("tr")[5].select("td")[
                        9].text.strip()
                    f_sell_put = table.select("tr")[8].select("td")[
                        9].text.strip()
                    f_sell_call_amount = table.select("tr")[5].select("td")[
                        10].text.strip()
                    f_sell_put_amount = table.select("tr")[8].select("td")[
                        10].text.strip()

                    if self.last_update_item:
                        # print('$$$$$$', self.last_update_item)
                        buy_call = format_number(f_buy_call)
                        sell_put_amount = format_number(
                            f_sell_put_amount)
                        if self.last_update_item[0] == buy_call and self.last_update_item[-3] == sell_put_amount:
                            print('same data!')
                            break

                    data = (
                        format_number(f_buy_call),
                        format_number(f_buy_put),
                        format_number(f_buy_call_amount),
                        format_number(f_buy_put_amount),
                        format_number(f_sell_call),
                        format_number(f_sell_put),
                        format_number(f_sell_call_amount),
                        format_number(f_sell_put_amount),
                        is_settle(datestart),
                        datestart)
                    self.last_update_item = data
                    final_data.append(data)

                else:
                    print(self.params["datestart"], "no data")

            next_date = next_date + datetime.timedelta(days=1)
            # print('--', next_date < now_date)
            # print('--', next_date.strftime("%Y-%m-%d"))

        if len(final_data) > 0:
            print('here')
            insert_query = 'insert into corporate_option_open (f_buy_call, f_buy_put,f_buy_call_amount,f_buy_put_amount,f_sell_call,f_sell_put,f_sell_call_amount,f_sell_put_amount,is_settle,date) values %s'
            psycopg2.extras.execute_values(
                self.cursor, insert_query, final_data, template=None
            )
        update_query = 'UPDATE update_date SET corporate_option_open=%s'
        # last_date = next_date + datetime.timedelta(days=-1)
        last_date = now_date.strftime("%Y-%m-%d")
        self.cursor.execute(update_query, (last_date,))
        self.dbconn.commit()
        return


Crawler = OptionOpiCrawler()
# Crawler.request_data()
# Crawler.update_data()
if __name__ == "__main__":
    Crawler.main()

print('END ##############')
