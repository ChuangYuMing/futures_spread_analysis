import React from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import clsx from 'clsx'

function Navigation() {
  const navMap = [
    {
      text: '選擇權未平倉',
      route: 'option-open-interest',
      isMatch: !!useRouteMatch('/option-open-interest')
    },
    {
      text: '期貨未平倉',
      route: 'futures-open-interest',
      isMatch: !!useRouteMatch('/futures-open-interest')
    },
    {
      text: '期貨大額交易人未沖銷',
      route: 'futures-big-open-interest',
      isMatch: !!useRouteMatch('/futures-big-open-interest')
    },
    {
      text: '融券(借券賣出)分析',
      route: 'loan-and-lending-analysis',
      isMatch: !!useRouteMatch('/loan-and-lending-analysis')
    }
  ]

  return (
    <div className="sticky top-0 z-10 flex items-center justify-start pb-1 mb-5 bg-white border-b border-gray-500">
      {navMap.map(item => (
        <NavLink
          key={item.text}
          className={clsx(
            'px-4 py-2 text-lg  hover:text-orange-700',
            item.isMatch ? 'text-orange-700' : 'text-coolGray-700'
          )}
          to={`${process.env.REACT_APP_PUBLIC_URL}/${item.route}`}
        >
          {item.text}
        </NavLink>
      ))}
    </div>
  )
}
export default Navigation
