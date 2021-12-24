import { Event } from '../../shared/structures.js'
import { getSource } from '../../shared/util.js'
import { readFile } from 'node:fs/promises'
import { MessageEmbed } from 'discord.js'
const { config } = JSON.parse(await readFile('shared/data.json'))
const { thisFile } = getSource(import.meta.url)

export default new Event('presenceUpdate', async (client, oldPresence, presence) => {
  if (presence.guild.id !== client.guild.id) return
  if (isOnline(presence) === isOnline(oldPresence)) return
  const logUsers = config[thisFile][client.source]
  if (!logUsers.some((id) => client.resolveId(id, 'user') === presence.userId)) return
  const embed = new MessageEmbed()
  .setTitle(`${presence.user.username} ${isOnline(presence) ? "online!" : "offline."}`)
  .setColor(client.source === 'jphelp' ? client.getColor(presence.userId) : 'RED')
  .setAuthor({ name: presence.user.tag, iconURL: presence.user.displayAvatarURL() })
  .setTimestamp()
  if (client.source === 'jphelp') {
    if (isOnline(presence)) {
      if (!client.state.offline.includes(presence.userId)) return
      client.state.offline = client.state.offline.filter((id) => id !== presence.userId)
      sendStatus(client, embed)
    } else {
      setTimeout(async () => {
        if (await presence.member.fetch().then((m) => isOnline(m.presence))) return
        sendStatus(client, embed)
        client.state.offline.push(presence.userId)
      }, 300000)
    }
  } else if (client.source === 'omega') {
    if (isOnline(presence)) return
    if (presence.user.partial) await presence.user.fetch()
    sendStatus(client, embed)
  }
})

function sendStatus(client, embed) {
  client.channel.send({ embeds: [embed] }).catch(() => null)
}

function isOnline(presence) {
  return (presence?.status ?? 'offline') !== 'offline'
}
