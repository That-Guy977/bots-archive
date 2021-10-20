const { Event } = require('../../shared/structures.js')
const { updatePremium } = require('../../shared/util.js')
const { evtData } = require('../../shared/config.json')

module.exports = new Event('ready', async (client) => {
  client.state.offline = []
  for (const id of evtData['botPresence'][client.data.guild][2])
    if (await client.getMember(id).then((m) => m.presence?.status ?? 'offline') === 'offline')
      client.state.offline.push(client.resolveId(id, 'users'))
  updatePremium(client)
})
