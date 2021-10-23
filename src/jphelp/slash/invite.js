import { Slash } from '../../shared/structures.js'

export const command = new Slash({
  name: "invite",
  desc: "Gives the invite link of the server.",
  isGlobal: false
}, (client, interaction) => {
  interaction.reply(
    `**Invite link of ${
      interaction.guild.name
    }**: https://discord.gg/7hvYKa4Zek\nVanity invite: ${
      interaction.guild.vanityURLCode ?? "Unavailable"
    }\nThe invite link is also available in ${
      client.getChannel('rules')
    }.`
  )
})
