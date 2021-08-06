from google.cloud import storage
import json
import gzip

class Storage:
    def __init__(self, folderName):
        self.folderName = folderName
        self.client = storage.Client()
        self.bucket = self.client.get_bucket('jamie_stock')

    def getOldData(self, fileName):
        data = self.bucket.get_blob('%s/%s.json' % (self.folderName, fileName)).download_as_string()
        return json.loads(data)

    def saveData(self, fileName, data):
        blob = self.bucket.blob('%s/%s.json' % (self.folderName, fileName))
        blob.content_encoding = 'gzip'
        blob.cache_control = 'no-cache'
        json_string = json.dumps(data, indent=2, sort_keys=True, ensure_ascii=False)

        #https://cloud.google.com/appengine/docs/standard/python3/using-temp-files
        with gzip.open('/tmp/temp.json.gz', 'wt') as f:
            f.write(json_string)

        blob.upload_from_filename("/tmp/temp.json.gz", content_type='application/json;charset=UTF-8')