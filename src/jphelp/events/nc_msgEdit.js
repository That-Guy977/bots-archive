import { Event } from '../../shared/structures.js'
import { cmdData } from '../../shared/config.js'
import fetch from 'node-fetch'

export const event = new Event('messageUpdate', async (client, _oldMessage, message) => {
  if (message.channel.parentId !== client.resolveId('nihongo-centre', 'channels')) return
  if (cmdData['nc-manage-exempt'].some((id) => client.resolveId(id, 'channels') === message.channelId)) return
  const archive = client.mongoose.models['nc_message']
  const doc = await archive.findById(message.channelId).exec()
  const msgDoc = await doc.messages.id(message.id)
  msgDoc.content = message.content
  await Promise.all(
    message.attachments
    .filter((attachment) => !msgDoc.attachments.map((att) => att._id).includes(attachment.id))
    .map(async (attachment) => msgDoc.attachments.push({
      _id: attachment.id,
      file: await fetch(attachment.url).then((res) => res.buffer()),
      name: attachment.name,
      url: attachment.url
    }))
  )
  doc.save()
})
