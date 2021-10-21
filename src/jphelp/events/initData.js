import { Event } from '../../shared/structures.js'
import { updatePremium } from '../../shared/util.js'
import { evtData } from '../../shared/config.js'

export const event = new Event('ready', async (client) => {
  client.state.offline = []
  for (const id of evtData['botPresence'][client.data.guild][2])
    if (await client.getMember(id).then((m) => m.presence?.status ?? 'offline') === 'offline')
      client.state.offline.push(client.resolveId(id, 'users'))
  updatePremium(client)
})
