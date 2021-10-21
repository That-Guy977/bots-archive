import { Event } from '../../shared/structures.js'
import { getSource } from '../../shared/util.js'
import { evtData } from '../../shared/config.js'
import { MessageEmbed } from 'discord.js'
const { thisFile } = getSource(import.meta.url)

export const event = new Event('presenceUpdate', async (client, oldPresence, presence) => {
  if (presence.guild.id !== client.guild.id) return
  if (client.data.alternate && !client.state.active) return
  if (isOnline(presence) === isOnline(oldPresence)) return
  const [, defaultColor, logUsers] = evtData[thisFile][client.data.guild]
  if (!logUsers.some((id) => client.resolveId(id, 'users') === presence.userId)) return
  if (presence.user.partial) await presence.user.fetch()
  const color = defaultColor ?? client.getColor(presence.userId)
  if (isOnline(presence)) {
    if (!client.state.offline.includes(presence.userId)) return
    sendStatus(client, presence, color)
    client.state.offline = client.state.offline.filter((id) => id !== presence.userId)
  } else {
    setTimeout(async () => {
      if (await presence.member.fetch().then((m) => isOnline(m.presence))) return
      sendStatus(client, presence, color, true)
      client.state.offline.push(presence.userId)
    }, 300000)
  }
})

function sendStatus(client, presence, color, offline = false) {
  client.channel.send({ embeds: [
    new MessageEmbed()
    .setTitle(`${presence.user.username} ${isOnline(presence) && !offline ? "online!" : "offline."}`)
    .setColor(color)
    .setAuthor(presence.user.tag, presence.user.displayAvatarURL())
    .setTimestamp()
  ] })
}

function isOnline(presence) {
  return (presence?.status ?? 'offline') !== 'offline'
}
