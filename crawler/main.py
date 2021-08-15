from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from twisted.internet import reactor
from multiprocessing import Process, Queue
from spiders.weighted_index_spider import WeightedIndexSpider
from spiders.three_corporate_option_opi_spider import OptionOpiSpider
from spiders.tx_open_interest_spider import TxOpenInterestSpider
from spiders.three_corporate_open_interest_spider import FuturesOpiSpider
from spiders.securities_loan_and_stock_lending_spider import CreditSpider
from spiders.stock_futures_list_spider import StockFuturesListSpider
import base64

def crawl(q, spider):
    try:
        settings = get_project_settings()

        runner = CrawlerProcess(settings)
        deferred = runner.crawl(spider)
        deferred.addBoth(lambda _: reactor.stop())
        runner.start()
        q.put(None)
    except Exception as e:
        q.put(e)

# ref: https://stackoverflow.com/questions/41495052/scrapy-reactor-not-restartable
def run_spider(spider):
    q = Queue()
    p = Process(target=crawl, args=(q, spider))
    p.start()
    p.join()
    result = q.get()
    if result is not None:
        raise result

def main():
    run_spider(WeightedIndexSpider)
    run_spider(OptionOpiSpider)
    run_spider(TxOpenInterestSpider)
    run_spider(FuturesOpiSpider)
    run_spider(CreditSpider)
    run_spider(StockFuturesListSpider)

def cloud_pubsub(event, context):
    """Triggered from a message on a Cloud Pub/Sub topic.
    Args:
         event (dict): Event payload.
         context (google.cloud.functions.Context): Metadata for the event.
    """
    pubsub_message = base64.b64decode(event['data']).decode('utf-8')
    print(pubsub_message)
    main()

if __name__ == '__main__':
    main()