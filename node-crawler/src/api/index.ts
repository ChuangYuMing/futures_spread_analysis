import { ApiInstance } from './instance.ts'
import {
  WeightedIndexParams,
  WeightedIndexParamsDefault,
  WeightedIndexResponse
} from '../crawlers/weighted-index-spider-types.ts'

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
