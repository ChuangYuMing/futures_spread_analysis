import axios from 'axios'
import { parse, format, addMonths, setDate } from 'date-fns'

const args = process.argv.slice(2)
let startDate = args[0] ? setDate(new Date(args[0]), 1) : setDate(new Date(), 1)
const endDate = args[1] ? setDate(new Date(args[1]), 1) : setDate(new Date(), 1)
const url = 'https://www.twse.com.tw/indicesReport/MI_5MINS_HIST'

function getParamsFormatDateString(date: Date) {
  return format(date, 'yyyyMM01')
}

function getData(date: Date) {
  const params = {
    response: 'json',
    date: getParamsFormatDateString(date) // 20220101
  }
  return axios.get(url, { params })
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function getWeightedIndex() {
  while (startDate <= endDate) {
    try {
      await delay(2000)
      const response = await getData(startDate)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
    startDate = addMonths(startDate, 1)
  }

  return Promise.resolve()
}

await getWeightedIndex()
