import axios from 'axios'

const ApiInstance = axios.create({
  baseURL: 'https://storage.googleapis.com/jamie_stock/'
})

export default {
  getWeightIndex(target) {
    return ApiInstance.get(`weighted_index/${target}.json`).then(
      ({ data }) => data
    )
  },
  getOptionOpen(target) {
    return ApiInstance.get(`three_corporate_option_opi/${target}.json`).then(
      ({ data }) => data
    )
  },
  getFuturesOpen(target) {
    return ApiInstance.get(`three_corporate_open_interest/${target}.json`).then(
      ({ data }) => data
    )
  },
  getFuturesBigOpen(target) {
    return ApiInstance.get(`tx_open_interest/${target}.json`).then(
      ({ data }) => data
    )
  },
  getLoanAndLending() {
    return ApiInstance.get(
      `securities_loan_and_stock_lending/loan-and-lending.json`
    ).then(({ data }) => data)
  },
  getStockFuturesList() {
    return ApiInstance.get(`stock_futures_list/stock_futures_list.json`).then(
      ({ data }) => data
    )
  }
}
