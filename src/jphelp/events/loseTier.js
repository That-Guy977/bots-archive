import { Event } from '../../shared/structures.js'
import { updatePremium } from '../../shared/util.js'
import { MessageEmbed } from 'discord.js'
const tiers = {
  NONE: 0,
  TIER_1: 1,
  TIER_2: 2,
  TIER_3: 3
}

export default new Event('guildUpdate', (client, _oldGuild, guild) => {
  if (guild.id !== client.guild.id) return
  if (guild.premiumTier >= client.state.premium.premiumTier) return
  client.getChannel('announcements').send({ embeds: [
    new MessageEmbed()
    .setTitle(`${guild.name} just lost a level and is now level ${tiers[guild.premiumTier]}.`)
    .setColor('RED')
    .setFooter(guild.name, guild.iconURL())
    .setTimestamp()
  ] })
  updatePremium(client)
})
