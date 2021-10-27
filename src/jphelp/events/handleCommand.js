import { Event } from '../../shared/structures.js'
import { botData } from '../../shared/config.js'

export const event = new Event('interactionCreate', (client, cmd) => {
  if (!cmd.isCommand() && !cmd.isContextMenu()) return
  if (!client.interactionCommands.has(cmd.commandName)) return cmd.reply({ content: "This command is not yet available.", ephemeral: true })
  const { info, run } = client.interactionCommands.get(cmd.commandName)
  if (cmd.user.id === botData.ids.users['main']) return run(client, cmd)
  if (info.test) return cmd.reply({ content: "This command is in testing.", ephemeral: true })
  run(client, cmd)
})
