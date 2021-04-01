const numeral = require('numeral')
const formatNumber = (number: Number) => {
  return numeral.Numeral(number)
}
export default formatNumber
