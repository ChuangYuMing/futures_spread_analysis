#!/bin/sh


PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

echo  "Hello World! \a \n"

python3 /Users/yuming/Documents/futures_spread_analysis/get_three_corporate_option_opi.py
python3 /Users/yuming/Documents/futures_spread_analysis/get_three_corporate_open_interest.py
