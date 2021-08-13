import React from 'react'
import { NavLink } from 'react-router-dom'
import './style.css'

function Navigation() {
  const navMap = [
    {
      text: '選擇權未平倉',
      route: 'option-open-interest'
    },
    {
      text: '期貨未平倉',
      route: 'futures-open-interest'
    },
    {
      text: '期貨大額交易人未沖銷',
      route: 'futures-big-open-interest'
    },
    {
      text: '融券(借券賣出)分析',
      route: 'loan-and-lending-analysis'
    }
  ]
  return (
    <div className="navigation">
      {navMap.map(item => (
        <NavLink
          key={item.text}
          className="nav-item"
          activeClassName="selected"
          to={`/${item.route}`}
        >
          {item.text}
        </NavLink>
      ))}
    </div>
  )
}

export default Navigation