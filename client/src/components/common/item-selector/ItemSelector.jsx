import React from 'react'
import PropTypes from 'prop-types'
import './style.css'

function ItemSelector({
  itemMap,
  selectedChartTypes,
  handler,
  splitItem = ''
}) {
  const handleChange = event => {
    const targetValue = event.target.dataset.value
    const newTypes = [...selectedChartTypes]
    const hasSelected = selectedChartTypes.includes(targetValue)

    if (hasSelected) {
      newTypes.splice(selectedChartTypes.indexOf(targetValue), 1)
    } else {
      newTypes.push(targetValue)
    }

    const sortTypes = itemMap
      .map(item => item.targetValue)
      .filter(item => newTypes.includes(item))
    handler(sortTypes)
  }

  let splitItemIndex = itemMap.findIndex(item => item.targetValue === splitItem)
  splitItemIndex = splitItemIndex === -1 ? itemMap.length : splitItemIndex

  const itemGroupOne = itemMap.slice(0, splitItemIndex)
  const itemGroupTwo = itemMap.slice(splitItemIndex, itemMap.length)

  const itemFactory = (item, index) => (
    <span
      key={item.targetValue}
      tabIndex={index}
      className={`item ${
        selectedChartTypes.includes(item.targetValue) ? 'active' : ''
      } `}
      data-value={item.targetValue}
      onClick={handleChange}
      onKeyDown={handleChange}
      role="button"
    >
      {item.name}
    </span>
  )
  const groupOneItems = itemGroupOne.map((item, index) =>
    itemFactory(item, index)
  )

  const groupTwoItems = itemGroupTwo.map((item, index) =>
    itemFactory(item, index)
  )

  return (
    <div className="item-selector">
      <div className="group">{groupOneItems}</div>
      <div className="group">{groupTwoItems}</div>
    </div>
  )
}

ItemSelector.propTypes = {
  itemMap: PropTypes.arrayOf(
    PropTypes.shape({
      targetValue: PropTypes.string,
      name: PropTypes.string
    })
  ).isRequired,
  selectedChartTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  handler: PropTypes.func.isRequired,
  splitItem: PropTypes.string
}

ItemSelector.defaultProps = {
  splitItem: ''
}
export default ItemSelector
