import { Event } from '../../shared/structures.js'
import { cmdData } from '../../shared/config.js'
import fetch from 'node-fetch'

export const event = new Event('channelUpdate', async (client, _oldChannel, channel) => {
  if (channel.guildId !== client.guild.id) return
  if (channel.type !== 'GUILD_TEXT') return
  if (channel.parentId !== client.resolveId('nihongo-centre', 'channels')) return
  if (cmdData['nc-manage-exempt'].some((id) => client.resolveId(id, 'channels') === channel.id)) return
  updateMsgLink(client, channel)
  const archive = client.mongoose.models['nc_message']
  const doc = await archive.findById(channel.id).exec() ?? await archive.create({ _id: channel.id, name: channel.name, createdTimestamp: channel.createdTimestamp })
  if (doc.name !== channel.name) doc.name = channel.name
  else {
    const messageColls = []
    let lastMsg = doc.messages[0]?._id ?? "0"
    while (!(messageColls[0]?.size < 10)) {
      messageColls.unshift(await channel.messages.fetch({ limit: 10, after: lastMsg }))
      lastMsg = messageColls[0].firstKey()
    }
    const messages = messageColls.map((coll) => [...coll.values()]).flat().reverse()
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
  doc.save()
})

async function updateMsgLink(client, channel) {
  const msgLink = client.mongoose.models['nc_msglink']
  const doc = await msgLink.findById(channel.id).exec()
  if (!doc) return
  if (doc.name !== channel.name) {
    doc.name = channel.name
    doc.save()
  }
}
