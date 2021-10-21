import { Event } from '../../shared/structures.js'
import { getSource, strCapitalize, genLogs } from '../../shared/util.js'
import { evtData } from '../../shared/config.js'
const { thisFile } = getSource(import.meta.url)

export const event = new Event('guildMemberAdd', (client, member) => {
  if (member.guild.id !== client.guild.id) return
  if (client.data.alternate && !client.state.active) return
  const [memberRole, botRole, logChannel] = evtData[thisFile][client.data.guild]
  const role = client.getRole(!member.user.bot ? memberRole : botRole)
  if (role) {
    member.roles.add(role).then(() => {
      if (logChannel) {
        genLogs(client, logChannel, {
          action: "Give Role",
          user: `@${member.user.tag} (${member.id})`,
          role: `@${role.name} (${role.id})`,
          reason: strCapitalize(thisFile)
        }, [member.id, role.name, "given"])
      }
    }).catch(() => null)
  }
})
