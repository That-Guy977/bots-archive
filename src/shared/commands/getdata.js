import { Command, SendError } from '../../shared/structures.js'
import {
  isPrimitive, isSnowflake, isToken,
  getSource, getStructure, getShortChain,
  strIsPrimitive, strGetPrimitive, strEscapeMention
} from '../../shared/util.js'
const { thisFile } = getSource(import.meta.url)
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
    if (!types.includes(type)) return SendError[thisFile].invalidType(msg)
    if (!altVal.includes(val) && !isSnowflake(val)) return SendError[thisFile].invalidData(msg)
    if (val === altVal[1] && !msg.reference) return SendError[thisFile].noReply(msg)
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
      if (!val) return SendError[thisFile].invalidGetThis(msg, type)
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
          } catch { return SendError[thisFile].invalidId(msg, types[0], guild) }
          strc = await guild.members.fetch(id)
          break
        }
        case types[4]: {
          let guild = isSnowflake(arg[0]) ? arg.shift() : msg.guildId
          if (altVal.includes(arg[0])) arg.shift()
          try {
            guild = await client.guilds.fetch(guild)
          } catch { return SendError[thisFile].invalidId(msg, types[0], guild) }
          strc = await guild.roles.fetch(id)
          break
        }
        case types[5]: {
          let channel = isSnowflake(arg[0]) ? arg.shift() : msg.channelId
          if (altVal.includes(arg[0])) arg.shift()
          try {
            channel = await client.channels.fetch(channel)
          } catch { return SendError[thisFile].invalidId(msg, types[1], channel) }
          if (!channel.isText()) return SendError[thisFile].invalidGetMessage(msg)
          strc = await channel.messages.fetch(id)
          break
        }
      }
    } catch { return SendError[thisFile].invalidId(msg, type, id) }
  }
  const pchain = [type]
  while (arg.length) {
    const cur = arg.shift()
    if (strc === undefined) return SendError[thisFile].propUndefined(msg, getShortChain(pchain))
    if (cur === 'token' && isToken(strc?.[cur])) return SendError[thisFile].propToken(msg)
    if (isPrimitive(strc) && strc?.[cur] === undefined) return SendError[thisFile].propPrimitive(msg, getShortChain(pchain), strc)
    if (/^\w+$/.test(cur)) {
      pchain.push(cur)
      if (['entries', 'keys', 'values'].includes(cur) && strc instanceof Map) {
        strc = [...strc[cur]()]
        pchain[pchain.length - 1] += "()"
      } else strc = strc[cur]
    } else if (/^\w+\(.*\)$/.test(cur)) {
      const { func, paramList } = cur.match(/^(?<func>\w+)\((?<paramList>.*)\)$/).groups
      pchain.push(func)
      if (strc[func] === undefined) return SendError[thisFile].propUndefined(msg, getShortChain(pchain))
      if (typeof strc[func] !== 'function') return SendError[thisFile].propNotMethod(msg, getShortChain(pchain))
      const params = []
      for (const param of paramList ? paramList.split(", ") : []) {
        if (!strIsPrimitive(param)) return SendError[thisFile].paramNotPrimitive(msg, param)
        params.push(strGetPrimitive(param))
      }
      pchain[pchain.length - 1] += `(${params.length ? "…" : ''})`
      try {
        strc = await strc[func](...params)
      } catch (err) { return SendError[thisFile].methodError(msg, getShortChain(pchain), `${err}`) }
    } else {
      return SendError[thisFile].invalidAccess(msg, cur)
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
