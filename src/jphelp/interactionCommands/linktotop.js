import { Client, ApplicationCommand } from '../../shared/structures.js'
import { chnArchived } from '../../shared/util.js'

export const command = new ApplicationCommand({
  name: "linktotop",
  desc: "Provides a message linking to the start of the channel.",
  isGlobal: false,
  enabled: false,
  permissions: [
    {
      id: Client.resolveId('mod', 'roles', 'jp101'),
      type: 'ROLE',
      allow: true
    },
    {
      id: Client.resolveId('contributor', 'roles', 'jp101'),
      type: 'ROLE',
      allow: true
    }
  ]
}, async (client, cmd) => {
  if (!chnArchived(cmd.channel) && cmd.channelId !== "907295100361654273") return cmd.reply({ content: "This command is not available in this channel.", ephemeral: true })
  const msgLink = client.mongoose.models['nc_msglink']
  const doc = await msgLink.findById(cmd.channelId).exec() ?? await msgLink.create({ _id: cmd.channelId, name: cmd.channel.name })
  doc.firstMsg = await cmd.channel.messages.fetch({ limit: 1, after: "0" }).then((coll) => coll.firstKey())
  if (!doc.firstMsg) return cmd.reply({ content: "This channel doesn't have any messages!", ephemeral: true })
  cmd.channel.messages.delete(doc.linkMsg).catch(() => null)
  const reply = await cmd.reply({ content: `You may click [here](https://discord.com/channels/${cmd.guildId}/${cmd.channelId}/${doc.firstMsg}) to go to the top without scrolling.`, fetchReply: true })
  doc.linkMsg = reply.id
  doc.user = cmd.user.id
  doc.save()
})
