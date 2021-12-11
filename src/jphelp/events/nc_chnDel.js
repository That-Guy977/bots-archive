import { Event } from '../../shared/structures.js'

export default new Event('channelDelete', async (client, channel) => {
  if (!client.mongoose) return
  updateMsgLink(client, channel)
  const archive = client.mongoose.models['nc_message']
  const doc = await archive.findById(channel.id).exec()
  if (!doc) return
  const date = Date.now()
  doc.deleted = true
  doc.deletedTimestamp = date
  const messages = doc.messages.filter((msg) => !msg.deleted)
  for (const message of messages) {
    message.deleted = true
    message.deletedTimestamp = date
  }
  doc.save()
})

function updateMsgLink(client, channel) {
  const msgLink = client.mongoose.models['nc_msglink']
  msgLink.findByIdAndDelete(channel.id).exec()
}
