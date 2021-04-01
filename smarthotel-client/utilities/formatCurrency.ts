const numeral = require('numeral')
const formatCurrency = (number: number | string) => {
  return `ksh ${numeral(number).format('0,0')}`
}
export default formatCurrency
