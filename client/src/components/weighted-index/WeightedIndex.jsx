import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import Api from '../../api/api'
import { hightChartCommon } from '../../utils/hightChartOptionsFactory'
import { zoomToAll } from '../../utils/chart'

function WeightedIndex({ year }) {
  const chartComponent = useRef(null)
  const [options, setOptions] = useState(null)

  useEffect(() => {
    Api.getWeightIndex(year).then(res => {
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

      setOptions(hightChartCommon('加權指數', '價位', year, stockData))
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
