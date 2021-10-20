const { Event } = require('../../shared/structures.js')
const { evtData } = require('../config.json')
const { MessageEmbed } = require('discord.js')
const thisFile = require('node:path').basename(__filename, '.js')

module.exports = new Event('presenceUpdate', async (client, oldPresence, presence) => {
  if (presence.guild.id !== client.guild.id) return
  if (client.data.alternate && !client.state.active) return
  if (isOnline(presence) === isOnline(oldPresence)) return
  const [logOnline, defaultColor, logUsers] = evtData[thisFile][client.data.guild]
  if (!logUsers.some((id) => client.resolveId(id, 'users') === presence.userId)) return
  if (isOnline(presence) && !logOnline) return
  if (presence.user.partial) await presence.user.fetch()
  const color = defaultColor ?? client.getColor(presence.userId)
  client.channel.send({ embeds: [
    new MessageEmbed()
    .setTitle(`${presence.user.username} ${isOnline(presence) ? "online!" : "offline."}`)
    .setColor(color)
    .setAuthor(presence.user.tag, presence.user.displayAvatarURL())
    .setTimestamp()
  ] })
})

function isOnline(presence) {
  return (presence?.status ?? 'offline') !== 'offline'
}
