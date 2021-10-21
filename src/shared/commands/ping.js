import { Command } from '../../shared/structures.js'
import { MessageEmbed } from 'discord.js'

export const command = new Command({
  name: "ping",
  help: "Pings the bot.",
  desc: "Gets the bot's latency and heartbeat."
}, (client, msg) => {
  const embed = new MessageEmbed()
  .setTitle("Pong!")
  .setColor(client.color)
  .setFooter(`Requested by ${msg.author.tag}`, msg.author.displayAvatarURL())
  .setTimestamp()
  .addFields(
    { name: "\u{1F493} Heartbeat", value: `\`${client.ws.ping} ms\``, inline: true },
    { name: "\u{231A} Pending...", value: "\u200B", inline: true },
    { name: "\u{231A} Pending...", value: "\u200B", inline: true }
  )
  const date = Date.now()
  msg.channel.send({ embeds: [embed] }).then((m) => {
    embed.fields[1] = { name: "\u{1F4E5} Recieving", value: `\`${date - msg.createdTimestamp} ms\``, inline: true }
    embed.fields[2] = { name: "\u{1F4E4} Sending", value: `\`${m.createdTimestamp - date} ms\``, inline: true }
    m.edit({ embeds: [embed.setTimestamp()] })
  })
})
