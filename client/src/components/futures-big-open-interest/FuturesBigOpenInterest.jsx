import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import AnnotationsModule from 'highcharts/modules/annotations'
import Api from '../../api/api'
import {
  hightChartCommon,
  hightChartMultiple
} from '../../utils/hightChartOptionsFactory'
import { zoomToAll } from '../../utils/chart'
import { debounce, toThousands } from '../../utils/index'
import ItemSelector from '../common/item-selector/ItemSelector'

AnnotationsModule(Highcharts)
function FuturesBigOpenInterest({ year }) {
  const chartTypes = [
    {
      name: '買方-前五大交易人',
      targetValue: 'buy_top_five',
      color: '#c0110b'
    },
    {
      name: '買方-前十大交易人',
      targetValue: 'buy_top_ten',
      color: '#e75427'
    },
    {
      name: '賣方-前五大交易人',
      targetValue: 'sell_top_five',
      color: '#0f740c'
    },
    {
      name: '賣方-前十大交易人',
      targetValue: 'sell_top_ten',
      color: '#19c962'
    },
    {
      name: '市場未平倉',
      targetValue: 'total',
      color: '#021f9e'
    }
  ]
  const [chartOptions, setChartOptions] = useState([])
  const [chartCombineOptions, setChartCombineOptions] = useState([])
  const chartComponents = useRef([])
  const chartCombineComponents = useRef({})
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
        const value = chart.get(date).y
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
              text: `${toThousands(value)}`
            }
          ]
        })
      }
    })

    keepHoverDate = date
  }

  const debounceHandleHoverDate = debounce(handleHoverDate, 100)

  useEffect(() => {
    Api.getFuturesBigOpen(year).then(res => {
      setApiData(res)
    })
  }, [year])

  useEffect(() => {
    function chartOptionFactory(type) {
      const { name, targetValue } = chartTypes.filter(
        item => item.name === type
      )[0]
      const stockData = []

      for (const date in apiData) {
        const item = apiData[date]
        const obj = {}
        obj.y = parseInt(item[targetValue])
        obj.x = Date.parse(date)
        obj.date = date
        obj.is_settle = item.is_settle
        obj.id = date
        stockData.push(obj)
      }

      return hightChartCommon({
        subject: name,
        yName: '值',
        year,
        data: stockData,
        handleHoverDate: debounceHandleHoverDate
      })
    }
    const options = selectedChartTypes.map(type => chartOptionFactory(type))

    setChartOptions(options)

    chartComponents.current.forEach(component => {
      zoomToAll(component?.current?.chart)
    })
  }, [selectedChartTypes, apiData])

  useEffect(() => {
    function seriesDataFactory(targetValue) {
      const stockData = []

      for (const date in apiData) {
        const item = apiData[date]
        const obj = {}

        obj.y = parseInt(item[targetValue])
        obj.x = Date.parse(date)
        obj.date = date
        obj.is_settle = item.is_settle
        obj.id = date
        stockData.push(obj)
      }

      return stockData
    }
    function chartOptionFactory() {
      const series = chartTypes.map(seriesType => ({
        name: seriesType.name,
        data: seriesDataFactory(seriesType.targetValue),
        color: seriesType.color
      }))

      return hightChartMultiple('期貨大額交易人未沖銷部位', '值', year, series)
    }

    const options = chartOptionFactory()

    setChartCombineOptions(options)
    setTimeout(() => {
      zoomToAll(chartCombineComponents?.current?.chart)
    }, 0)
  }, [apiData])

  return (
    <div>
      <div className="inline-flex items-center justify-center my-4">
        <span className="text-2xl">期貨大額交易人未沖銷部位</span>
        <span
          className="px-2 py-1 ml-4 text-red-500 border border-red-500 cursor-pointer"
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
      <HighchartsReact
        ref={chartCombineComponents}
        highcharts={Highcharts}
        constructorType="stockChart"
        options={chartCombineOptions}
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

FuturesBigOpenInterest.propTypes = {
  year: PropTypes.string.isRequired
}

export default FuturesBigOpenInterest
