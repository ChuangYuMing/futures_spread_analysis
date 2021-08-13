import React, { useState } from 'react'
import WeightedIndex from '../components/weighted-index/WeightedIndex'
import YearSelector from '../components/common/year-selector/YearSelector'
import FuturesBigOpenInterest from '../components/futures-big-open-interest/FuturesBigOpenInterest'

function FuturesBigOpenInterestView() {
  const defaultYear = new Date().getFullYear()
  const [year, setYear] = useState(String(defaultYear))

  return (
    <div className="futures-big-open-interest">
      <YearSelector defaultYear={defaultYear} year={year} handler={setYear} />
      <WeightedIndex year={year} />
      <FuturesBigOpenInterest year={year} />
    </div>
  )
}

export default FuturesBigOpenInterestView
