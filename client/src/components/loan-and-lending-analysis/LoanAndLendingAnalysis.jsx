import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import {
  getLendingByDay,
  getLendingBalanceReduceByDay,
  filterStockFuturesList
} from './rules'
import RuleInput from './RuleInput'
import Api from '../../api/api'

function LoanAndLendingAnalysis() {
  const [stockFuturesList, setStockFuturesList] = useState([])
  useEffect(() => {
    Api.getStockFuturesList().then(res => {
      setStockFuturesList(res)
    })
  }, [])

  const rulesMap = [
    {
      ruleName: 'LendingByDay',
      text: '借券賣出',
      callBack: getLendingByDay,
      actionType: 'byDay'
    },
    {
      ruleName: 'LendingBalanceReduceByDay',
      text: '借券賣出餘額減少',
      callBack: getLendingBalanceReduceByDay,
      actionType: 'byDay'
    },
    {
      ruleName: 'FilterStockFuturesList',
      text: '過濾股票期貨',
      callBack: filterStockFuturesList(stockFuturesList),
      actionType: 'check'
    }
  ]

  const [activeRules, setActiveRules] = useState([])
  const [apiData, setApiData] = useState({})
  const [creditData, setCreditData] = useState([])
  const [result, setResult] = useState([])
  const [stockInfo, setStockInfo] = useState(null)
  const [selectedCode, setSelectedCode] = useState('')

  function toggleRule(ruleObj) {
    const { ruleName, isEnable } = ruleObj

    const newRules = [...activeRules]

    if (isEnable) {
      const targetRule = rulesMap.find(rule => rule.ruleName === ruleName)
      const index = activeRules.findIndex(rule => rule.ruleName === ruleName)
      const hasEnable = index !== -1
      const newObj = {
        ...targetRule,
        ...ruleObj
      }

      if (hasEnable) {
        newRules[index] = newObj
      } else {
        newRules.push(newObj)
      }
    } else {
      const index = activeRules.findIndex(rule => rule.ruleName === ruleName)
      newRules.splice(index, 1)
    }

    setActiveRules(newRules)
  }

  function getResult() {
    const res = activeRules.reduce(
      (acc, cur) => cur.callBack(acc, cur.data),
      creditData
    )

    setResult(res)
    setStockInfo(null)
    setSelectedCode('')
  }

  function formatInfoData(value) {
    return +parseFloat(value / 1000).toFixed(0)
  }

  useEffect(() => {
    setStockInfo(apiData[selectedCode])
  }, [selectedCode])

  useEffect(() => {
    Api.getLoanAndLending().then(res => {
      const data = Object.keys(res).map(item => res[item])
      setApiData(res)
      setCreditData(data)
    })
  }, [])

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div>
          {rulesMap.map(rule => (
            <RuleInput
              key={rule.ruleName}
              ruleName={rule.ruleName}
              text={rule.text}
              toggleRule={toggleRule}
              actionType={rule.actionType}
            />
          ))}
        </div>
        <span
          className="self-start inline-block w-auto px-2 py-1 mt-5 border rounded cursor-pointer border-warmGray-600"
          role="button"
          tabIndex="0"
          onClick={getResult}
          onKeyDown={getResult}
        >
          取得結果
        </span>
      </div>
      <div
        className={clsx(
          'flex flex-wrap justify-start mt-10 p-5 border border-gray-800 rounded-lg',
          !result.length && 'hidden'
        )}
      >
        {result.map(item => (
          <span
            key={item.code}
            className={clsx(
              'inline-block py-1 px-2 border rounded-lg mr-2 mb-1 border-orange-400',
              selectedCode === item.code
                ? 'bg-orange-400 text-blueGray-900'
                : ''
            )}
            role="button"
            tabIndex="0"
            onClick={() => setSelectedCode(item.code)}
            onKeyDown={() => setSelectedCode(item.code)}
          >
            {item.code} {item.name}
          </span>
        ))}
      </div>
      <div
        className={clsx(
          'flex flex-wrap justify-start  mt-5 rounded-lg',
          stockInfo ? '' : 'hidden'
        )}
      >
        <table className="border border-collapse border-gray-700">
          <thead>
            <tr role="row">
              <th rowSpan="2" className="table-td">
                {stockInfo?.code} {stockInfo?.name}
              </th>
              <th colSpan="6" className="table-th ">
                融券
              </th>
              <th colSpan="6" className="table-th">
                借券賣出
              </th>
            </tr>
            <tr role="row">
              <th className="table-td">前日餘額</th>
              <th className="table-td">賣出</th>
              <th className="table-td">買進</th>
              <th className="table-td">現券</th>
              <th className="table-td">今日餘額</th>
              <th className="table-td">限額</th>
              <th className="table-td">前日餘額</th>
              <th className="table-td">當日賣出</th>
              <th className="table-td">當日還券</th>
              <th className="table-td">當日調整</th>
              <th className="table-td">當日餘額</th>
              <th className="table-td">次一營業日可限額</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(stockInfo?.credit_data || {})
              .sort((a, b) => new Date(b) - new Date(a))
              .map(date => {
                const data = stockInfo.credit_data[date]
                return (
                  <tr key={date}>
                    <td className="table-td">{date}</td>
                    <td className="table-td">
                      {formatInfoData(data.sl_preDay_balance)}
                    </td>
                    <td className="table-td">{formatInfoData(data.sl_sell)}</td>
                    <td className="table-td">{formatInfoData(data.sl_buy)}</td>
                    <td className="table-td">
                      {formatInfoData(data.sl_cash_stock)}
                    </td>
                    <td className="table-td">
                      {formatInfoData(data.sl_day_balance)}
                    </td>
                    <td className="table-td">
                      {formatInfoData(data.sl_limit)}
                    </td>
                    <td className="table-td">
                      {formatInfoData(data.bw_preDay_balance)}
                    </td>
                    <td className="table-td">
                      {formatInfoData(data.bw_sell_on_day)}
                    </td>
                    <td className="table-td">
                      {formatInfoData(data.bw_return_on_day)}
                    </td>
                    <td className="table-td">
                      {formatInfoData(data.bw_adjust_on_day)}
                    </td>
                    <td className="table-td">
                      {formatInfoData(data.bw_day_balance)}
                    </td>
                    <td className="table-td">
                      {formatInfoData(data.bw_limit_on_next_business_day)}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LoanAndLendingAnalysis
