import { Slash } from '../../shared/structures.js'
import { MessageEmbed } from 'discord.js'

export const command = new Slash({
  name: "ping",
  desc: "Pings the bot."
}, async (client, interaction) => {
  const date = Date.now()
  await interaction.deferReply({ fetchReply: true }).then((res) => {
    interaction.editReply({ embeds: [
      new MessageEmbed()
      .setTitle("Pong!")
      .setColor(client.color)
      .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
      .setTimestamp()
      .addFields(
        { name: "\u{1F493} Heartbeat", value: `\`${client.ws.ping} ms\``, inline: true },
        { name: "\u{1F4E5} Recieving", value: `\`${date - interaction.createdTimestamp} ms\``, inline: true },
        { name: "\u{1F4E4} Sending", value: `\`${res.createdTimestamp - date} ms\``, inline: true }
      )
    ] })
  })
})
