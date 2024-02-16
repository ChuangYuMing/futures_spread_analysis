export interface DataValue {
  open: number
  high: number
  low: number
  w_index: number
  is_settle: boolean
}

export type YearData = { [date: string]: DataValue }

export interface WeightedIndexParams {
  response: string
  date: string
}

export const WeightedIndexParamsDefault: Pick<WeightedIndexParams, 'response'> =
  {
    response: 'json'
  }

export type WeightedIndexResElement = [string, string, string, string, string]
export type WeightedIndexRes = WeightedIndexResElement[]
export interface WeightedIndexResponse {
  data: WeightedIndexRes
  stat: string
}
