import { Event } from '../../shared/structures.js'

export default new Event('interactionCreate', (client, cmd) => {
  if (!cmd.isApplicationCommand()) return
  if (!client.commands.has(cmd.commandName)) return cmd.reply({ content: "This command is not yet available.", ephemeral: true })
  client.commands.get(cmd.commandName).run(client, cmd)
})
