import { Event } from '../../shared/structures.js'

export const event = new Event('channelUpdate', async (client, oldChannel, channel) => {
  if (channel.guildId !== client.guild.id) return
  if (channel.type !== 'GUILD_TEXT') return
  if (channel.parentId !== client.resolveId('nihongo-centre', 'channels')) return
  const archive = client.mongoose.models['nc_message']
  const doc = await archive.findById(channel.id).exec() ?? await archive.create({ _id: channel.id, name: channel.name, createdTimestamp: channel.createdTimestamp })
  if (doc.name !== channel.name) doc.name = channel.name
  //-- add fetching messages from last saved
  doc.save()
})
