import { Event } from '../../shared/structures.js'
import { strCapitalize } from '../../shared/util.js'
import { MessageEmbed, MessageAttachment } from 'discord.js'
const maxSizes = {
  NONE: 8388608,
  TIER_1: 8388608,
  TIER_2: 52428800,
  TIER_3: 104857600
}

export const event = new Event('messageCreate', (client, msg) => {
  if (!client.state.active) return
  if (msg.author.bot) return
  if (msg.guildId !== client.guild.id) return
  const channel = client.getChannel('file-logs')
  for (const [, att] of msg.attachments) {
    const { type } = att.contentType?.match(/^(?<type>\w+)/).groups ?? { type: null }
    const embed = new MessageEmbed()
    .setTitle(`${type ? `${strCapitalize(type)} file` : "File"} sent: ${att.name}`)
    .setColor(client.color)
    .setURL(msg.url)
    .setFooter(`Sent by ${msg.author.tag} in #${msg.channel.name}`, msg.author.displayAvatarURL())
    .setTimestamp(msg.createdAt)
    const options = { embeds: [embed], files: [] }
    if (att.size <= maxSizes[msg.guild.premiumTier]) {
      options.files.push(new MessageAttachment(att.url, att.name))
      if (type === 'image') embed.setImage(`attachment://${att.name}`)
    } else embed.setDescription("File was too large to attach.")
    channel.send(options).catch((err) => {
      channel.send({ embeds: [
        new MessageEmbed()
        .setTitle("Files sent.")
        .setDescription("Something went wrong while logging.")
        .setColor(client.color)
        .setURL(msg.url)
        .setFooter(`Sent by ${msg.author.tag} in #${msg.channel.name}`, msg.author.displayAvatarURL())
        .setTimestamp(msg.createdAt)
      ] })
      console.error(err)
      console.log(att)
      console.log(new Date())
    }) //-- remove catch logs when ok
  }
})
