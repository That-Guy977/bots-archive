import { Event } from '../../shared/structures.js'

export const event = new Event('channelDelete', async (client, channel) => {
  updateMsgLink(client, channel)
  const archive = client.mongoose.models['nc_message']
  const doc = await archive.findById(channel.id).exec()
  if (!doc) return
  doc.deleted = true
  doc.deletedTimestamp = Date.now()
  const messages = doc.messages.filter((msg) => !msg.deleted)
  for (const message of messages) {
    message.deleted = true
    message.deletedTimestamp = Date.now()
  }
  doc.save()
})

function updateMsgLink(client, channel) {
  const msgLink = client.mongoose.models['nc_msglink']
  msgLink.findByIdAndDelete(channel.id).exec()
}
