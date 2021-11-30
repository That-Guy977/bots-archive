import { Event } from '../../shared/structures.js'
import { chnArchived } from '../../shared/util.js'
import fetch from 'node-fetch'

export default new Event('channelUpdate', async (client, oldChannel, channel) => {
  updateMsgLink(client, channel)
  const archive = client.mongoose.models['nc_message']
  const doc = await archive.findById(channel.id).exec() ?? (chnArchived(channel) ? await archive.create({ _id: channel.id, name: channel.name, createdTimestamp: channel.createdTimestamp }) : null)
  if (!doc) return
  if (channel.parentId !== oldChannel.parentId && chnArchived(channel)) {
    const messageColls = []
    let lastMsg = doc.messages[0]?._id ?? "0"
    while (!(messageColls[0]?.size < 100)) {
      messageColls.unshift(await channel.messages.fetch({ limit: 100, after: lastMsg }))
      lastMsg = messageColls[0].firstKey()
    }
    const messages = messageColls.flatMap((coll) => [...coll.values()]).reverse().filter((msg) => !msg.author.bot && msg.type === 'DEFAULT')
    for (const message of messages) {
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
    }
  }
  if (doc.name !== channel.name) doc.name = channel.name
  doc.save()
})

async function updateMsgLink(client, channel) {
  const msgLink = client.mongoose.models['nc_msglink']
  const doc = await msgLink.findById(channel.id).exec()
  if (!doc) return
  if (doc.name !== channel.name) doc.name = channel.name
  doc.save()
}
