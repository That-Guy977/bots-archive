import { Event } from '../../shared/structures.js'
import { getSource, strCapitalize, genLogs } from '../../shared/util.js'
import { readFile } from 'node:fs/promises'
const { data } = JSON.parse(await readFile('../shared/config.json'))
const { thisFile } = getSource(import.meta.url)

export const event = new Event('guildMemberAdd', (client, member) => {
  if (member.guild.id !== client.guild.id) return
  const [memberRole, botRole, logChannel] = data[thisFile][client.source]
  const role = client.getRole(!member.user.bot ? memberRole : botRole)
  if (role) {
    member.roles.add(role).then(() => {
      if (logChannel) {
        genLogs(client, logChannel, {
          action: "Give Role",
          user: `@${member.user.tag} (${member.id})`,
          role: `@${role.name} (${role.id})`,
          reason: strCapitalize(thisFile)
        }, 'mod-logs', [member.id, role.name, "given"])
      }
    }).catch(() => null)
  }
})
