import { Command } from '../../shared/structures.js'
import { setVanity } from '../../shared/util.js'
import { readFile } from 'node:fs/promises'
const { config } = JSON.parse(await readFile('shared/data.json'))

export default new Command({
  name: "invite",
  description: "Gives the invite link of the server.",
  isGlobal: false
}, async (client, cmd) => {
  const { guild } = cmd
  if (!guild.vanityURLCode && guild.premiumTier === 'TIER_3') await setVanity(client, guild)
  cmd.reply(
    `**Invite link of ${
      guild.name
    }**: https://discord.gg/7hvYKa4Zek\nVanity invite: ${
      guild.vanityURLCode ?? (guild.premiumTier === 'TIER_3' ? config.vanity[client.source] : "Unavailable")
    }\nThe invite link is also available in ${
      client.getChannel('rules')
    }.`
  )
})
