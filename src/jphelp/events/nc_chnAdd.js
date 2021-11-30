import { Event } from '../../shared/structures.js'
import { chnArchived } from '../../shared/util.js'

export default new Event('channelCreate', (client, channel) => {
  if (!chnArchived(channel)) return
  const archive = client.mongoose.models['nc_message']
  archive.create({ _id: channel.id, name: channel.name, createdTimestamp: channel.createdTimestamp })
})
