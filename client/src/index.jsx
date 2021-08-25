import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

/* eslint-disable no-console */
console.log(
  '%c (づ′・ω・）づ  %c小弟單純分享工具，請各位大大高抬貴手，不要打爆我流量ＱＱ',
  'color: #F97316; font-size:20px',
  'color: #2563EB;font-size:20px'
)

console.log(
  '%c 有任何問題可以寄信給我，感謝!  Email: childben28@gmail.com',
  'color: #16A34A; font-size:14px'
)
