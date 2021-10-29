import { Event } from '../../shared/structures.js'
import { cmdData } from '../../shared/config.js'

export const event = new Event('messageDelete', async (client, message) => {
  if (message.channel.parentId !== client.resolveId('nihongo-centre', 'channels')) return
  if (cmdData['nc-manage-exempt'].some((id) => client.resolveId(id, 'channels') === message.channelId)) return
  const archive = client.mongoose.models['nc_message']
  const doc = await archive.findById(message.channelId).exec()
  const msgDoc = doc.messages.id(message.id)
  if (!msgDoc) return
  msgDoc.deleted = true
  msgDoc.deletedTimestamp = Date.now()
  doc.save()
})
