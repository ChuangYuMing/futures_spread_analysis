import axios from 'axios'

const ApiInstance = axios.create({
  baseURL: 'https://storage.googleapis.com/jamie_stock/'
})

export default {
  getWeightIndex(target) {
    return ApiInstance.get(`weighted_index/${target}.json`).then(
      ({ data }) => data
    )
  }
}
