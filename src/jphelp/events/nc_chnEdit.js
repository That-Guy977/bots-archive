import { Event } from '../../shared/structures.js'
import { cmdData } from '../../shared/config.js'

export const event = new Event('channelUpdate', async (client, _oldChannel, channel) => {
  if (channel.guildId !== client.guild.id) return
  if (channel.type !== 'GUILD_TEXT') return
  if (channel.parentId !== client.resolveId('nihongo-centre', 'channels')) return
  if (cmdData['nc-manage-exempt'].some((id) => client.resolveId(id, 'channels') === channel.id)) return
  const archive = client.mongoose.models['nc_message']
  const msgLink = client.mongoose.models['nc_msglink']
  const doc = await archive.findById(channel.id).exec() ?? await archive.create({ _id: channel.id, name: channel.name, createdTimestamp: channel.createdTimestamp })
  const linkDoc = await msgLink.findById(channel.id).exec()
  if (doc.name !== channel.name) doc.name = channel.name
  if (linkDoc && linkDoc?.name !== channel.name) {
    linkDoc.name = channel.name
    linkDoc.save()
  }
  //-- add fetching messages from last saved
  doc.save()
})
