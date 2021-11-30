import { Client, Command } from '../../shared/structures.js'
import { chnArchived } from '../../shared/util.js'

export default new Command({
  name: "linktotop",
  desc: "Provides a message linking to the start of the channel.",
  isGlobal: false,
  isEnabled: false,
  permissions: [
    {
      id: Client.resolveId('mod', 'role', 'jp101'),
      type: 'ROLE',
      allow: true
    },
    {
      id: Client.resolveId('contributor', 'role', 'jp101'),
      type: 'ROLE',
      allow: true
    }
  ]
}, async (client, cmd) => {
  if (!chnArchived(cmd.channel)) return cmd.reply({ content: "This command is not available in this channel.", ephemeral: true })
  const msgLink = client.mongoose.models['nc_msglink']
  const doc = await msgLink.findById(cmd.channelId).exec() ?? await msgLink.create({ _id: cmd.channelId, name: cmd.channel.name })
  const prevMsg = doc.linkMsg
  doc.firstMsg = await cmd.channel.messages.fetch({ limit: 1, after: "0" }).then((coll) => coll.firstKey())
  if (!doc.firstMsg) return cmd.reply({ content: "This channel doesn't have any messages!", ephemeral: true })
  const reply = await cmd.reply({
    content: `Check the pinned messages to view chapters, or click [here](https://discord.com/channels/${cmd.guildId}/${cmd.channelId}/${doc.firstMsg}) to jump to the top.`,
    fetchReply: true
  })
  doc.linkMsg = reply.id
  doc.user = cmd.user.id
  await doc.save()
  cmd.channel.messages.delete(prevMsg).catch(() => null)
})
