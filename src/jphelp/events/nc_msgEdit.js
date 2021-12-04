import { Event } from '../../shared/structures.js'
import fetch from 'node-fetch'

export default new Event('messageUpdate', async (client, _oldMessage, message) => {
  if (!client.mongoose) return
  const archive = client.mongoose.models['nc_message']
  const doc = await archive.findById(message.channelId).exec()
  if (!doc) return
  const msgDoc = await doc.messages.id(message.id)
  if (!msgDoc) return
  if (
    msgDoc.content === message.content
    && msgDoc.attachments.map((att) => att._id).join(" ") === message.attachments.map((att) => att.id).join(" ")
  ) return
  msgDoc.edits.push({
    _id: message.editedTimestamp,
    content: msgDoc.content,
    attachments: msgDoc.attachments
  })
  msgDoc.content = message.content
  msgDoc.attachments = await Promise.all(message.attachments.map(async (attachment) => ({
    _id: attachment.id,
    file: await fetch(attachment.url).then((res) => res.buffer()),
    name: attachment.name,
    url: attachment.url
  })))
  doc.save()
})
