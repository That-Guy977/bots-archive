import { ApplicationCommand } from '../../shared/structures.js'

export const command = new ApplicationCommand({
  name: "delsigma",
  desc: "Deletes recent messages from Apex Sigma in the channel it's used in.",
  options: [{
    name: "limit",
    desc: "Limit to how many messages are deleted. 1-20, defaults to 1.",
    type: 'INTEGER',
    required: false,
    restraints: {
      min_value: 1,
      max_value: 20
    }
  }],
  isGlobal: false
}, async (client, cmd) => {
  const limit = cmd.options.get('limit')?.value ?? 1
  const messages = await cmd.channel.messages.fetch().then((ms) => ms.filter((m) => m.author.id === client.resolveId('sigma', 'user')).first(limit))
  if (!messages.length) return cmd.reply({ content: "No messages found to delete.", ephemeral: true })
  await cmd.channel.bulkDelete(messages, true)
  cmd.reply(`Finished deleting ${messages.length} message${messages.length - 1 ? "s" : ""}.`)
})
