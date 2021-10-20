const { Event } = require('../../shared/structures.js')
const { MessageEmbed } = require('discord.js')

module.exports = new Event('ready', (client) => {
  console.log(`Logged in as ${client.user.tag}`)
  client.channel.send({ embeds: [
    new MessageEmbed()
    .setTitle(`${client.guild.me.displayName} online!`)
    .setColor(client.color)
    .setTimestamp()
  ] })
})
