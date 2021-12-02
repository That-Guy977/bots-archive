import { Event } from '../../shared/structures.js'
import { readFile } from 'node:fs/promises'
const { ids } = JSON.parse(await readFile('../shared/data.json'))

export default new Event('interactionCreate', (client, cmd) => {
  if (!cmd.isCommand() && !cmd.isContextMenu()) return
  if (!client.commands.has(cmd.commandName)) return cmd.reply({ content: "This command is not yet available.", ephemeral: true })
  const { info, run } = client.commands.get(cmd.commandName)
  if (cmd.user.id === ids.users['main']) return run(client, cmd)
  if (info.test) return cmd.reply({ content: "This command is in testing.", ephemeral: true })
  run(client, cmd)
})
