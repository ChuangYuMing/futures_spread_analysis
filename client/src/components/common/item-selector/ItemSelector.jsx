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
    const name = event.target.dataset.value
    const newTypes = [...selectedChartTypes]
    const hasSelected = selectedChartTypes.includes(name)

    if (hasSelected) {
      newTypes.splice(selectedChartTypes.indexOf(name), 1)
    } else {
      newTypes.push(name)
    }

    const sortTypes = itemMap
      .map(item => item.name)
      .filter(item => newTypes.includes(item))
    handler(sortTypes)
  }

  let splitItemIndex = itemMap.findIndex(item => item.name === splitItem)
  splitItemIndex = splitItemIndex === -1 ? itemMap.length : splitItemIndex

  const itemGroupOne = itemMap.slice(0, splitItemIndex)
  const itemGroupTwo = itemMap.slice(splitItemIndex, itemMap.length)

  const itemFactory = (item, index) => (
    <span
      key={item.name}
      tabIndex={index}
      className={`item ${
        selectedChartTypes.includes(item.name) ? 'active' : ''
      } `}
      data-value={item.name}
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
      targetValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
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
