import { ApiInstance } from './instance.ts'

export interface WeightedIndexParams {
  response: string
  date: string
}

const WeightedIndexParamsDefault: Pick<WeightedIndexParams, 'response'> = {
  response: 'json'
}

interface WeightedIndexResponse {
  data: Array<string>
  stat: string
}

export default {
  getWeightedIndex(params: WeightedIndexParams) {
    const url = 'https://www.twse.com.tw/indicesReport/MI_5MINS_HIST'
    return ApiInstance.get<WeightedIndexResponse>(url, {
      params: {
        ...WeightedIndexParamsDefault,
        ...params
      }
    })
  }
}
