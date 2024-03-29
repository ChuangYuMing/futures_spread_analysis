import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import logo from '../../assets/img/logo.png'

function Navigation() {
  const pathPrefix = process.env.REACT_APP_PUBLIC_URL
  const location = useLocation()

  const navMap = [
    {
      text: '選擇權未平倉',
      route: `${pathPrefix}/option-open-interest`
    },
    {
      text: '期貨未平倉',
      route: `${pathPrefix}/futures-open-interest`
    },
    {
      text: '期貨大額交易人未沖銷',
      route: `${pathPrefix}/futures-big-open-interest`
    },
    {
      text: '融券(借券賣出)分析',
      route: `${pathPrefix}/loan-and-lending-analysis`
    },
    {
      text: '建議與問題',
      route: `${pathPrefix}/your-questions`
    }
  ]

  return (
    <div className="sticky top-0 z-10 flex items-center justify-start pb-1 pl-1 mb-5 bg-white border-b border-gray-300">
      <img className="w-10" src={logo} alt="logo" />
      {navMap.map(item => {
        const { route } = item
        const path = location.pathname
        const isRoot = path === `${pathPrefix}/`
        const optionOpenNav = `${pathPrefix}/option-open-interest`
        return (
          <NavLink
            key={item.text}
            className={clsx(
              'px-2 py-2 text-xs  hover:text-orange-700',
              'lg:text-lg lg:px-4',
              path === route || (isRoot && route === optionOpenNav)
                ? 'text-orange-700'
                : 'text-coolGray-700'
            )}
            to={`${item.route}`}
          >
            {item.text}
          </NavLink>
        )
      })}
    </div>
  )
}
export default Navigation
