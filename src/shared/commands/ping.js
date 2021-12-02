import { Command } from '../../shared/structures.js'
import { MessageEmbed } from 'discord.js'

export default new Command({
  name: "ping",
  description: "Pings the bot."
}, async (client, cmd) => {
  const date = Date.now()
  await cmd.deferReply({ fetchReply: true }).then((reply) => {
    cmd.editReply({ embeds: [
      new MessageEmbed()
      .setTitle("Pong!")
      .setColor(client.color)
      .setFooter(`Requested by ${cmd.user.tag}`, cmd.user.displayAvatarURL())
      .setTimestamp()
      .addFields(
        { name: "\u{1F493} Heartbeat", value: `\`${client.ws.ping} ms\``, inline: true },
        { name: "\u{1F4E5} Recieving", value: `\`${date - cmd.createdTimestamp} ms\``, inline: true },
        { name: "\u{1F4E4} Sending", value: `\`${reply.createdTimestamp - date} ms\``, inline: true }
      )
    ] })
  })
})
