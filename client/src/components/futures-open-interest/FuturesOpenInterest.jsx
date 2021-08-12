import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import Api from '../../api/api'
import { hightChartMultiple } from '../../utils/hightChartOptionsFactory'
import { zoomToAll } from '../../utils/chart'
import ItemSelector from '../common/item-selector/ItemSelector'
import './style.css'

function FuturesOpenInterest({ year }) {
  const chartTypes = [
    {
      name: '多方口數',
      targetValue: ['bull_foreign', 'bull_self']
    },
    {
      name: '多方金額',
      targetValue: ['bull_foreign_amount', 'bull_self_amount']
    },
    {
      name: '空方口數',
      targetValue: ['bear_foreign', 'bear_self']
    },
    {
      name: '空方金額',
      targetValue: ['bear_foreign_amount', 'bear_self_amount']
    },
    {
      name: '多空淨額口數',
      targetValue: ['diff_foreign', 'diff_self']
    },
    {
      name: '多空淨額金額',
      targetValue: ['diff_foreign_amount', 'diff_self_amount']
    }
  ]
  const [chartOptions, setChartOptions] = useState([])
  const chartComponents = useRef([])
  const [apiData, setApiData] = useState({})
  const [selectedChartTypes, setChartType] = useState([])

  function clearAll() {
    setChartType([])
  }

  useEffect(() => {
    Api.getFuturesOpen(year).then(res => {
      setApiData(res)
    })
  }, [year])

  useEffect(() => {
    function seriesDataFactory(targetPropertyCheck, targetValue) {
      const stockData = []
      const targetProperty = targetValue.filter(item =>
        item.includes(targetPropertyCheck)
      )[0]

      for (const date in apiData) {
        const item = apiData[date]
        const obj = {}
        let yValue = parseInt(item[targetProperty])

        if (targetPropertyCheck === 'total') {
          yValue =
            parseInt(item[targetValue[0]]) + parseInt(item[targetValue[1]])
        }
        obj.y = yValue
        obj.x = Date.parse(date)
        obj.date = date
        obj.is_settle = item.is_settle
        obj.id = date
        stockData.push(obj)
      }

      return stockData
    }

    function chartOptionFactory(type) {
      const { name, targetValue } = chartTypes.filter(
        item => item.name === type
      )[0]
      const seriesTypes = [
        {
          name: '外資',
          targetPropertyCheck: 'foreign',
          color: '#054099'
        },
        {
          name: '自營',
          targetPropertyCheck: 'self',
          color: '#a86206'
        },
        {
          name: '總和',
          targetPropertyCheck: 'total',
          color: '#207506'
        }
      ]

      const series = seriesTypes.map(seriesType => ({
        name: seriesType.name,
        data: seriesDataFactory(seriesType.targetPropertyCheck, targetValue),
        color: seriesType.color
      }))

      return hightChartMultiple(name, '值', year, series)
    }
    const options = selectedChartTypes.map(type => chartOptionFactory(type))

    setChartOptions(options)

    chartComponents.current.forEach(component => {
      zoomToAll(component?.current?.chart)
    })
  }, [selectedChartTypes, apiData])

  return (
    <div className="option-open-wrapper">
      <div className="title-wrap">
        <span className="title">期貨未平倉</span>
        <span
          className="clear-action"
          onClick={clearAll}
          onKeyDown={clearAll}
          role="button"
          tabIndex="0"
        >
          清空
        </span>
      </div>
      <ItemSelector
        itemMap={chartTypes}
        handler={setChartType}
        selectedChartTypes={selectedChartTypes}
      />
      {chartOptions.map((option, index) => (
        <HighchartsReact
          key={option.title.text}
          ref={element => (chartComponents.current[index] = element)}
          highcharts={Highcharts}
          constructorType="stockChart"
          options={option}
        />
      ))}
    </div>
  )
}

FuturesOpenInterest.propTypes = {
  year: PropTypes.string.isRequired
}

export default FuturesOpenInterest
