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
import {
  ThreeOpenInterestParams,
  ThreeOpenInterestResponse
} from '../crawlers/three-corporate-open-interest-spider-types.ts'

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
  },

  getThreeOpenInterest(params: ThreeOpenInterestParams) {
    const url = 'https://www.taifex.com.tw/cht/3/futContractsDate'
    return ApiInstance.get<ThreeOpenInterestResponse>(url, {
      params
    })
  },

  getStockFuturesList() {
    const url = 'https://www.taifex.com.tw/cht/2/stockLists'
    return ApiInstance.get<string>(url)
  }
}
