import React, { useState, useEffect } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import Api from '../../api/api'
import { hightChartCommon } from '../../utils/hightChartOptionsFactory'

function WeightedIndex() {
  const [data, setData] = useState(null)

  useEffect(() => {
    Api.getWeightIndex('2021').then(res => {
      const stockData = []
      for (const key in res) {
        const item = res[key]

        const obj = {}
        obj.y = parseInt(item.w_index)
        obj.x = Date.parse(key)
        obj.date = key
        obj.w_index = item.w_index
        obj.is_settle = item.is_settle
        stockData.push(obj)
      }

      setData(stockData)
    })
  }, [])

  const options = hightChartCommon('加權指數', '價位', '2021', data)

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType="stockChart"
      options={options}
    />
  )
}

export default WeightedIndex
