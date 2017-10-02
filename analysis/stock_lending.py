# encoding: utf-8

from pymongo import MongoClient


client = MongoClient('mongodb://localhost:27017/')
db = client.finance
datas = db.credit.find()


def continue_sell_stock_lending(filter_day):
    # Ｘ天連續借券賣出
    final = []
    for i in datas:
        credit_data = sorted(i['credit_data'], key=lambda k: k['date'], reverse=True)
        if len(credit_data) < filter_day:
            continue
        count = 0
        for k in range(0, filter_day):
            item = credit_data[k]
            try:
                sell_stock_lending = int(item['sl2'])
            except:
                continue
            if sell_stock_lending > 0:
                count = count + 1
        if count == filter_day:
            # print(i["code"], i["name"])
            final.append(i["code"] + i["name"])
    datas.rewind()
    return final


def continue_ssl_balence_reduce(filter_day):
    # X天借券賣出餘額減少
    final = []
    for i in datas:
        credit_data = sorted(i['credit_data'], key=lambda k: k['date'], reverse=True)
        if len(credit_data) < filter_day:
            continue
        count = 0
        for k in range(0, filter_day):
            item = credit_data[k]
            try:
                sell_stock_lending = int(item['sl2'])
                sell_stock_return = int(item['sl3'])
            except:
                continue
            if sell_stock_return - sell_stock_lending > 0:
                count = count + 1
        if count == filter_day:
            # print(i["code"], i["name"])
            final.append(i["code"] + i["name"])
    # print(final)
    return final


def show_info(code):
    data = db.credit.find_one({"code": code})
    credit_data = sorted(data['credit_data'], key=lambda k: k['date'], reverse=True)
    for k in range(0, len(credit_data)):
        sell_stock_lending = int(credit_data[k]['sl2'])
        sell_stock_return = int(credit_data[k]['sl3'])
        print(credit_data[k]['date'], (sell_stock_return - sell_stock_lending) / 1000)


def merge_data():
    d1 = continue_sell_stock_lending(20)
    d2 = continue_ssl_balence_reduce(5)
    for i in d1:
        if i in d2:
            print(i)


merge_data()
# show_info("2303")
# continue_ssl_balence_reduce(5)
