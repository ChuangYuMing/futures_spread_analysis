export type TxOpenInterestParams = {
  datecount: string
  contractId2: string
  queryDate: string
  contractId: string
}

export type TxOpenInterestResponse = string

export type DataValue = {
  buy_top_five: number
  buy_top_ten: number
  sell_top_five: number
  sell_top_ten: number
  total: number
  is_settle: boolean
}

export type YearData = { [date: string]: DataValue }
