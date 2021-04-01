const generateNumbersArray = (start:number, end:number) => {
  return new Array(end - start + 1)
    .fill(undefined)
    .map((value, index) => index + start)
}
export default generateNumbersArray
