import { Event } from '../../shared/structures.js'

export const event = new Event('channelDelete', async (client, channel) => {
  if (channel.guildId !== client.guild.id) return
  if (channel.type !== 'GUILD_TEXT') return
  if (channel.parentId !== client.resolveId('nihongo-centre', 'channels')) return
  const archive = client.mongoose.models['nc_message']
  const doc = await archive.findById(channel.id).exec()
  doc.deleted = true
  doc.deletedTimestamp = Date.now()
  doc.messages.forEach((message) => {
    if (message.deleted) return
    message.deleted = true
    message.deletedTimestamp = Date.now()
  })
  doc.save()
})
