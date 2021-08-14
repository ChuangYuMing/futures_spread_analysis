// Ｘ天連續借券賣出
export const getLendingByDay = (resData, { day }) => {
  const target = resData.filter(item => {
    let { credit_data: creditData } = item
    creditData = Object.keys(creditData).map(date => creditData[date])
    const creditLength = creditData.length

    if (creditLength < day) {
      return false
    }

    for (let i = creditLength - 1; i >= creditLength - day; i -= 1) {
      const byDayData = creditData[i]
      if (byDayData.bw_sell_on_day === 0) {
        return false
      }
    }
    return true
  })

  return target
}

// X天借券賣出餘額減少
export const getLendingBalanceReduceByDay = (resData, { day }) => {
  const target = resData.filter(item => {
    let { credit_data: creditData } = item
    creditData = Object.keys(creditData).map(date => creditData[date])
    const creditLength = creditData.length

    if (creditLength < day) {
      return false
    }

    for (let i = creditLength - 1; i >= creditLength - day; i -= 1) {
      const byDayData = creditData[i]
      if (byDayData.bw_return_on_day - byDayData.bw_sell_on_day <= 0) {
        return false
      }
    }
    return true
  })

  return target
}
