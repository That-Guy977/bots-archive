function strGetInteger(str) {
  if (!/^-?(?:0[xbo])?\d+n?$/.test(str)) return null
  const [absInt] = str.match(/(?<=^-?)[\dxbo]+(?=n?$)/)
  const isBigInt = /n$/.test(str)
  const negative = /^-/.test(str)
  return (
    (!isBigInt ? Number : BigInt)(absInt) * (
      !isBigInt
        ? !negative ? 1 : -1
        : !negative ? 1n : -1n
    )
  )
}

module.exports = strGetInteger
