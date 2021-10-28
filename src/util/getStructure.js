import isJson from './isJson.js'
import getShortStructure from './getShortStructure.js'
import { BitField, DataManager, DiscordAPIError } from 'discord.js'

export default function getStructure(strc) {
  let str = ""
  switch (strc?.constructor?.name) {
    case 'String': {
      str += `"${strc.replace(/```/g, "`\u200B`\u200B`")}"`
      break
    }
    case 'BigInt': {
      str += `${strc}n`
      break
    }
    case 'Date': {
      str += strc.toISOString().replace(/[TZ]/g, " $& ").trim()
      break
    }
    case 'Array': {
      if (strc.length) {
        str += `[${strc.length <= 5 ? " " : "\n  "}`
        str += strc.map(getShortStructure).join(strc.length <= 5 ? ", " : ", \n  ")
        str += `${strc.length <= 5 ? " " : "\n"}]`
      } else str += "[]"
      break
    }
    default: {
      if (isJson(strc)) {
        if (Object.entries(strc).length) {
          str += strc.constructor.name === 'Object' ? "{\n  " : `${strc.constructor.name} {\n  `
          str += Object.entries(strc).map((e) => e.map(getShortStructure).join(": ")).join(", \n  ")
          str += "\n}"
        } else str += strc.constructor.name === 'Object' ? "{}" : `${strc.constructor.name} {}`
      } else if (strc instanceof Map) {
        if (strc.size) {
          str += `${strc.constructor.name}(${strc.size}) {\n  `
          str += [...strc].map((e) => e.map(getShortStructure).join(" => ")).join("\n  ")
          str += "\n}"
        } else str += `${strc.constructor.name}(0) {}`
      } else if (strc && !strc.constructor) str += "{ null }"
      else if (strc instanceof DiscordAPIError) str += `DiscordAPIError ${
        getStructure({
          message: strc.message,
          method: strc.method,
          path: strc.path,
          code: strc.code,
          httpStatus: strc.httpStatus
        })
      }`
      else if (strc instanceof BitField || strc instanceof DataManager || strc instanceof Error) str += getShortStructure(strc)
      else str += `${strc}`
      break
    }
  }
  return str
}
