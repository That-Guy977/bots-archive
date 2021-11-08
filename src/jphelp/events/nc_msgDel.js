import { Event } from '../../shared/structures.js'

export const event = new Event('messageDelete', async (client, message) => {
  const archive = client.mongoose.models['nc_message']
  const doc = await archive.findById(message.channelId).exec()
  if (!doc) return
  const msgDoc = doc.messages.id(message.id)
  if (!msgDoc) return
  msgDoc.deleted = true
  msgDoc.deletedTimestamp = Date.now()
  doc.save()
})
