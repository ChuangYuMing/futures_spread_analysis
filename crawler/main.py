from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from twisted.internet import reactor
from multiprocessing import Process, Queue
from spiders.weighted_index_spider import WeightedIndexSpider
from spiders.quotes_spider import QuotesSpider

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

def main(arg):
    run_spider(WeightedIndexSpider)
    run_spider(QuotesSpider)

if __name__ == '__main__':
    main()