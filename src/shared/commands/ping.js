import { Command } from '../../shared/structures.js'
import { MessageEmbed, MessageActionRow } from 'discord.js'

export default new Command({
  name: "ping",
  description: "Pings the bot."
}, async (client, cmd) => {
  await cmd.deferReply({ fetchReply: true }).then((reply) => {
    cmd.editReply({
      embeds: [generatePong(client, cmd, reply)],
      components: [
        new MessageActionRow()
        .addComponents({
          type: 'BUTTON',
          label: "Ping",
          style: 'SECONDARY',
          emoji: '\u{1F501}',
          customId: 'ping'
        })
      ]
    }).then((msg) => {
      msg.createMessageComponentCollector({
        time: 600000,
        idle: 60000
      }).on('collect', (int) => {
        int.update({ content: "Pinging...", fetchReply: true }).then((intReply) => {
          int.editReply({ content: null, embeds: [generatePong(client, int, intReply)] })
        })
      }).on('end', () => {
        cmd.editReply({ components: [] })
      })
    })
  })
})

function generatePong(client, int, reply) {
  const intDate = int.createdTimestamp
  const replyDate = int.isCommand() ? reply.createdTimestamp : reply.editedTimestamp
  const date = Date.now()
  return new MessageEmbed()
  .setTitle("Pong!")
  .setColor(client.color)
  .setFooter(`Requested by ${int.user.tag}`, int.user.displayAvatarURL())
  .setTimestamp()
  .setDescription(`\u{1F493} \`${client.ws.ping} ms\``)
  .addFields(
    { name: "\u{1F553} Latency", value: `\`${replyDate - intDate} ms\``, inline: true },
    { name: "\u{1F4E5} Recieving", value: `\`${date - intDate} ms\``, inline: true },
    { name: "\u{1F4E4} Sending", value: `\`${replyDate - date} ms\``, inline: true }
  )
}
