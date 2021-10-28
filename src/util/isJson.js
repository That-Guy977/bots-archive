import { BitField, DataManager } from 'discord.js'

export default function isJson(strc) {
  return !!(
    strc
    && typeof strc === 'object'
    && strc.constructor
    && ![Array, Map, Date, BitField, DataManager, Error].some((c) => strc instanceof c)
  )
}
