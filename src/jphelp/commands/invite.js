import { Command } from '../../shared/structures.js'

export default new Command({
  name: "invite",
  description: "Gives the invite link of the server.",
  isGlobal: false
}, (client, cmd) => {
  cmd.reply(
    `**Invite link of ${
      cmd.guild.name
    }**: https://discord.gg/7hvYKa4Zek\nVanity invite: ${
      cmd.guild.vanityURLCode ?? "Unavailable"
    }\nThe invite link is also available in ${
      client.getChannel('rules')
    }.`
  )
})
