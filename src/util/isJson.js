const { BitField, DataManager } = require('discord.js')

function isJson(strc) {
  return !!(
    strc
    && typeof strc === 'object'
    && strc.constructor
    && ![Array, Map, Date, BitField, DataManager].some((c) => strc instanceof c)
  )
}

module.exports = isJson
