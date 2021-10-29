import { Event } from '../../shared/structures.js'
import { cmdData } from '../../shared/config.js'
import fetch from 'node-fetch'

export const event = new Event('messageUpdate', async (client, _oldMessage, message) => {
  if (message.channel.parentId !== client.resolveId('nihongo-centre', 'channels')) return
  if (cmdData['nc-manage-exempt'].some((id) => client.resolveId(id, 'channels') === message.channelId)) return
  const archive = client.mongoose.models['nc_message']
  const doc = await archive.findById(message.channelId).exec()
  const msgDoc = await doc.messages.id(message.id)
  msgDoc.edits.push({
    _id: message.editedTimestamp,
    content: msgDoc.content,
    attachments: msgDoc.attachments
  })
  msgDoc.content = message.content
  msgDoc.attachments = await Promise.all(message.attachments.map(async ({ name, url }, id) => ({
    _id: id,
    file: await fetch(url).then((res) => res.buffer()),
    name,
    url
  })))
  doc.save()
})
