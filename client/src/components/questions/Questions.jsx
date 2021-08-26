import React from 'react'

function Questions() {
  return (
    <div className="-mt-5 text-gray-800">
      <div className="mb-2">
        <span className="mr-2 text-lg text-orange-600">為什麼做這網站</span>
        <p className="max-w-3xl">
          起因為個人偏愛籌碼分析，且操作標的主要為台指期或股票期貨，但目前各大網站訊息都很分散或是缺漏，因此興起客製化自己選股和判斷股市的工具。
          <br />
          最後集結整理這些工具分享給跟我有一樣需求的同好以及帶我入門的 PTT
          股票版，感謝各位。
          <br />
          如果有任何問題或想法，也歡迎填寫底下google表單。最後小弟只是小小工程師，希望各位大大高抬貴手，不要把我流量打爆～
        </p>
      </div>
      <span className="mr-2 text-lg text-orange-600">資料更新時間</span>
      <div>融券資料更新時間： 每日晚上 9 點</div>
      <div>其他資料更新時間： 每日下午 5 點</div>
      <div className="mt-1 text-xs">
        (如果有確定公開資料的更新時間，也歡迎告知！)
      </div>
      <div className="flex flex-col my-4">
        <span className="mr-2 text-lg text-orange-600">
          建議與問題 (google 表單)
        </span>
        <a
          className="text-blue-600 hover:text-blue-800"
          href="https://forms.gle/yNKZkyY1D6EUK5JS6"
          target="_blank"
          rel="noreferrer"
        >
          https://forms.gle/yNKZkyY1D6EUK5JS6
        </a>
      </div>
      <div className="flex flex-col">
        <span className="mb-1 text-lg text-orange-600">資料來源</span>
        <div className="flex flex-col">
          <span className="mr-2">選擇權未平倉:</span>
          <a
            className="text-blue-600 truncate hover:text-blue-800 w-80"
            href="https://www.taifex.com.tw/cht/3/callsAndPutsDate"
            target="_blank"
            rel="noreferrer"
          >
            https://www.taifex.com.tw/cht/3/callsAndPutsDate
          </a>
        </div>
        <div className="flex flex-col">
          <span className="mr-2">期貨未平倉:</span>
          <a
            className="text-blue-600 truncate hover:text-blue-800 w-80"
            href="https://www.taifex.com.tw/cht/3/futContractsDate"
            target="_blank"
            rel="noreferrer"
          >
            https://www.taifex.com.tw/cht/3/futContractsDate
          </a>
        </div>
        <div className="flex flex-col">
          <span className="mr-2">期貨大額交易人未沖銷:</span>
          <a
            className="text-blue-600 truncate hover:text-blue-800 w-80"
            href="https://www.taifex.com.tw/cht/3/largeTraderFutQry"
            target="_blank"
            rel="noreferrer"
          >
            https://www.taifex.com.tw/cht/3/largeTraderFutQry
          </a>
        </div>
        <div className="flex flex-col">
          <span className="mr-2">融券(借券賣出):</span>
          <a
            className="text-blue-600 truncate hover:text-blue-800 w-80"
            href="http://www.twse.com.tw/zh/page/trading/exchange/TWT93U.html"
            target="_blank"
            rel="noreferrer"
          >
            http://www.twse.com.tw/zh/page/trading/exchange/TWT93U.html
          </a>
        </div>
        <div className="flex flex-col">
          <span className="mr-2">大盤加權指數:</span>
          <a
            className="text-blue-600 truncate hover:text-blue-800 w-80"
            href="https://www.twse.com.tw/zh/page/trading/indices/MI_5MINS_HIST.html"
            target="_blank"
            rel="noreferrer"
          >
            https://www.twse.com.tw/zh/page/trading/indices/MI_5MINS_HIST.html
          </a>
        </div>
        <div className="flex flex-col">
          <span className="mr-2">股票期貨清單:</span>
          <a
            className="text-blue-600 truncate hover:text-blue-800 w-80"
            href="https://www.taifex.com.tw/cht/2/stockLists"
            target="_blank"
            rel="noreferrer"
          >
            https://www.taifex.com.tw/cht/2/stockLists
          </a>
        </div>
      </div>
    </div>
  )
}

export default Questions
