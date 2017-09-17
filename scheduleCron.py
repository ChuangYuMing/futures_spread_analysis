from crontab import CronTab

my_cron = CronTab(user='yuming')

for job in my_cron:
    print(job)

root = '/Users/yuming/Documents/futures_spread_analysis'
job = my_cron.new(command='python3 ' + root + '/get_three_corporate_option_opi.py')
job.hour.on(20)
my_cron.write()
