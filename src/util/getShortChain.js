function getShortChain(arr) {
  return arr.length <= 5 ? arr.join(".") : `…${arr.slice(-5).join(".")}`
}

module.exports = getShortChain
