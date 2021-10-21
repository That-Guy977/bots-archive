import { Event } from '../../shared/structures.js'
import { updatePremium, updatePresence } from '../../shared/util.js'

export const event = new Event('ready', (client) => {
  updatePresence(client)
  updatePremium(client)
  setInterval(updatePresence, 1800000, client)
})
