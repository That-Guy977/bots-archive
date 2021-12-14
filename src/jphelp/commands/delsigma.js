import { Command } from '../../shared/structures.js'

export default new Command({
  name: "delsigma",
  description: "Deletes recent messages from Apex Sigma in the channel it's used in.",
  options: [{
    name: 'limit',
    description: "Limit to how many messages are deleted. 1-20, defaults to 1.",
    type: 'INTEGER',
    restraints: {
      min_value: 1,
      max_value: 20
    }
  }],
  isGlobal: false
}, async (client, cmd) => {
  const limit = cmd.options.get('limit')?.value ?? 1
  const messages = await cmd.channel.messages.fetch().then(
    (ms) => ms.filter((m) => m.author.id === client.resolveId('sigma', 'user') && !m.embeds[0]?.author?.iconURL?.startsWith("https://cdn.discordapp.com/avatars")).first(limit)
  )
  if (!messages.length) return cmd.reply({ content: "No messages found to delete.", ephemeral: true })
  await cmd.channel.bulkDelete(messages, true)
  cmd.reply(`Finished deleting ${messages.length} ${messages.length === 1 ? "message" : "messages"}.`)
})
