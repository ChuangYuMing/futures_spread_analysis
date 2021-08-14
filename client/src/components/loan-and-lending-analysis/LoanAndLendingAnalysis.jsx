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
  const [apiData, setApiData] = useState()
  const [creditData, setCreditData] = useState([])
  const [result, setResult] = useState([])

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
  }

  useEffect(() => {
    Api.getLoanAndLending().then(res => {
      const data = Object.keys(res).map(item => res[item])
      setApiData(res)
      setCreditData(data)
      console.log(apiData)
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
      <div className="res-wrap">
        {result.map(item => (
          <span key={item.code}>{item.code}</span>
        ))}
      </div>
    </div>
  )
}

export default LoanAndLendingAnalysis
