import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import AnnotationsModule from 'highcharts/modules/annotations'
import Api from '../../api/api'
import { hightChartCommon } from '../../utils/hightChartOptionsFactory'
import { zoomToAll } from '../../utils/chart'
import debounce from '../../utils/index'
import ItemSelector from '../common/item-selector/ItemSelector'
import './style.css'

AnnotationsModule(Highcharts)
function FuturesOpenInterest({ year }) {
  const chartTypes = [
    {
      name: '外資多方口數',
      targetValue: 'bull_foreign'
    },
    {
      name: '外資多方金額',
      targetValue: 'bull_foreign_amount'
    },
    {
      name: '外資空方口數',
      targetValue: 'bear_foreign'
    },
    {
      name: '外資空方金額',
      targetValue: 'bear_foreign_amount'
    },
    {
      name: '外資多空淨額口數',
      targetValue: 'diff_foreign'
    },
    {
      name: '外資多空淨額金額',
      targetValue: 'diff_foreign_amount'
    },
    {
      name: '自營多方口數',
      targetValue: 'bull_self'
    },
    {
      name: '自營多方金額',
      targetValue: 'bull_self_amount'
    },
    {
      name: '自營空方口數',
      targetValue: 'bear_self'
    },
    {
      name: '自營空方金額',
      targetValue: 'bear_self_amount'
    },
    {
      name: '自營多空淨額口數',
      targetValue: 'diff_self'
    },
    {
      name: '自營多空淨額金額',
      targetValue: 'diff_self_amount'
    }
  ]
  const [chartOptions, setChartOptions] = useState([])
  const chartComponents = useRef([])
  const [apiData, setApiData] = useState({})
  const [selectedChartTypes, setChartType] = useState([])

  function clearAll() {
    setChartType([])
  }

  let keepHoverDate = ''
  function handleHoverDate(date, chartTitle) {
    const charts = chartComponents.current.filter(
      chartComponent => chartComponent
    )
    charts.forEach(chartComponent => {
      const { chart } = chartComponent
      chart.removeAnnotation(keepHoverDate)
    })

    charts.forEach(chartComponent => {
      const { chart } = chartComponent
      if (chart.options.title.text !== chartTitle) {
        const targetValue = chart.get(date).y
        chart.addAnnotation({
          id: date,
          labelOptions: {
            y: 15,
            verticalAlign: 'bottom',
            distance: 25
          },
          labels: [
            {
              point: date,
              text: `${targetValue}`
            }
          ]
        })
      }
    })

    keepHoverDate = date
  }

  const debounceHandleHoverDate = debounce(handleHoverDate, 100)

  useEffect(() => {
    Api.getFuturesOpen(year).then(res => {
      setApiData(res)
    })
  }, [year])

  useEffect(() => {
    function chartOptionFactory(type) {
      const { name } = chartTypes.filter(item => item.targetValue === type)[0]
      const stockData = []

      for (const date in apiData) {
        const item = apiData[date]
        const obj = {}
        obj.y = parseInt(item[type])
        obj.x = Date.parse(date)
        obj.date = date
        obj.is_settle = item.is_settle
        obj.id = date
        stockData.push(obj)
      }

      return hightChartCommon(
        name,
        '值',
        year,
        stockData,
        debounceHandleHoverDate
      )
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
        splitItem="bull_self"
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
