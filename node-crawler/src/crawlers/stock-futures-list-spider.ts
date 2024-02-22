// 股票期貨清單
// https://www.taifex.com.tw/cht/2/stockLists

import * as cheerio from 'cheerio'
import Api from '../api/index.ts'
import Storage from '../storage/index.ts'

type StockData = {
  productCode: string
  code: string
  name: string
  isFutures: boolean
  isOption: boolean
  stockNumber: string
}

const name = 'stock_futures_list'
const dataStorage = new Storage(name)
const stockList: StockData[] = []

function parse(htmlString: string) {
  const $ = cheerio.load(htmlString)
  const table = $('#myTable tbody')

  try {
    const trList = table.find('tr')

    trList.each((i, tr) => {
      const stockData: StockData = {
        productCode: $(tr).find('td').eq(0).text().trim(),
        code: $(tr).find('td').eq(2).text().trim(),
        name: $(tr).find('td').eq(3).text().trim(),
        isFutures: $(tr).find('td').eq(4).contents().length > 1,
        isOption: $(tr).find('td').eq(5).contents().length > 1,
        stockNumber: $(tr).find('td').eq(10).text().trim()
      }

      stockList.push(stockData)
    })
  } catch (e) {
    console.log('error - %s', name)
    console.log(e)
  }
}

async function save() {
  await dataStorage.saveData<StockData[]>(name, stockList)
}

async function main() {
  console.log(`start - ${name}`)

  try {
    const { data: htmlText } = await Api.getStockFuturesList()
    parse(htmlText)
    await save()
  } catch (error) {
    console.error(error)
  }
}

await main()
