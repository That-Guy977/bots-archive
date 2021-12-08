import { Event } from '../../shared/structures.js'

export default new Event('interactionCreate', async (client, int) => {
  if (!int.isAutocomplete()) return
  const { info } = client.commands.get(int.commandName)
  const focused = int.options.getFocused(true)
  const subcommandgroup = int.options.getSubcommandGroup(false)
  const subcommand = int.options.getSubcommand(false)
  const autocompleteData = info.autocomplete[subcommandgroup]?.[subcommand] ?? info.autocomplete[subcommand] ?? info.autocomplete
  if (!(focused.name in autocompleteData)) return int.respond([])
  const autocomplete = autocompleteData[focused.name]
  const res = await autocomplete(client, focused.value, int.options)
  int.respond(res).catch(() => null)
})
