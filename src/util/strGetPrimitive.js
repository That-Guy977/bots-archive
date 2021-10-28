import strGetInteger from './strGetInteger.js'
const primitive = [true, false, null, undefined]

export default function strGetPrimitive(str) {
  return (
    primitive.some((e) => str === `${e}`) ? primitive.find((e) => str === `${e}`)
    : /^(?<quote>["'])(?!.*?(?<!\\)\k<quote>.).*(?<!\\)\k<quote>$/.test(str) ? str.replace(/^.|.$|\\(?<quote>["'])/g, "$<quote>")
    : /^-?(?:0[xbo])?\d+n?$/.test(str) ? strGetInteger(str)
    : null
  )
}
