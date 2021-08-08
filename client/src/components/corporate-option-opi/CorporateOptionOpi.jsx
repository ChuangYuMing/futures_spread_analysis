import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import Api from '../../api/api'
import { hightChartCommon } from '../../utils/hightChartOptionsFactory'
import { zoomToAll } from '../../utils/chart'
import ItemSelector from '../common/item-selector/ItemSelector'
import './style.css'

function CorporateOptionOpi({ year }) {
  const chartComponents = useRef([])
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
  const [apiData, setApiData] = useState({})
  const [selectedChartTypes, setChartType] = useState([])

  useEffect(() => {
    Api.getOptionOpen(year).then(res => {
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
        stockData.push(obj)
      }
      return hightChartCommon(name, '值', year, stockData)
    }
    const options = selectedChartTypes.map(type => chartOptionFactory(type))

    setChartOptions(options)

    chartComponents.current.forEach(component => {
      zoomToAll(component?.current?.chart)
    })
  }, [selectedChartTypes, apiData])

  const clearAll = () => {
    setChartType([])
  }
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
        splitItem="self_buy_call"
      />
      {chartOptions.map(option => (
        <HighchartsReact
          key={option.title.text}
          ref={element => chartComponents.current.push(element)}
          highcharts={Highcharts}
          constructorType="stockChart"
          options={option}
        />
      ))}
    </div>
  )
}

CorporateOptionOpi.propTypes = {
  year: PropTypes.string.isRequired
}

export default CorporateOptionOpi
