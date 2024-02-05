// 加權指數
// https://www.twse.com.tw/zh/page/trading/indices/MI_5MINS_HIST.html

import axios from 'axios'
import { format, addMonths, setDate } from 'date-fns'
import { delay } from '../utils/index.ts'
import Api, { WeightedIndexParams } from '../api/index.ts'

const args: string[] = process.argv.slice(2)

let startDate: Date = args[0]
  ? setDate(new Date(args[0]), 1)
  : setDate(new Date(), 1)

const endDate: Date = args[1]
  ? setDate(new Date(args[1]), 1)
  : setDate(new Date(), 1)

async function main() {
  while (startDate <= endDate) {
    try {
      await delay(2000)
      const params: WeightedIndexParams = {
        response: 'json',
        date: format(startDate, 'yyyyMM01') // 20220101
      }

      const { data } = await Api.getWeightedIndex(params)
      const { stat, data: res } = data
      console.log(stat, res)

      if (stat !== 'OK' || !data) {
        break
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error)
      }
    }
    startDate = addMonths(startDate, 1)
  }

  return Promise.resolve()
}

await main()
