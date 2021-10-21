import { Event } from '../../shared/structures.js'
import { updatePremium } from '../../shared/util.js'
import { MessageEmbed } from 'discord.js'
const tiers = {
  NONE: 0,
  TIER_1: 1,
  TIER_2: 2,
  TIER_3: 3
}

export const event = new Event('guildMemberUpdate', async (client, oldMember, member) => {
  if (member.guild.id !== client.guild.id) return
  if (member.partial) await member.fetch().catch(() => null)
  if (!member.premiumSinceTimestamp || member.premiumSinceTimestamp === oldMember.premiumSinceTimestamp) return
  const times = member.guild.premiumSubscriptionCount - client.state.premium.premiumSubscriptionCount
  client.getChannel('announcements').send({ embeds: [
    new MessageEmbed()
    .setTitle(`${member.displayName} just boosted the server${times > 1 ? ` ${times} times` : ""}! ありがとうございます！`)
    .setDescription(member.guild.premiumTier > client.state.premium.premiumTier ? `${member.guild.name} just leveled up to level ${tiers[member.guild.premiumTier]}!` : "")
    .setColor(client.getColor('nitro'))
    .setAuthor(member.user.tag, member.user.displayAvatarURL())
    .setFooter(member.guild.name, member.guild.iconURL())
    .setTimestamp()
  ] })
  updatePremium(client)
})
