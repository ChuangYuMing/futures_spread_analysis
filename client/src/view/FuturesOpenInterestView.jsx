import React, { useState } from 'react'
import WeightedIndex from '../components/weighted-index/WeightedIndex'
import YearSelector from '../components/common/year-selector/YearSelector'
import FuturesOpenInterest from '../components/futures-open-interest/FuturesOpenInterest'

function FuturesOpenInterestView() {
  const defaultYear = new Date().getFullYear()
  const [year, setYear] = useState(String(defaultYear))

  return (
    <div className="futures-open-interest">
      <YearSelector defaultYear={defaultYear} year={year} handler={setYear} />
      <WeightedIndex year={year} />
      <FuturesOpenInterest year={year} />
    </div>
  )
}

export default FuturesOpenInterestView
