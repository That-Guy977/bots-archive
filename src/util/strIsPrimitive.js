function strIsPrimitive(str) {
  return !!str && [
    /^(?:true|false|null|undefined)$/,
    /^(?<quote>["'])(?!.*?(?<!\\)\k<quote>.).*(?<!\\)\k<quote>$/,
    /^-?(?:\d+|0x[\dA-F]+|0b[01]+|0o[0-7]+)n?$/i
  ].some((e) => e.test(str))
}

module.exports = strIsPrimitive
