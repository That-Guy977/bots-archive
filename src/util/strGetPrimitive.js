const strGetInteger = require('./strGetInteger.js')

const primitive = [true, false, null, undefined]

function strGetPrimitive(str) {
  return (
    primitive.some((e) => str === e.toString()) ? primitive.find((e) => str === e.toString())
    : /^(?<quote>["'])(?!.*?(?<!\\)\k<quote>.).*(?<!\\)\k<quote>$/.test(str) ? str.replace(/^.|.$|\\(?<quote>["'])/g, "$<quote>")
    : /^-?(?:0[xbo])?\d+n?$/.test(str) ? strGetInteger(str)
    : null
  )
}

module.exports = strGetPrimitive
