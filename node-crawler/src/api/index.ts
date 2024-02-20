import { ApiInstance } from './instance.ts'
import {
  WeightedIndexParams,
  WeightedIndexParamsDefault,
  WeightedIndexResponse
} from '../crawlers/weighted-index-spider-types.ts'
import {
  TxOpenInterestParams,
  TxOpenInterestResponse
} from '../crawlers/tx-open-interest-spider-types.ts'
import {
  ThreeOptionOpiParams,
  ThreeOptionOpiResponse
} from '../crawlers/three-corporate-option-opi-spider-types.ts'

export default {
  getWeightedIndex(params: WeightedIndexParams) {
    const url = 'https://www.twse.com.tw/indicesReport/MI_5MINS_HIST'
    return ApiInstance.get<WeightedIndexResponse>(url, {
      params: {
        ...WeightedIndexParamsDefault,
        ...params
      }
    })
  },

  getTxOpenInterest(params: TxOpenInterestParams) {
    const url = 'https://www.taifex.com.tw/cht/3/largeTraderFutQry'
    return ApiInstance.get<TxOpenInterestResponse>(url, {
      params
    })
  },

  getThreeOptionOpi(params: ThreeOptionOpiParams) {
    const url = 'https://www.taifex.com.tw/cht/3/callsAndPutsDate'
    return ApiInstance.get<ThreeOptionOpiResponse>(url, {
      params
    })
  }
}
