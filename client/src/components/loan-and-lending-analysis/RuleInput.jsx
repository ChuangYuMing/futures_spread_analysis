import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './rule-input.css'

function RuleInput({ ruleName, toggleRule, text }) {
  const [checked, setChecked] = useState(false)
  const [dayInput, setDayInput] = useState('')

  function handleCheck(event) {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    setChecked(value)
    toggleRule({ ruleName, isEnable: value, data: { day: dayInput } })
  }

  function handleDayInput(event) {
    const { target } = event
    const { value } = target

    setDayInput(value)
  }

  useEffect(() => {
    toggleRule({ ruleName, isEnable: checked, data: { day: dayInput } })
  }, [dayInput])

  return (
    <div className="rule-input">
      <input
        name={ruleName}
        type="checkbox"
        checked={checked}
        onChange={handleCheck}
      />
      <div className="day-wrap">
        <input name="dayInput" type="text" onChange={handleDayInput} />
        <span>天連續</span>
      </div>
      <span>{text}</span>
    </div>
  )
}

RuleInput.propTypes = {
  ruleName: PropTypes.string.isRequired,
  toggleRule: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}

export default RuleInput
