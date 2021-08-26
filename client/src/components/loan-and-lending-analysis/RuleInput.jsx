import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

function RuleInput({ ruleName, toggleRule, text, actionType }) {
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
    <div className="inline-flex items-center justify-center mr-4 text-gray-800">
      <input
        className="mr-1"
        name={ruleName}
        type="checkbox"
        checked={checked}
        onChange={handleCheck}
      />
      {actionType === 'byDay' ? (
        <div className="inline-block">
          <input
            className="w-12 pr-1 text-right text-orange-700 border-b border-gray-700 outline-none"
            name="dayInput"
            type="text"
            onChange={handleDayInput}
          />
          <span>天連續</span>
        </div>
      ) : null}
      <span>{text}</span>
    </div>
  )
}

RuleInput.propTypes = {
  ruleName: PropTypes.string.isRequired,
  toggleRule: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  actionType: PropTypes.string.isRequired
}

export default RuleInput
