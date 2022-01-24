import { Event } from '../../shared/structures.js'
import { chnArchived } from '../../shared/util.js'

export default new Event('messageCreate', (client, msg) => {
  if (msg.guild.id !== client.guild.id) return
  if (!['hangout', 'nihongo-centre', 'voice-channels'].some((id) => msg.channel.parentId === client.resolveId(id, 'channel')) || chnArchived(msg.channel)) return
  if (msg.content !== client.getEmoji('inui_lurk')?.toString()) return
  msg.react(client.resolveId('inui_pat', 'emoji')).catch(() => null)
})
