import { Event } from '../../shared/structures.js'
import { MessageEmbed } from 'discord.js'

export default new Event('ready', (client) => {
  console.log(`Logged in as ${client.user.tag}`)
  client.channel.send({ embeds: [
    new MessageEmbed()
    .setTitle(`${client.guild.me.displayName} online!`)
    .setColor('BLUE')
    .setTimestamp()
  ] }).catch(() => null)
})
