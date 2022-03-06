import { Event } from '../../shared/structures.js'
import { chnArchived } from '../../shared/util.js'
import fetch from 'node-fetch'

export default new Event('messageCreate', async (client, message) => {
  if (!client.mongoose) return
  if (!chnArchived(message.channel)) return
  if (message.author.bot || !['DEFAULT', 'REPLY'].includes(message.type)) return
  const archive = client.mongoose.models['nc_message']
  const doc = await archive.findById(message.channelId).exec()
  if (!doc) return
  doc.messages.unshift({
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
