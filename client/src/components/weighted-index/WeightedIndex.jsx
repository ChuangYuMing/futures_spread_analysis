import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import Api from '../../api/api'
import { hightChartCommon } from '../../utils/hightChartOptionsFactory'
import { zoomToAll } from '../../utils/chart'

function WeightedIndex({ year }) {
  const chartComponent = useRef(null)
  const [options, setOptions] = useState({})

  useEffect(() => {
    Api.getWeightIndex(year).then(res => {
      const stockData = []
      for (const key in res) {
        const item = res[key]

        const obj = {}
        obj.x = Date.parse(key)
        obj.close = parseInt(item.w_index)
        obj.open = parseInt(item.open)
        obj.high = parseInt(item.high)
        obj.low = parseInt(item.low)
        obj.date = key
        obj.is_settle = item.is_settle
        stockData.push(obj)
      }

      const chartOptions = hightChartCommon({
        subject: '加權指數',
        yName: '價位',
        year,
        data: stockData,
        seriesType: 'candlestick'
      })
      setOptions(chartOptions)
      zoomToAll(chartComponent?.current?.chart)
    })
  }, [year])

  return (
    <HighchartsReact
      ref={chartComponent}
      highcharts={Highcharts}
      constructorType="stockChart"
      options={options}
    />
  )
}

WeightedIndex.propTypes = {
  year: PropTypes.string.isRequired
}

export default WeightedIndex
