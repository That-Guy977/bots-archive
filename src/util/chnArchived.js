import Client from '../structures/Client.js'
import { readFile } from 'node:fs/promises'
const { cmdData } = JSON.parse(await readFile('../shared/config.json'))

export default function chnArchived(channel) {
  return channel.type === 'GUILD_TEXT'
  && channel.parentId === Client.resolveId('nihongo-centre', 'channel', 'jp101')
  && cmdData['nc_manage-exempt'].every((id) => Client.resolveId(id, 'channel', 'jp101') !== channel.id)
}
