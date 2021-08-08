import React, { useState } from 'react'
import WeightedIndex from '../components/weighted-index/WeightedIndex'
import YearSelector from '../components/common/year-selector/YearSelector'
import CorporateOptionOpi from '../components/corporate-option-opi/CorporateOptionOpi'

function Main() {
  const defaultYear = new Date().getFullYear()
  const [year, setYear] = useState(String(defaultYear))

  return (
    <div className="main">
      <YearSelector defaultYear={defaultYear} year={year} handler={setYear} />
      <WeightedIndex year={year} />
      <CorporateOptionOpi year={year} />
    </div>
  )
}

export default Main
