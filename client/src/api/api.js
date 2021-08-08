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
  }
}
