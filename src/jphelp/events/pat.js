import { Event } from '../../shared/structures.js'
import { chnArchived } from '../../shared/util.js'
const reactions = [
  ['inui_lurk', 'inui_pat']
]

export default new Event('messageCreate', (client, msg) => {
  if (msg.guild.id !== client.guild.id) return
  if (!['hangout', 'nihongo-centre', 'voice-channels'].some((id) => msg.channel.parentId === client.resolveId(id, 'channel')) || chnArchived(msg.channel)) return
  const reaction = reactions.find(([id]) => msg.content === client.getEmoji(id)?.toString())
  if (!reaction) return
  msg.react(client.resolveId(reaction[1], 'emoji')).catch(() => null)
})
