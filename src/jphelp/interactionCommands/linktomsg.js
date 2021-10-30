import { Client, ApplicationCommand } from '../../shared/structures.js'
import { cmdData } from '../../shared/config.js'

export const command = new ApplicationCommand({
  type: 'MESSAGE',
  name: "Link to Message",
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
  const exemptChannels = cmdData['nc-manage-exempt']
  if (cmd.channel.parentId !== client.resolveId('nihongo-centre', 'channels') || exemptChannels.some((id) => cmd.channelId === client.resolveId(id, 'channels')))
    return cmd.reply({ content: "This command is not available in this channel.", ephemeral: true })
  const msgLink = client.mongoose.models['nc_msglink']
  const doc = await msgLink.findById(cmd.channelId).exec() ?? await msgLink.create({ _id: cmd.channelId, name: cmd.channel.name })
  doc.firstMsg = cmd.targetId
  sendLink(cmd, doc)
})

function sendLink(cmd, doc) {
  if (doc.linkMsg) cmd.channel.messages.delete(doc.linkMsg).catch(() => null)
  cmd.reply({ content: `You may click [here](https://discord.com/channels/${cmd.guildId}/${cmd.channelId}/${doc.firstMsg}) to go to the top without scrolling.`, fetchReply: true }).then((reply) => {
    doc.linkMsg = reply.id
    doc.user = cmd.user.id
    doc.save()
  })
}
