// 加權指數
// https://www.twse.com.tw/zh/page/trading/indices/MI_5MINS_HIST.html

import axios from 'axios'
import { format, addMonths, setDate } from 'date-fns'
import { delay } from '../utils/index.ts'

const args: string[] = process.argv.slice(2)

let startDate: Date = args[0]
  ? setDate(new Date(args[0]), 1)
  : setDate(new Date(), 1)

const endDate: Date = args[1]
  ? setDate(new Date(args[1]), 1)
  : setDate(new Date(), 1)
const url = 'https://www.twse.com.tw/indicesReport/MI_5MINS_HIST'

function getWeightedIndex(date: Date) {
  const params = {
    response: 'json',
    date: format(date, 'yyyyMM01') // 20220101
  }
  return axios.get(url, { params })
}

async function main() {
  while (startDate <= endDate) {
    try {
      await delay(2000)
      const response = await getWeightedIndex(startDate)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
    startDate = addMonths(startDate, 1)
  }

  return Promise.resolve()
}

await main()
