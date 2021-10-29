import { Event } from '../../shared/structures.js'
import { cmdData } from '../../shared/config.js'

/* eslint-disable no-continue */

export const event = new Event('messageDeleteBulk', async (client, messages) => {
  if (messages.first().channel.parentId !== client.resolveId('nihongo-centre', 'channels')) return
  if (cmdData['nc-manage-exempt'].some((id) => client.resolveId(id, 'channels') === messages.first().channelId)) return
  const archive = client.mongoose.models['nc_message']
  const doc = await archive.findById(messages.first().channelId).exec()
  for (const [, message] of messages) {
    const msgDoc = doc.messages.id(message.id)
    if (!msgDoc) continue
    msgDoc.deleted = true
    msgDoc.deletedTimestamp = Date.now()
  }
  doc.save()
})
