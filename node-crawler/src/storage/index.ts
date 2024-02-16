import { Storage, Bucket, File } from '@google-cloud/storage'
import { Readable } from 'stream'
import { pipeline } from 'stream/promises'

class GCStorage {
  private folderName: string
  private storage: Storage
  private bucket: Bucket

  constructor(folderName: string) {
    this.folderName = folderName
    this.storage = new Storage()
    this.bucket = this.storage.bucket('jamie_stock')
  }

  async getOldData<T>(fileName: string): Promise<T> {
    const file: File = this.bucket.file(`${this.folderName}/${fileName}.json`)
    const [data]: [Buffer] = await file.download()
    return JSON.parse(data.toString('utf-8')) as T
  }

  async saveData<T>(fileName: string, data: T): Promise<void> {
    const file: File = this.bucket.file(`${this.folderName}/${fileName}.json`)
    const jsonStr: string = JSON.stringify(data, null, 2)
    const source = Buffer.from(jsonStr, 'utf-8')

    await pipeline(
      Readable.from(source),
      file.createWriteStream({
        resumable: false,
        gzip: false,
        metadata: {
          cacheControl: 'no-cache',
          contentType: 'application/json; charset=UTF-8'
        }
      })
    )
  }
}

export default GCStorage
