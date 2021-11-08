import { Event } from '../../shared/structures.js'

export const event = new Event('messageDeleteBulk', async (client, messages) => {
  const archive = client.mongoose.models['nc_message']
  const doc = await archive.findById(messages.first().channelId).exec()
  if (!doc) return
  for (const [, message] of messages) {
    const msgDoc = doc.messages.id(message.id)
    if (!msgDoc) continue
    msgDoc.deleted = true
    msgDoc.deletedTimestamp = Date.now()
  }
  doc.save()
})
