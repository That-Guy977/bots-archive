import { Event } from '../../shared/structures.js'

export const event = new Event('messageDelete', async (client, message) => {
  updateMsgLink(client, message)
  const archive = client.mongoose.models['nc_message']
  const doc = await archive.findById(message.channelId).exec()
  if (!doc) return
  const msgDoc = doc.messages.id(message.id)
  if (!msgDoc) return
  msgDoc.deleted = true
  msgDoc.deletedTimestamp = Date.now()
  doc.save()
})

async function updateMsgLink(client, message) {
  const msgLink = client.mongoose.models['nc_msglink']
  const doc = await msgLink.findById(message.channelId).exec()
  if (!doc) return
  if (doc.firstMsg === message.id) {
    message.channel.messages.delete(doc.linkMsg).catch(() => null)
    doc.firstMsg = null
    doc.linkMsg = null
    doc.user = null
  }
  if (doc.linkMsg === message.id) {
    doc.linkMsg = null
    doc.user = null
  }
  doc.save()
}
