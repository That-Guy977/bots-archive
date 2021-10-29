import { Event } from '../../shared/structures.js'
import { cmdData } from '../../shared/config.js'
import fetch from 'node-fetch'

export const event = new Event('messageCreate', async (client, message) => {
  if (message.channel.parentId !== client.resolveId('nihongo-centre', 'channels')) return
  if (cmdData['nc-manage-exempt'].some((id) => client.resolveId(id, 'channels') === message.channelId)) return
  const archive = client.mongoose.models['nc_message']
  const doc = await archive.findById(message.channelId).exec()
  doc.messages.push({
    _id: message.id,
    content: message.content,
    attachments: await Promise.all(message.attachments.map(async (attachment) => ({
      _id: attachment.id,
      file: await fetch(attachment.url).then((res) => res.buffer()),
      name: attachment.name,
      url: attachment.url
    }))),
    author: message.author.id,
    createdTimestamp: message.createdTimestamp
  })
  doc.save()
})
