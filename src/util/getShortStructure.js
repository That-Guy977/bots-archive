import isJson from './isJson.js'
import { BitField, DataManager } from 'discord.js'

export default function getShortStructure(strc) {
  if (strc?.constructor === Object && !Object.keys(strc).length) return "{}"
  if (isJson(strc)) return `${strc.constructor.name}${strc.id ? ` { id: "${strc.id}" }` : ""}`
  if (strc instanceof String) return `"${strc.replace(/```/g, "`\u200B`\u200B`")}"`
  if (strc instanceof BigInt) return `${strc}n`
  if (strc instanceof Function) return `${strc.constructor.name}`
  if ([Array, Map, Date].some((c) => strc instanceof c)) return `${strc.constructor.name}(${strc.length ?? strc.size ?? strc.getTime?.() ?? 0})`
  if (strc instanceof BitField) return `${strc.constructor.name} { bitfield: ${strc.bitfield} }`
  if (strc instanceof DataManager) return `${strc.constructor.name} { cache: ${strc.cache.constructor.name}(${strc.cache.size}) }`
  if (strc instanceof Error) return `${strc.constructor.name} { message: "${strc.message}" }`
  if (strc && !strc.constructor) return "{ null }"
  return `${strc}`
}
