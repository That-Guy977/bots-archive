import { Client, ApplicationCommand } from '../../shared/structures.js'
import { isSnowflake } from '../../shared/util.js'
import { cmdData } from '../../shared/config.js'

export const command = new ApplicationCommand({
  name: "linktotop",
  desc: "Provides a message linking to the start of the channel.",
  isGlobal: false,
  enabled: false,
  options: [{
    name: "id",
    desc: "Message ID to link to.",
    type: 'STRING',
    required: false
  }],
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
  if (!cmd.options.get('id')) {
    if (!doc.firstMsg || !await cmd.channel.messages.fetch(doc.firstMsg).catch(() => null)) {
      doc.firstMsg = null
      for (let i = 0; i < 5; i++) {
        const msgs = await cmd.channel.messages.fetch({ limit: 100, before: doc.firstMsg })
        doc.firstMsg = msgs.lastKey()
        if (msgs.size < 100) break
        if (i === 4) {
          doc.firstMsg = null
          doc.save()
          return cmd.reply({ content: "More than 500 messages found, please provide a message ID manually with `/linktotop id:MSG_ID` or use the Context Menu command.", ephemeral: true })
        }
      }
    }
    sendLink(cmd, doc)
  } else {
    const id = cmd.options.get('id').value
    if (!isSnowflake(id)) return cmd.reply({ content: `\`${id}\` is not a valid ID.`, ephemeral: true })
    if (!await cmd.channel.messages.fetch(id).catch(() => null)) return cmd.reply({ content: `Message of ID \`${id}\` not found.`, ephemeral: true })
    doc.firstMsg = id
    sendLink(cmd, doc)
  }
})

function sendLink(cmd, doc) {
  if (doc.linkMsg) cmd.channel.messages.delete(doc.linkMsg).catch(() => null)
  cmd.reply({ content: `You may click [here](https://discord.com/channels/${cmd.guildId}/${cmd.channelId}/${doc.firstMsg}) to go to the top without scrolling.`, fetchReply: true }).then((reply) => {
    doc.linkMsg = reply.id
    doc.user = cmd.user.id
    doc.save()
  })
}
