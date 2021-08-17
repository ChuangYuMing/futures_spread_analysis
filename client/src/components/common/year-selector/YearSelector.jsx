import React from 'react'
import PropTypes from 'prop-types'

function YearSelector({ defaultYear, year, handler }) {
  const yearRange = Array(5)
    .fill()
    .map((item, index) => defaultYear - index)

  const yearOptions = yearRange.map(option => (
    <option key={option} value={option}>
      {option}
    </option>
  ))

  const handleChange = event => {
    handler(event.target.value)
  }
  return (
    <div className="year-selector">
      <label htmlFor="year">Choose a year:</label>
      <select
        className="ml-2 text-orange-700 outline-none"
        name="year"
        value={year}
        onChange={handleChange}
      >
        {yearOptions}
      </select>
    </div>
  )
}

YearSelector.propTypes = {
  year: PropTypes.string.isRequired,
  defaultYear: PropTypes.number.isRequired,
  handler: PropTypes.func.isRequired
}
export default YearSelector
