// 三大法人期貨多空未平倉量
// 只能撈前三年！！
// https://www.taifex.com.tw/cht/3/futContractsDate

import * as cheerio from 'cheerio'
import { format, addDays } from 'date-fns'
import { delay, formatStringNumber as toNum, isSettle } from '../utils/index.ts'
import { saveData, RecordYear } from '../utils/store.ts'
import Api from '../api/index.ts'
import Storage from '../storage/index.ts'
import {
  ThreeOpenInterestParams,
  YearData,
  DataValue
} from './three-corporate-open-interest-spider-types.ts'

const name = 'three_corporate_open_interest'
const args: string[] = process.argv.slice(2)

let startDate: Date = args[0] ? new Date(args[0]) : new Date()
const endDate: Date = args[1] ? new Date(args[1]) : new Date()

const dataStorage = new Storage(name)

const data: RecordYear<YearData> = {}

function trimText(element: cheerio.Cheerio<cheerio.Element>): string {
  return element.text().trim()
}

function parse(queryDate: string, htmlString: string) {
  const $ = cheerio.load(htmlString)
  const sidebarRight = $('.sidebar_right')

  if (!sidebarRight.length) {
    console.log(queryDate, 'no data')
    return
  }

  let table = sidebarRight.find('table').eq(2)

  if (!table.find('table').length) {
    console.log(queryDate, 'no data')
    return
  }

  console.log(queryDate)

  try {
    table = table.find('table').eq(0)
    const bullSelf = trimText(table.find('tr').eq(3).find('td').eq(6)) //自營多方口數
    const bullSelfAmount = trimText(table.find('tr').eq(3).find('td').eq(7)) //自營多方金額
    const bullForeign = trimText(table.find('tr').eq(5).find('td').eq(6)) //外資多方口數
    const bullForeignAmount = trimText(table.find('tr').eq(5).find('td').eq(7)) //外資多方金額

    const bearSelf = trimText(table.find('tr').eq(3).find('td').eq(8)) //自營空方口數
    const bearSelfAmount = trimText(table.find('tr').eq(3).find('td').eq(9)) //自營空方金額
    const bearForeign = trimText(table.find('tr').eq(5).find('td').eq(8)) //外資空方口數
    const bearForeignAmount = trimText(table.find('tr').eq(5).find('td').eq(9)) //外資空方金額

    const diffSelf = trimText(table.find('tr').eq(3).find('td').eq(10)) //自營多空淨額口數
    const diffSelfAmount = trimText(table.find('tr').eq(3).find('td').eq(11)) //自營多空淨額金額
    const diffForeign = trimText(table.find('tr').eq(5).find('td').eq(10)) //外資多空淨額口數
    const diffForeignAmount = trimText(table.find('tr').eq(5).find('td').eq(11)) //外資多空淨額金額

    const year = queryDate.split('/')[0]
    if (!data[year]) {
      data[year] = {}
    }

    data[year][queryDate] = {
      bull_self: toNum(bullSelf),
      bull_self_amount: toNum(bullSelfAmount),
      bull_foreign: toNum(bullForeign),
      bull_foreign_amount: toNum(bullForeignAmount),
      bear_self: toNum(bearSelf),
      bear_self_amount: toNum(bearSelfAmount),
      bear_foreign: toNum(bearForeign),
      bear_foreign_amount: toNum(bearForeignAmount),
      diff_self: toNum(diffSelf),
      diff_self_amount: toNum(diffSelfAmount),
      diff_foreign: toNum(diffForeign),
      diff_foreign_amount: toNum(diffForeignAmount),
      is_settle: isSettle(queryDate, '/')
    }
  } catch (e) {
    console.log('error - %s', name)
    console.log(e)
  }
}

async function save() {
  await saveData<DataValue>(data, dataStorage)
}

async function main() {
  console.log(`start - ${name}`)

  while (startDate <= endDate) {
    const queryDate = format(startDate, 'yyyy/MM/dd')
    console.log(`fetching - ${queryDate}`)

    try {
      await delay(2000)
      const params: ThreeOpenInterestParams = {
        queryType: '1',
        goDay: '',
        doQuery: '1',
        dateaddcnt: '0',
        queryDate,
        commodityId: 'TXF'
      }

      const { data: htmlText } = await Api.getThreeOpenInterest(params)
      parse(queryDate, htmlText)
    } catch (error) {
      console.error(error)
      break
    }

    startDate = addDays(startDate, 1)
  }

  try {
    await save()
  } catch (error) {
    console.error(error)
  }
}

await main()
