const { Command } = require('../../shared/structures.js')

module.exports = new Command({
  name: "end",
  perm: ['ADMINISTRATOR'],
  hide: true
}, async (client, msg) => {
  await msg.react('\u2705')
  console.log(`Process of ${client.user.username} exited by ${msg.author.tag} (${msg.author.id})`)
  process.exit()
})
