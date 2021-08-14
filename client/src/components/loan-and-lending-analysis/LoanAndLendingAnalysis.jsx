import React, { useState, useEffect } from 'react'
import { getLendingByDay, getLendingBalanceReduceByDay } from './rules'
import RuleInput from './RuleInput'
import Api from '../../api/api'
import './loan.css'

function LoanAndLendingAnalysis() {
  const rulesMap = [
    {
      ruleName: 'LendingByDay',
      text: '借券賣出',
      callBack: getLendingByDay
    },
    {
      ruleName: 'LendingBalanceReduceByDay',
      text: '借券賣出餘額減少',
      callBack: getLendingBalanceReduceByDay
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
    <div className="analysis-wrap">
      <div className="rules-wrap">
        <div className="rules">
          {rulesMap.map(rule => (
            <RuleInput
              key={rule.ruleName}
              ruleName={rule.ruleName}
              text={rule.text}
              toggleRule={toggleRule}
            />
          ))}
        </div>
        <span
          className="action-btn"
          role="button"
          tabIndex="0"
          onClick={getResult}
          onKeyDown={getResult}
        >
          取得結果
        </span>
      </div>
      <div className={`res-wrap ${result.length ? '' : 'hidden'}`}>
        {result.map(item => (
          <span
            key={item.code}
            className={selectedCode === item.code ? 'active' : ''}
            role="button"
            tabIndex="0"
            onClick={() => setSelectedCode(item.code)}
            onKeyDown={() => setSelectedCode(item.code)}
          >
            {item.code} {item.name}
          </span>
        ))}
      </div>
      <div className={`stock-info" ${stockInfo ? '' : 'hidden'}`}>
        <table className="info-table">
          <thead>
            <tr role="row">
              <th rowSpan="2">
                {stockInfo?.code} {stockInfo?.name}
              </th>
              <th colSpan="6">融券</th>
              <th colSpan="6">借券賣出</th>
            </tr>
            <tr role="row">
              <th>前日餘額</th>
              <th>賣出</th>
              <th>買進</th>
              <th>現券</th>
              <th>今日餘額</th>
              <th>限額</th>
              <th>前日餘額</th>
              <th>當日賣出</th>
              <th>當日還券</th>
              <th>當日調整</th>
              <th>當日餘額</th>
              <th>次一營業日可限額</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(stockInfo?.credit_data || {}).map(date => {
              const data = stockInfo.credit_data[date]
              return (
                <tr key={date}>
                  <td>{date}</td>
                  <td>{formatInfoData(data.sl_preDay_balance)}</td>
                  <td>{formatInfoData(data.sl_sell)}</td>
                  <td>{formatInfoData(data.sl_buy)}</td>
                  <td>{formatInfoData(data.sl_cash_stock)}</td>
                  <td>{formatInfoData(data.sl_day_balance)}</td>
                  <td>{formatInfoData(data.sl_limit)}</td>
                  <td>{formatInfoData(data.bw_preDay_balance)}</td>
                  <td>{formatInfoData(data.bw_sell_on_day)}</td>
                  <td>{formatInfoData(data.bw_return_on_day)}</td>
                  <td>{formatInfoData(data.bw_adjust_on_day)}</td>
                  <td>{formatInfoData(data.bw_day_balance)}</td>
                  <td>{formatInfoData(data.bw_limit_on_next_business_day)}</td>
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
