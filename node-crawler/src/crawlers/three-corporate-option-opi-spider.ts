// 三大法人選擇權未平倉量
// 只能撈前三年！！！
// https://www.taifex.com.tw/cht/3/callsAndPutsDate

import * as cheerio from 'cheerio'
import { format, addDays } from 'date-fns'
import { delay, formatStringNumber as toNum, isSettle } from '../utils/index.ts'
import { saveData, RecordYear } from '../utils/store.ts'
import Api from '../api/index.ts'
import Storage from '../storage/index.ts'
import {
  ThreeOptionOpiParams,
  YearData,
  DataValue
} from './three-corporate-option-opi-spider-types.ts'

const name = 'three_corporate_option_opi'
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
  const wrapper = $('.sidebar_right')

  if (!wrapper.length) {
    console.log(queryDate, 'can not query now')
    return
  }

  let table = wrapper.find('table').eq(2)

  if (table.find('table').length === 0) {
    console.log(queryDate, 'no data')
    return
  }

  console.log(queryDate)
  table = table.find('table').eq(0)

  try {
    const f_buy_call = trimText(table.find('tr').eq(5).find('td').eq(6))
    const f_buy_put = trimText(table.find('tr').eq(8).find('td').eq(6))
    const f_buy_call_amount = trimText(table.find('tr').eq(5).find('td').eq(7))
    const f_buy_put_amount = trimText(table.find('tr').eq(8).find('td').eq(7))

    const f_sell_call = trimText(table.find('tr').eq(5).find('td').eq(8))
    const f_sell_put = trimText(table.find('tr').eq(8).find('td').eq(8))
    const f_sell_call_amount = trimText(table.find('tr').eq(5).find('td').eq(9))
    const f_sell_put_amount = trimText(table.find('tr').eq(8).find('td').eq(9))

    const self_buy_call = trimText(table.find('tr').eq(3).find('td').eq(6))
    const self_buy_put = trimText(table.find('tr').eq(6).find('td').eq(6))
    const self_buy_call_amount = trimText(
      table.find('tr').eq(3).find('td').eq(7)
    )
    const self_buy_put_amount = trimText(
      table.find('tr').eq(6).find('td').eq(7)
    )

    const self_sell_call = trimText(table.find('tr').eq(3).find('td').eq(8))
    const self_sell_put = trimText(table.find('tr').eq(6).find('td').eq(8))
    const self_sell_call_amount = trimText(
      table.find('tr').eq(3).find('td').eq(9)
    )
    const self_sell_put_amount = trimText(
      table.find('tr').eq(6).find('td').eq(9)
    )

    const f_long = toNum(f_buy_call) + toNum(f_sell_put) // 外資多方口數
    const f_long_amount = toNum(f_buy_call_amount) + toNum(f_sell_put_amount) // 外資多方契約金額
    const f_short = toNum(f_buy_put) + toNum(f_sell_call) // 外資空方口數
    const f_short_amount = toNum(f_buy_put_amount) + toNum(f_sell_call_amount) // 外資空方契約金額
    const f_net = f_long - f_short // 多空淨額口數
    const f_net_amount = f_long_amount - f_short_amount // 多空淨額契約金額

    const self_long = toNum(self_buy_call) + toNum(self_sell_put) // 自營多方口數
    const self_long_amount =
      toNum(self_buy_call_amount) + toNum(self_sell_put_amount) // 自營多方契約金額
    const self_short = toNum(self_buy_put) + toNum(self_sell_call) // 自營空方口數
    const self_short_amount =
      toNum(self_buy_put_amount) + toNum(self_sell_call_amount) // 自營空方契約金額
    const self_net = self_long - self_short // 多空淨額口數
    const self_net_amount = self_long_amount - self_short_amount // 多空淨額契約金額

    const year = queryDate.split('/')[0]
    if (!data[year]) {
      data[year] = {}
    }

    data[year][queryDate] = {
      f_buy_call: toNum(f_buy_call),
      f_buy_put: toNum(f_buy_put),
      f_buy_call_amount: toNum(f_buy_call_amount),
      f_buy_put_amount: toNum(f_buy_put_amount),
      f_sell_call: toNum(f_sell_call),
      f_sell_put: toNum(f_sell_put),
      f_sell_call_amount: toNum(f_sell_call_amount),
      f_sell_put_amount: toNum(f_sell_put_amount),
      self_buy_call: toNum(self_buy_call),
      self_buy_put: toNum(self_buy_put),
      self_buy_call_amount: toNum(self_buy_call_amount),
      self_buy_put_amount: toNum(self_buy_put_amount),
      self_sell_call: toNum(self_sell_call),
      self_sell_put: toNum(self_sell_put),
      self_sell_call_amount: toNum(self_sell_call_amount),
      self_sell_put_amount: toNum(self_sell_put_amount),
      f_long,
      f_long_amount,
      f_short,
      f_short_amount,
      f_net,
      f_net_amount,
      self_long,
      self_long_amount,
      self_short,
      self_short_amount,
      self_net,
      self_net_amount,
      is_settle: isSettle(queryDate, '/')
    }
  } catch (e) {
    console.log('error - %s', name)
    console.error(e)
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
      const params: ThreeOptionOpiParams = {
        queryType: '1',
        goDay: '',
        doQuery: '1',
        dateaddcnt: '',
        queryDate,
        commodityId: 'TXO'
      }

      const { data: htmlText } = await Api.getThreeOptionOpi(params)
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
