import { Command } from '../../shared/structures.js'
import { MessageEmbed, MessageActionRow } from 'discord.js'

export default new Command({
  name: "ping",
  description: "Pings the bot."
}, async (client, cmd) => {
  const now = Date.now()
  await cmd.deferReply({ fetchReply: true }).then((reply) => {
    cmd.editReply({
      embeds: [generatePong(client, cmd, reply, now)],
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
        const intNow = Date.now()
        int.update({ content: "Pinging...", fetchReply: true }).then((intReply) => {
          int.editReply({ content: null, embeds: [generatePong(client, int, intReply, intNow)] })
        })
      }).on('end', () => {
        cmd.editReply({ components: [] })
      })
    })
  })
})

function generatePong(client, int, reply, date) {
  const intDate = int.createdTimestamp
  const replyDate = int.isCommand() ? reply.createdTimestamp : reply.editedTimestamp
  return new MessageEmbed()
  .setTitle("Pong!")
  .setDescription(`\u{1F493} \`${client.ws.ping} ms\``)
  .setColor('BLUE')
  .setFooter({ text: `Requested by ${int.user.tag}`, iconURL: int.member.displayAvatarURL()})
  .addFields(
    { name: "\u{1F553} Latency", value: `\`${replyDate - intDate} ms\``, inline: true },
    { name: "\u{1F4E5} Recieving", value: `\`${date - intDate} ms\``, inline: true },
    { name: "\u{1F4E4} Sending", value: `\`${replyDate - date} ms\``, inline: true }
  )
  .setTimestamp()
}
