import { subDays, addDays, getDay, getMonth, parse } from 'date-fns'

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 17,871.27 -> 17871.27
export function formatStringNumber(str: string): number {
  return parseFloat(str.replace(/,/g, ''))
}

interface DateObj {
  year: number
  month: number
  day: number
  dateTime: Date
}

function getDateObj(date: string, token: string | null): DateObj {
  const dateString = token === null ? date : date.split(token).join('')
  const parsedDate = parse(dateString, 'yyyyMMdd', new Date())
  const year = parsedDate.getFullYear()
  const month = parsedDate.getMonth() + 1
  const day = parsedDate.getDate()

  return {
    year: year,
    month: month,
    day: day,
    dateTime: parsedDate
  }
}

// 是否為結算日
// 每個月的第三個週三是該月合約的最後交易日，也是台指期結算日。 如果這一天是法定假日，則向後順延到下一個開市日。
// 目前計算可能有誤差，因為假日的判斷不夠完整
export function isSettle(date: string, token: string) {
  const dateObj = getDateObj(date, token)
  const year = dateObj['year']
  const month = dateObj['month']
  const day = dateObj['day']
  const nDate = new Date(year, month - 1, day)
  const weekday = getDay(nDate)

  if (weekday === 3) {
    const bbDate = subDays(nDate, 21)
    const bDate = subDays(nDate, 14)
    const aDate = addDays(nDate, 7)
    if (
      getMonth(bDate) === month - 1 &&
      getMonth(aDate) === month - 1 &&
      getMonth(bbDate) !== month - 1
    ) {
      return true
    }
  }
  return false
}
