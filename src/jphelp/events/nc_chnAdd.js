import { Event } from '../../shared/structures.js'

export const event = new Event('channelCreate', (client, channel) => {
  if (channel.guildId !== client.guild.id) return
  if (channel.type !== 'GUILD_TEXT') return
  if (channel.parentId !== client.resolveId('nihongo-centre', 'channels')) return
  const archive = client.mongoose.models['nc_message']
  archive.create({ _id: channel.id, name: channel.name, createdTimestamp: channel.createdTimestamp })
})
