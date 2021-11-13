import { Command } from '../../shared/structures.js'

export const command = new Command({
  name: "delsigma",
  desc: "Deletes recent messages from Apex Sigma in the channel it's used in.",
  help: "Finds and deletes past messages from Apex Sigma in the channel it's used in. Checks up to 50 past messages.",
  args: [{
    name: "limit",
    desc: "Limit to how many messages are deleted. Max 20. Defaults to 1.",
    help: "Sets a limit for how many messages can be deleted. If fewer messages are found, all that are found are deleted. Max 20. Defaults to 1.",
    type: "number",
    req: false
  }],
  indm: false
}, async (client, msg, arg) => {
  if (msg.guildId !== client.guild.id) return msg.channel.send("This command is not available in this guild.")
  arg[0] ??= "1"
  if (!/^-?\d+$/.test(arg[0])) return msg.channel.send(`\`${arg[0]}\` is not a valid number.`)
  const limit = parseInt(arg[0])
  if (limit > 20) return msg.channel.send("Cannot delete more than 20 messages.")
  if (limit < 1) return msg.channel.send("Cannot delete less than 1 message.")
  const messages = await msg.channel.messages.fetch().then((ms) => ms.filter((m) => m.author.id === client.resolveId('sigma', 'user')).first(limit))
  if (!messages.length) return msg.channel.send("No messages found to delete.")
  await msg.channel.bulkDelete(messages, true)
  msg.channel.send(`Finished deleting ${messages.length} message${messages.length - 1 ? "s" : ""}.`)
})
