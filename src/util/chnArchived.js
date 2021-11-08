import Client from '../structures/Client.js'
import { cmdData } from '../shared/config.js'

export default function chnArchived(channel) {
  return channel.type === 'GUILD_TEXT'
  && channel.parentId === Client.resolveId('nihongo-centre', 'channels', 'jp101')
  && cmdData['nc_manage-exempt'].every((id) => Client.resolveId(id, 'channels', 'jp101') !== channel.id)
}
