# encoding: utf-8

from pymongo import MongoClient


client = MongoClient('mongodb://localhost:27017/')
db = client.finance
datas = db.credit.find()
# list_datas = []

# for i in datas:
#     list_datas.append(i)


class analyze:
    def __init__(self, datas):
        list_datas = []
        for i in datas:
            list_datas.append(i)
        self.origin = list_datas
        self.datas = list_datas

    def sell_stock_lending(self, filter_day):
        # Ｘ天連續借券賣出
        final = []
        for i in self.datas:
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
                final.append(i)
        self.datas = final
        # datas.rewind()
        return self

    def ssl_balence_reduce(self, filter_day):
        # X天借券賣出餘額減少
        final = []
        for i in self.datas:
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
                final.append(i)
        self.datas = final
        return self

    def get(self):
        for i in self.datas:
            print(i["code"], i["name"])


def show_info(code):
    data = db.credit.find_one({"code": code})
    credit_data = sorted(data['credit_data'], key=lambda k: k['date'], reverse=True)
    for k in range(0, len(credit_data)):
        sell_stock_lending = int(credit_data[k]['sl2']) #借券當日賣出
        sell_stock_return = int(credit_data[k]['sl3'])  #借券當日還券
        print(credit_data[k]['date'], (sell_stock_return - sell_stock_lending) / 1000)


# filter_data = analyze(datas).sell_stock_lending(5).ssl_balence_reduce(2).get()
# merge_data()
show_info("2823")
# continue_ssl_balence_reduce(5)
