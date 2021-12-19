# Deploy

> gcloud functions deploy stock_crawler2 --entry-point cloud_pubsub --runtime python39 --trigger-topic stock_crawler --region asia-east1 --source=. --verbosity error

# Crawler

> scrapy crawl securities_loan_and_stock_lending -a start=20210730 -a end=20210730

# Active python venv

> source /Users/yuming/Documents/futures_spread_analysis/crawler/bin/activate
