import { Event } from '../../shared/structures.js'
import { botData } from '../../shared/config.js'

export const event = new Event('interactionCreate', (client, cmd) => {
  if (!cmd.isCommand()) return
  if (!client.slash.has(cmd.commandName)) return cmd.reply({ content: "This command is not yet available.", ephemeral: true })
  const { info, run } = client.slash.get(cmd.commandName)
  if (cmd.user.id === botData.ids.users['main']) return run(client, cmd)
  if (info.test) return cmd.reply({ content: "This command is in testing.", ephemeral: true })
  run(client, cmd)
})
