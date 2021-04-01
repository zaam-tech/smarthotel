import moment from 'moment'
const sugar = require('sugar-date')
const formatDate = (date: Date): string => {
  const fullDate = moment(date).format('MMMM, D , YYYY')
  return fullDate
}
export const sugarDate = (date: Date): string => {
  return sugar(date)
}
export default formatDate
