import { Event } from '../structures.js'
import { Permissions } from 'discord.js'
import { readFile } from 'node:fs/promises'
const { botData } = JSON.parse(await readFile('../shared/config.json'))
const { FLAGS: PFlags } = Permissions

export const event = new Event('messageCreate', async (client, msg) => {
  if (msg.author.bot || !msg.content.startsWith(client.prefix)) return
  const [cmd, ...arg] = msg.content.trim().slice(client.prefix.length).split(/\s+/)
  if (!client.legacyCommands.has(cmd.toLowerCase())) return
  const { info, run } = client.legacyCommands.get(cmd.toLowerCase())
  if (msg.author.id === botData.ids.users['main']) return run(client, msg, arg)
  if (info.test) return
  if (!info.indm && msg.channel.type === 'DM')
    return info.hide ? null : msg.channel.send("This command is not available in Direct Messages.")
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
      : hasPerm(client, { data: { channel, permission: PFlags.SEND_MESSAGES } }) ? msg.channel.send("You don't have permission to do that!")
      : hasPerm(client, { data: { channel, permission: PFlags.ADD_REACTIONS } }) ? msg.react(info.errr) : null
  if (info.args.filter((a) => a.req).length > arg.length)
    return msg.channel.send(`Argument \`${info.args[arg.length].name}\` is required for this command.`)
  run(client, msg, arg)
})

function hasPerm(client, {
  isClient = true,
  user = client,
  data
}) {
  return isClient
    ? data.channel.type === 'DM' || data.channel.permissionsFor(client.user).has([PFlags.VIEW_CHANNEL, PFlags.READ_MESSAGE_HISTORY, data.permission])
    : data.every((perm) => user.id === perm || user.roles.cache.has(perm) || user.permissions.has(perm))
}
