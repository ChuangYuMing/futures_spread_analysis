import { Storage, Bucket, File } from '@google-cloud/storage'
import fs from 'fs'
import zlib from 'zlib'
import { promisify } from 'util'
import stream from 'stream'
const pipeline = promisify(stream.pipeline)

type DataItem = {
  name: string
  value: number
}

type Data = DataItem[]

class GCStorage {
  private folderName: string
  private storage: Storage
  private bucket: Bucket

  constructor(folderName: string) {
    this.folderName = folderName
    this.storage = new Storage()
    this.bucket = this.storage.bucket('jamie_stock')
  }

  async getOldData(fileName: string): Promise<Data> {
    const file: File = this.bucket.file(`${this.folderName}/${fileName}.json`)
    const [data]: [Buffer] = await file.download()
    return JSON.parse(data.toString('utf-8')) as Data
  }

  async saveData(fileName: string, data: Data): Promise<void> {
    const file: File = this.bucket.file(`${this.folderName}/${fileName}.json`)
    const jsonStr: string = JSON.stringify(data, null, 2)
    const gzip = zlib.createGzip()
    const source = Buffer.from(jsonStr, 'utf-8')

    await pipeline(
      fs.createReadStream(source),
      gzip,
      file.createWriteStream({
        resumable: false,
        gzip: true,
        metadata: {
          cacheControl: 'no-cache',
          contentType: 'application/json; charset=UTF-8'
        }
      })
    )
  }
}

export default GCStorage
