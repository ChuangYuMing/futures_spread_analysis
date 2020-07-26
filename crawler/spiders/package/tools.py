import datetime
import time


def getDateObj(date, token):
    dateString = date if token is None else ''.join(date.split(token))
    year = int(dateString[0:4])
    month = int(dateString[4:6])
    day = int(dateString[6:8])
    return {
        'year': year,
        'month': month,
        'day': day,
        'datetime': datetime.date(year, month, day)
    }


# 日期是否有意義
def check_date(date, token):
    date = getDateObj(date, token)
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
            print('日期超過今天')
            return False
        else:
            return True
    except ValueError:
        print('日期錯誤')
        return False
    return True


# 是否為結算日
def is_settle(date, token):
    date = getDateObj(date, token)
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
    num = float(''.join(num.split(',')))
    return num
