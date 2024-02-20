export type ThreeOptionOpiParams = {
  queryType: string
  goDay: string
  doQuery: string
  dateaddcnt: string
  queryDate: string
  commodityId: string
}

export type ThreeOptionOpiResponse = string

export type DataValue = {
  f_buy_call: number
  f_buy_put: number
  f_buy_call_amount: number
  f_buy_put_amount: number
  f_sell_call: number
  f_sell_put: number
  f_sell_call_amount: number
  f_sell_put_amount: number
  self_buy_call: number
  self_buy_put: number
  self_buy_call_amount: number
  self_buy_put_amount: number
  self_sell_call: number
  self_sell_put: number
  self_sell_call_amount: number
  self_sell_put_amount: number
  f_long: number
  f_long_amount: number
  f_short: number
  f_short_amount: number
  f_net: number
  f_net_amount: number
  self_long: number
  self_long_amount: number
  self_short: number
  self_short_amount: number
  self_net: number
  self_net_amount: number
  is_settle: boolean
}

export type YearData = { [date: string]: DataValue }
