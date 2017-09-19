import datetime
import time
from re import sub
from decimal import Decimal


def format_date(date):
    date_arr = date.split('/')
    d = {
        'year': int(date_arr[0]),
        'month': int(date_arr[1]) if date_arr[1][0:1] != "0" else int(date_arr[1][-1]),
        'day': int(date_arr[2])
    }
    return d


# 日期是否有意義
def check_date(date):
    date = format_date(date)
    year = date['year']
    month = date['month']
    day = date['day']
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
    date = format_date(date)
    year = date['year']
    month = date['month']
    day = date['day']
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
