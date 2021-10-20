const { Event } = require('../../shared/structures.js')
const { strCapitalize, genLogs } = require('../../shared/util.js')
const { evtData } = require('../../shared/config.json')
const thisFile = require('node:path').basename(__filename, '.js')

module.exports = new Event('guildMemberAdd', (client, member) => {
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
