import { Command, SendError } from '../../shared/structures.js'
import { getSource } from '../../shared/util.js'
const { thisFile } = getSource(import.meta.url)

export const command = new Command({
  name: "delsigma",
  help: "Deletes recent messages from Apex Sigma in the channel it's used in.",
  desc: "Finds and deletes past messages from Apex Sigma in the channel it's used in. Checks up to 50 past messages.",
  args: [{
    name: "limit",
    help: "Limit to how many messages are deleted. Max 20. Defaults to 1.",
    desc: "Sets a limit for how many messages can be deleted. If fewer messages are found, all that are found are deleted. Max 20. Defaults to 1.",
    type: "number",
    req: false
  }],
  indm: false
}, async (client, msg, arg) => {
  if (msg.guild.id !== client.guild.id) return SendError.general.invalidGuild(msg)
  arg[0] ??= "1"
  if (!/^-?\d+$/.test(arg[0])) return SendError[thisFile].invalidNumber(msg, arg[0])
  const limit = parseInt(arg[0])
  if (limit > 20) return SendError[thisFile].numberTooLarge(msg)
  if (limit < 1) return SendError[thisFile].numberTooSmall(msg)
  const messages = await msg.channel.messages.fetch().then((ms) => ms.filter((m) => m.author.id === client.resolveId('sigma', 'users')).first(limit))
  if (!messages.length) return SendError[thisFile].noMessages(msg)
  await msg.channel.bulkDelete(messages, true)
  msg.channel.send(`Finished deleting ${messages.length} message${messages.length - 1 ? "s" : ""}.`)
})
