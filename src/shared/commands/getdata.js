import { Command } from '../../shared/structures.js'
import {
  isPrimitive, isSnowflake, isToken,
  getStructure, getShortStructure, getShortChain,
  strIsPrimitive, strGetPrimitive, strCapitalize, strEscapeMention
} from '../../shared/util.js'
const types = ["guild", "channel", "user", "member", "role", "message"]
const altVal = ["this", "reply"]

export const command = new Command({
  name: "getdata",
  perm: ['ADMINISTRATOR'],
  indm: false,
  hide: true
}, async (client, msg, arg) => {
  arg = arg.map(strEscapeMention)
  arg[0] ??= "message"
  if (arg[0] !== 'client') arg[1] ??= altVal[+!!msg.reference]
  const type = arg.shift().toLowerCase()
  let strc
  if (type === 'client') {
    strc = client
  } else {
    let val = arg.shift().toLowerCase()
    if (!types.includes(type)) return sendError(msg, "invalidType")
    if (!altVal.includes(val) && !isSnowflake(val)) return sendError(msg, "invalidValue")
    if (val === altVal[1] && !msg.reference) return sendError(msg, "invalidReference")
    if (altVal.includes(val)) {
      const message
      = val === altVal[0]
        ? msg
        : await msg.fetchReference()
      const { guild, channel, author, member } = message
      val = (
        type === types[0] ? guild
        : type === types[1] ? channel
        : type === types[2] ? author
        : type === types[3] ? member
        : type === types[5] ? message
        : null
      )?.id ?? null
      if (!val) return sendError(msg, "invalidThisProp", type)
    }
    const id = val
    try {
      switch (type) {
        case types[0]: {
          strc = await client.guilds.fetch(id)
          break
        }
        case types[1]: {
          strc = await client.channels.fetch(id)
          break
        }
        case types[2]: {
          strc = await client.users.fetch(id)
          break
        }
        case types[3]: {
          let guild = isSnowflake(arg[0]) ? arg.shift() : msg.guildId
          if (altVal.includes(arg[0])) arg.shift()
          try {
            guild = await client.guilds.fetch(guild)
          } catch { return sendError(msg, "invalidId", types[0], guild) }
          strc = await guild.members.fetch(id)
          break
        }
        case types[4]: {
          let guild = isSnowflake(arg[0]) ? arg.shift() : msg.guildId
          if (altVal.includes(arg[0])) arg.shift()
          try {
            guild = await client.guilds.fetch(guild)
          } catch { return sendError(msg, "invalidId", types[0], guild) }
          strc = await guild.roles.fetch(id)
          break
        }
        case types[5]: {
          let channel = isSnowflake(arg[0]) ? arg.shift() : msg.channelId
          if (altVal.includes(arg[0])) arg.shift()
          try {
            channel = await client.channels.fetch(channel)
          } catch { return sendError(msg, "invalidId", types[1], channel) }
          if (!channel.isText()) return sendError(msg, "invalidChannelType")
          strc = await channel.messages.fetch(id)
          break
        }
      }
    } catch { return sendError(msg, "invalidId", type, id) }
  }
  const pchain = [type]
  for (const prop of arg) {
    if (strc === undefined) return sendError(msg, "propUndefined", pchain)
    if (prop === 'token' && isToken(strc?.[prop])) return sendError(msg, "propToken")
    if (isPrimitive(strc) && strc?.[prop] === undefined) return sendError(msg, "propPrimitive", pchain, strc)
    if (/^\w+$/.test(prop)) {
      pchain.push(prop)
      if (['entries', 'keys', 'values'].includes(prop) && strc instanceof Map) {
        strc = [...strc[prop]()]
        pchain[pchain.length - 1] += "()"
      } else strc = strc[prop]
    } else if (/^\w+\(.*\)$/.test(prop)) {
      const { func, paramList } = prop.match(/^(?<func>\w+)\((?<paramList>.*)\)$/).groups
      pchain.push(func)
      if (strc[func] === undefined) return sendError(msg, "propUndefined", pchain)
      if (typeof strc[func] !== 'function') return sendError(msg, "methodInvalid", pchain)
      const params = []
      for (const param of paramList ? paramList.split(", ") : []) {
        if (!strIsPrimitive(param)) return sendError(msg, "methodParamInvalid", param)
        params.push(strGetPrimitive(param))
      }
      pchain[pchain.length - 1] += `(${params.length ? "…" : ''})`
      try {
        strc = await strc[func](...params)
      } catch (err) { return sendError(msg, "methodError", pchain, `${err}`) }
    } else {
      return sendError(msg, "invalidProp", prop)
    }
  }
  const res = getStructure(strc)
  if (res.length <= 1990) msg.channel.send(`\`\`\`js\n${res}\n\`\`\``)
  else msg.channel.send({
    files: [{
      attachment: Buffer.from(res),
      name: "output.js"
    }]
  })
})

function sendError(msg, error, ...args) {
  const errorMsg
  = error === "invalidType" ? () => "Please provide a valid structure to get."
  : error === "invalidValue" ? () => "Please specify a valid ID or keyword to get."
  : error === "invalidId" ? () => `${strCapitalize(args[0])} of ID ${args[1]} not found.`
  : error === "invalidReference" ? () => "Please reply to the message to get data from."
  : error === "invalidThisProp" ? () => `Messages do not have a \`${args[0]}\` property.`
  : error === "invalidChannelType" ? () => "The specified channel is not a text-based channel."
  : error === "invalidProp" ? () => `Invalid property: \`${args[0]}\`.`
  : error === "propUndefined" ? () => `Value \`undefined\` at \`${getShortChain(args[0])}\`.`
  : error === "propPrimitive" ? () => `Primitive value \`${getShortStructure(args[1])}\` at \`${getShortChain(args[0])}\`.`
  : error === "propToken" ? () => "Token access is prohibited."
  : error === "methodInvalid" ? () => `Property \`${getShortChain(args[0])}\` is not a function.`
  : error === "methodParamInvalid" ? () => `Value \`${getShortChain(args[0])}\` is not a valid primitive value.`
  : error === "methodError" ? () => `Error at \`${args[0]}\`:\n\`${args[1]}\``
  : null
  msg.channel.send(
    errorMsg.length <= 2000 ? {
      content: errorMsg.length,
      allowedMentions: { parse: [] }
    } : {
      content: "Something went wrong while executing this command.",
      files: [{
        attachment: Buffer.from(errorMsg),
        name: "error.txt"
      }]
    }
  ).catch(() => msg.react('\u2757'))
}
