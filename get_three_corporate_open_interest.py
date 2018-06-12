# encoding: utf-8
# 三大法人期貨多空未平倉量
# 只能撈前三年！！！

import psycopg2
import psycopg2.extras
import requests
from bs4 import BeautifulSoup
import json
import collections
import os
import datetime
from package.tools import check_date, is_settle, format_number, format_date
import time
from random import randint

print('START ############## FuturesOpiCrawler', datetime.datetime.now())


class FuturesOpiCrawler:
    def __init__(self):
        self.url = 'http://www.taifex.com.tw/chinese/3/7_12_3.asp'
        self.data = collections.OrderedDict()
        self.root = '/Users/yuming/Documents/futures_spread_analysis/'
        self.const_name = 'three_corporate_open_interest'
        self.params = {
            "goday": "",
            "DATA_DATE_Y": 2012,
            "DATA_DATE_M": "02",
            "DATA_DATE_D": "25",
            "syear": 2012,
            "smonth": "02",
            "sday": "25",
            "datestart": "2012/02/25",
            "COMMODITY_ID": "TXF"
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
        self.cursor.execute('SELECT corporate_open_interest FROM update_date')
        rows = self.cursor.fetchall()
        for row in rows:
            return row[0]
            # return (row[0].strftime("%Y-%m-%d"))

    def get_last_update_item(self):
        self.cursor.execute(
            'SELECT * FROM corporate_open_interest ORDER BY date DESC LIMIT 1')
        rows = self.cursor.fetchall()
        if len(rows) > 0:
            return rows[0]
        return

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

            self.params["datestart"] = syear + "/" + smonth + "/" + sday
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
                    bull_self = table.select("tr")[3].select("td")[
                        9].text.strip()
                    bull_trust = table.select("tr")[4].select("td")[
                        7].text.strip()
                    bull_foreign = table.select("tr")[5].select("td")[
                        7].text.strip()

                    bear_self = table.select("tr")[3].select("td")[
                        11].text.strip()
                    bear_trust = table.select("tr")[4].select("td")[
                        9].text.strip()
                    bear_foreign = table.select("tr")[5].select("td")[
                        9].text.strip()

                    diff_self = table.select("tr")[3].select("td")[
                        13].text.strip()
                    diff_trust = table.select("tr")[4].select("td")[
                        11].text.strip()
                    diff_foreign = table.select("tr")[5].select("td")[
                        11].text.strip()

                    if self.last_update_item:
                        bull_s = format_number(bull_self)
                        bear_f = format_number(bear_foreign)
                        if self.last_update_item[0] == bull_s and self.last_update_item[5] == bear_f:
                            print('same data!')
                            break

                    data = (
                        format_number(bull_self),
                        format_number(bull_trust),
                        format_number(bull_foreign),
                        format_number(bear_self),
                        format_number(bear_trust),
                        format_number(bear_foreign),
                        format_number(diff_self),
                        format_number(diff_trust),
                        format_number(diff_foreign),
                        format_number(
                            bull_self)+format_number(bull_trust)+format_number(bull_foreign),
                        format_number(
                            bear_self)+format_number(bear_trust)+format_number(bear_foreign),
                        format_number(
                            diff_self)+format_number(diff_trust)+format_number(diff_foreign),
                        is_settle(datestart),
                        datestart)
                    self.last_update_item = data
                    final_data.append(data)

                else:
                    print(self.params["datestart"], "no data")
            next_date = next_date + datetime.timedelta(days=1)

        if len(final_data) > 0:
            print('here')
            insert_query = 'insert into corporate_open_interest (bull_self, bull_trust,bull_foreign,bear_self,bear_trust,bear_foreign,diff_self,diff_trust,diff_foreign,bull_total,bear_total,diff_total,is_settle,date) values %s'
            psycopg2.extras.execute_values(
                self.cursor, insert_query, final_data, template=None
            )
        update_query = 'UPDATE update_date SET corporate_open_interest=%s'
        # last_date = next_date + datetime.timedelta(days=-1)
        last_date = now_date.strftime("%Y-%m-%d")
        self.cursor.execute(update_query, (last_date,))
        self.dbconn.commit()
        return


Crawler = FuturesOpiCrawler()
# Crawler.request_data()
# Crawler.update_data()
if __name__ == "__main__":
    Crawler.main()

print('END ##############')
