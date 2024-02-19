// 期貨大額交易人未沖銷部位
// https://www.taifex.com.tw/cht/3/largeTraderFutQry

import * as cheerio from 'cheerio'
import axios from 'axios'
import { format, addDays } from 'date-fns'
import { delay, formatStringNumber, isSettle } from '../utils/index.ts'
import {
  TxOpenInterestParams,
  YearData
} from './tx-open-interest-spider-types.ts'
import Api from '../api/index.ts'

const name = 'tx_open_interest'
const args: string[] = process.argv.slice(2)

let startDate: Date = args[0] ? new Date(args[0]) : new Date()
const endDate: Date = args[1] ? new Date(args[1]) : new Date()

const data: { [year: string]: YearData } = {}

function parse(queryDate: string, htmlString: string) {
  const $ = cheerio.load(htmlString)
  const table = $('.sidebar_right').find('table').eq(2)

  if (table.find('table').length === 0) {
    console.log(queryDate, 'no data')
    return
  }

  try {
    const tr = table.find('table').eq(0).find('tr').eq(4)

    const buy_top_five = tr.find('td').eq(1).text().trim()
    const buy_top_ten = tr.find('td').eq(3).text().trim()
    const sell_top_five = tr.find('td').eq(5).text().trim()
    const sell_top_ten = tr.find('td').eq(7).text().trim()
    const total = tr.find('td').eq(9).text().trim()

    const year = queryDate.split('/')[0]
    if (!data[year]) {
      data[year] = {}
    }

    data[year][queryDate] = {
      buy_top_five: formatStringNumber(buy_top_five), // 買方-前五大交易人
      buy_top_ten: formatStringNumber(buy_top_ten), // 買方-前十大交易人
      sell_top_five: formatStringNumber(sell_top_five), // 賣方方-前五大交易人
      sell_top_ten: formatStringNumber(sell_top_ten), // 賣方-前十大交易人
      total: formatStringNumber(total), // 市場未平倉
      is_settle: isSettle(queryDate, '/')
    }

    console.log(data)
  } catch (e) {
    console.log('error - %s', name)
    console.error(e)
  }
}

async function main() {
  console.log(`start - ${name}`)

  while (startDate <= endDate) {
    const queryDate = format(startDate, 'yyyy/MM/dd')
    console.log(`fetching - ${queryDate}`)

    try {
      await delay(2000)
      const params: TxOpenInterestParams = {
        datecount: '',
        contractId2: '',
        queryDate: queryDate,
        contractId: 'TX'
      }

      const { data: htmlText } = await Api.getTxOpenInterest(params)
      parse(queryDate, htmlText)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error)
      }
    }

    startDate = addDays(startDate, 1)
  }
}

await main()
