import { Permissions } from 'discord.js'
const { FLAGS: PFlags } = Permissions

export default function hasPerm(client, {
  isClient = true,
  user = client,
  data
}) {
  return isClient
    ? data.channel.type === 'DM' || data.channel.permissionsFor(client.user).has([PFlags.VIEW_CHANNEL, PFlags.READ_MESSAGE_HISTORY, data.permission])
    : data.every((perm) => user.id === perm || user.roles.cache.has(perm) || user.permissions.has(perm))
}
