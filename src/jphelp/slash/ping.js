import { Slash } from '../../shared/structures.js'
import { MessageEmbed } from 'discord.js'

export const command = new Slash({
  name: "ping",
  desc: "Pings the bot.",
  help: "Gets the bot's latency and heartbeat."
}, async (client, interaction) => {
  const embed = new MessageEmbed()
  .setTitle("Pong!")
  .setColor(client.color)
  .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
  .setTimestamp()
  .addFields(
    { name: "\u{1F493} Heartbeat", value: `\`${client.ws.ping} ms\``, inline: true },
    { name: "\u{231A} Pending...", value: "\u200B", inline: true },
    { name: "\u{231A} Pending...", value: "\u200B", inline: true }
  )
  const date = Date.now()
  await interaction.reply({ embeds: [embed], fetchReply: true }).then((res) => {
    embed.fields[1] = { name: "\u{1F4E5} Recieving", value: `\`${date - interaction.createdTimestamp} ms\``, inline: true }
    embed.fields[2] = { name: "\u{1F4E4} Sending", value: `\`${res.createdTimestamp - date} ms\``, inline: true }
    embed.setTimestamp()
    interaction.editReply({ embeds: [embed] })
  })
})