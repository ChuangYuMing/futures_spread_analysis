// Ｘ天連續借券賣出
export const getLendingByDay = (resData, { day }) => `${resData}${day}`

// X天借券賣出餘額減少
export const getLendingBalanceReduceByDay = (resData, { day }) =>
  `${resData}${day}`
