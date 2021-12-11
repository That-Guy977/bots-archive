import { Event } from '../../shared/structures.js'

export default new Event('messageDeleteBulk', async (client, messages) => {
  if (!client.mongoose) return
  updateMsgLink(client, messages)
  const archive = client.mongoose.models['nc_message']
  const doc = await archive.findById(messages.first().channelId).exec()
  if (!doc) return
  const date = Date.now()
  for (const [, message] of messages) {
    const msgDoc = doc.messages.id(message.id)
    if (!msgDoc) continue
    msgDoc.deleted = true
    msgDoc.deletedTimestamp = date
  }
  doc.save()
})

async function updateMsgLink(client, messages) {
  const msgLink = client.mongoose.models['nc_msglink']
  const doc = await msgLink.findById(messages.first().channelId).exec()
  if (!doc) return
  for (const [, message] of messages) {
    if (doc.firstMsg === message.id) {
      doc.firstMsg = null
      doc.linkMsg = null
      doc.user = null
      message.channel.messages.delete(doc.linkMsg).catch(() => null)
      break
    }
    if (doc.linkMsg === message.id) {
      doc.linkMsg = null
      doc.user = null
    }
  }
  doc.save()
}
