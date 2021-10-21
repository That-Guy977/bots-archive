import { Command, SendError } from '../../shared/structures.js'

export const command = new Command({
  name: "invite",
  help: "Gives the invite link of the server.",
  desc: "Gives Japanese 101's invite link."
}, (client, msg) => {
  if (msg.guild.id !== client.guild.id) return SendError.general.invalidGuild(msg)
  msg.channel.send(
    `**Invite link of ${
      msg.guild.name
    }**: https://discord.gg/7hvYKa4Zek\nVanity invite: ${
      msg.guild.vanityURLCode ?? "Unavailable"
    }\nThe invite link is also available in ${
      client.getChannel('rules')
    }.`
  )
})
