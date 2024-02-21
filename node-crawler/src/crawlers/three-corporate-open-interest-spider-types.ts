export type ThreeOpenInterestParams = {
  queryType: string
  goDay: string
  doQuery: string
  dateaddcnt: string
  queryDate: string
  commodityId: string
}

export type ThreeOpenInterestResponse = string

export type DataValue = {
  bull_self: number
  bull_self_amount: number
  bull_foreign: number
  bull_foreign_amount: number
  bear_self: number
  bear_self_amount: number
  bear_foreign: number
  bear_foreign_amount: number
  diff_self: number
  diff_self_amount: number
  diff_foreign: number
  diff_foreign_amount: number
  is_settle: boolean
}

export type YearData = { [date: string]: DataValue }
