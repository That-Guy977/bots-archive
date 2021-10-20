const { Event } = require('../../shared/structures.js')
const { updatePremium, updatePresence } = require('../../shared/util.js')

module.exports = new Event('ready', (client) => {
  updatePresence(client)
  updatePremium(client)
  setInterval(updatePresence, 1800000, client)
})
