const { Event, SendError } = require('../../shared/structures.js')
const { hasPerm } = require('../../shared/util.js')
const { botData } = require('../../shared/config.json')
const { Permissions: { FLAGS: PFlags } } = require('discord.js')
const thisFile = require('node:path').basename(__filename, '.js')

module.exports = new Event('messageCreate', async (client, msg) => {
  if (msg.author.bot || !msg.content.startsWith(client.prefix)) return
  const [cmd, ...arg] = msg.content.trim().slice(client.prefix.length).split(/\s+/)
  if (!client.commands.has(cmd.toLowerCase())) return
  const { info, run } = client.commands.get(cmd.toLowerCase())
  if (msg.author.id === botData.ids.users['main']) return run(client, msg, arg)
  if (info.test) return
  if (!info.indm && msg.channel.type === 'DM')
    return info.hide ? null : SendError[thisFile].invalidChannel(msg)
  const { channel } = msg
  if (!await hasPerm(client, {
    isClient: false,
    user:
      msg.member
      ?? await client.guild.members.fetch(msg).catch(() => null)
      ?? await client.getGuild('pain').members.fetch(msg).catch(() => null),
    data: info.perm
  }))
    return info.hide ? null
      : hasPerm(client, { data: { channel, permission: PFlags.SEND_MESSAGES } }) ? SendError.general.insufficientPerms(msg)
      : hasPerm(client, { data: { channel, permission: PFlags.ADD_REACTIONS } }) ? msg.react(info.errr) : null
  if (info.args.filter((a) => a.req).length > arg.length)
    return SendError[thisFile].requiredArgs(msg, info.args[arg.length].name)
  run(client, msg, arg)
})
