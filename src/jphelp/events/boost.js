import { Event } from '../../shared/structures.js'
import { updatePremium, vanity } from '../../shared/util.js'
import { MessageEmbed } from 'discord.js'

export default new Event('messageCreate', async (client, msg) => {
  if (msg.guild.id !== client.guild.id) return
  if (!msg.type.startsWith("USER_PREMIUM_GUILD_SUBSCRIPTION")) return
  const { guild } = msg
  const member = await guild.members.fetch(msg)
  //-- Move to webhook for improved availability
  client.getChannel('announcements').send({ embeds: [
    new MessageEmbed()
    .setTitle(`${member.displayName} just boosted the server! ありがとうございます！`)
    .setDescription(/\d$/.test(msg.type) ? `${guild.name} just leveled up to level ${msg.type[37]}!` : "")
    .setColor(client.getColor('nitro'))
    .setAuthor({ name: msg.author.tag, iconURL: member.displayAvatarURL() })
    .setFooter({ text: guild.name, iconURL: guild.iconURL()})
    .setTimestamp()
  ] }).catch(() => null)
  if (msg.type.endsWith("3")) vanity(client, guild)
  updatePremium(client)
})
