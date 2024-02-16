// 加權指數
// https://www.twse.com.tw/zh/page/trading/indices/MI_5MINS_HIST.html

import axios from 'axios'
import { format, addMonths, setDate } from 'date-fns'
import { delay, formatStringNumber, isSettle } from '../utils/index.ts'
import Api from '../api/index.ts'
import {
  YearData,
  WeightedIndexParams,
  WeightedIndexResElement,
  WeightedIndexRes
} from './weighted-index-spider-types.ts'
import Storage from '../storage/index.ts'

const name = 'weighted_index'
const args: string[] = process.argv.slice(2)

let startDate: Date = args[0]
  ? setDate(new Date(args[0]), 1)
  : setDate(new Date(), 1)

const endDate: Date = args[1]
  ? setDate(new Date(args[1]), 1)
  : setDate(new Date(), 1)

const dataStorage = new Storage(name)

const data: { [year: string]: YearData } = {}

// 民國轉西元
function formatAdDate(date: string) {
  const dateArr = date.split('/')
  const year = dateArr[0]
  const month = dateArr[1]
  const day = dateArr[2]
  const adYear = String(parseInt(year) + 1911)
  return adYear + '/' + month + '/' + day
}

function handleResponse(res: WeightedIndexRes) {
  res.forEach((item: WeightedIndexResElement) => {
    const [date, open, high, low, w_index] = item
    const adDate = formatAdDate(date)
    const year = adDate.split('/')[0]

    data[year] = data[year] || {}
    data[year][adDate] = {
      open: formatStringNumber(open),
      high: formatStringNumber(high),
      low: formatStringNumber(low),
      w_index: formatStringNumber(w_index),
      is_settle: isSettle(adDate, '/')
    }
  })
}

async function saveData() {
  for (const year in data) {
    const fileName = year
    const yearData = data[year]
    let oldData
    try {
      oldData = await dataStorage.getOldData<YearData>(fileName)
    } catch (error) {
      oldData = {}
    }
    const newData = { ...oldData, ...yearData }
    await dataStorage.saveData<YearData>(fileName, newData)
  }
}

async function main() {
  console.log(`start - ${name}`)
  while (startDate <= endDate) {
    console.log(`fetching - ${format(startDate, 'yyyyMM01')}`)
    try {
      await delay(2000)
      const params: WeightedIndexParams = {
        response: 'json',
        date: format(startDate, 'yyyyMM01') // 20220101
      }

      const { data } = await Api.getWeightedIndex(params)
      const { stat, data: res } = data

      if (stat !== 'OK' || !data) {
        break
      }

      handleResponse(res)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error)
      }
    }
    startDate = addMonths(startDate, 1)
  }

  try {
    await saveData()
  } catch (error) {
    console.error(error)
  }

  return Promise.resolve()
}

await main()
