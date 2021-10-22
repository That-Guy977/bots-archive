import { Event } from '../../shared/structures.js'
import { updatePremium } from '../../shared/util.js'
import { evtData } from '../../shared/config.js'
import { Collection } from 'discord.js'
import { readdir } from 'node:fs/promises'

export const event = new Event('ready', async (client) => {
  client.slash = new Collection()
  client.state.offline = []
  for (const id of evtData['botPresence'][client.data.guild][2])
    if (await client.getMember(id).then((m) => m.presence?.status ?? 'offline') === 'offline')
      client.state.offline.push(client.resolveId(id, 'users'))
  updatePremium(client)
  for (const file of await readdir('../jphelp/slash').then((files) => files.filter((f) => f.endsWith(".js")))) {
    const { command } = await import(`../slash/${file}`)
    client.slash.set(command.info.name, command)
  }
})
