/*
 * @Author: willian126@126.com
 * @Description: 文件描述
 * @Date: 2023-02-08 14:26:29
 * @LastEditors: willian126@126.com
 * @LastEditTime: 2023-02-08 14:36:43
 */
const userArr = [
  {
    asset: 1200000,
    holdProfit: -40000,
    tradeIn6Months: 200,
    riskLevelName: '保守型',
  },
  {
    asset: 120000,
    holdProfit: -4000,
    tradeIn6Months: 150,
    riskLevelName: '积极型',
  },
  {
    asset: 1200000,
    holdProfit: -40000,
    tradeIn6Months: 100,
    riskLevelName: '稳健型',
  },
  {
    asset: 1200000,
    holdProfit: 40000,
    tradeIn6Months: 160,
    riskLevelName: '进取型',
  }
]
const getRandomUser = () => {
  const length = userArr.length
  const random = Math.floor(Math.random() * length)
  return userArr[random]
}
const userInfo = getRandomUser()
export default userInfo