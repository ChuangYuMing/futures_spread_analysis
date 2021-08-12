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
function OptionOpenInterest({ year }) {
  const chartTypes = [
    {
      name: '外資 Buy Call 未平倉量',
      targetValue: 'f_buy_call'
    },
    {
      name: '外資 Buy Call 未平倉金額',
      targetValue: 'f_buy_call_amount'
    },
    {
      name: '外資 Buy Put 未平倉量',
      targetValue: 'f_buy_put'
    },
    {
      name: '外資 Buy Put 未平倉金額',
      targetValue: 'f_buy_put_amount'
    },
    {
      name: '外資 Sell Call 未平倉量',
      targetValue: 'f_sell_call'
    },
    {
      name: '外資 Sell Call 未平倉金額',
      targetValue: 'f_sell_call_amount'
    },
    {
      name: '外資 Sell Put 未平倉量',
      targetValue: 'f_sell_put'
    },
    {
      name: '外資 Sell Put 未平倉金額',
      targetValue: 'f_sell_put_amount'
    },
    {
      name: '外資多方口數',
      targetValue: 'f_long'
    },
    {
      name: '外資多方契約金額',
      targetValue: 'f_long_amount'
    },
    {
      name: '外資空方口數',
      targetValue: 'f_short'
    },
    {
      name: '外資空方契約金額',
      targetValue: 'f_short_amount'
    },
    {
      name: '外資多空淨額口數',
      targetValue: 'f_net'
    },
    {
      name: '外資多空淨額契約金額',
      targetValue: 'f_net_amount'
    },
    {
      name: '自營 Buy Call 未平倉量',
      targetValue: 'self_buy_call'
    },
    {
      name: '自營 Buy Call 未平倉金額',
      targetValue: 'self_buy_call_amount'
    },
    {
      name: '自營 Buy Put 未平倉量',
      targetValue: 'self_buy_put'
    },
    {
      name: '自營 Buy Put 未平倉金額',
      targetValue: 'self_buy_put_amount'
    },
    {
      name: '自營 Sell Call 未平倉量',
      targetValue: 'self_sell_call'
    },
    {
      name: '自營 Sell Call 未平倉金額',
      targetValue: 'self_sell_call_amount'
    },
    {
      name: '自營 Sell Put 未平倉量',
      targetValue: 'self_sell_put'
    },
    {
      name: '自營 Sell Put 未平倉金額',
      targetValue: 'self_sell_put_amount'
    },
    {
      name: '自營多方口數',
      targetValue: 'self_long'
    },
    {
      name: '自營多方契約金額',
      targetValue: 'self_long_amount'
    },
    {
      name: '自營空方口數',
      targetValue: 'self_short'
    },
    {
      name: '自營空方契約金額',
      targetValue: 'self_short_amount'
    },
    {
      name: '自營多空淨額口數',
      targetValue: 'self_net'
    },
    {
      name: '自營多空淨額契約金額',
      targetValue: 'self_net_amount'
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
              text: `${value}`
            }
          ]
        })
      }
    })

    keepHoverDate = date
  }

  const debounceHandleHoverDate = debounce(handleHoverDate, 100)

  useEffect(() => {
    Api.getOptionOpen(year).then(res => {
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
        <span className="title">選擇權未平倉</span>
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
        splitItem="自營 Buy Call 未平倉量"
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

OptionOpenInterest.propTypes = {
  year: PropTypes.string.isRequired
}

export default OptionOpenInterest
