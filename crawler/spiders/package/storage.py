from google.cloud import storage
import json

class Storage:
    def __init__(self, folderName):
        self.folderName = folderName
        self.client = storage.Client()
        self.bucket = self.client.get_bucket('jamie_stock')

    def getOldData(self, year):
        data = self.bucket.get_blob('%s/%s.json' % (self.folderName, year)).download_as_string()
        return json.loads(data)

    def saveData(self, year, data):
        blob = self.bucket.blob('%s/%s.json' % (self.folderName, year))
        json_string = json.dumps(data, indent=2, sort_keys=True, ensure_ascii=False)
        blob.upload_from_string(json_string, content_type='application/json;charset=UTF-8')