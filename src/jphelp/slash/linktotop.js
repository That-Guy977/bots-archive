import { Client, Slash } from '../../shared/structures.js'
import { cmdData } from '../../shared/config.js'

export const command = new Slash({
  name: "linktotop",
  desc: "Provides a message linking to the start of the channel.",
  isGlobal: false,
  enabled: false,
  permissions: [
    {
      id: Client.resolveId("mod", "roles", "jp101"),
      type: "ROLE",
      allow: true
    },
    {
      id: Client.resolveId("contributor", "roles", "jp101"),
      type: "ROLE",
      allow: true
    }
  ],
  test: true
}, async (client, cmd) => {
  const exemptChannels = cmdData['nc-manage-exempt']
  if (cmd.channel.parentId !== client.resolveId("nihongo-centre", "channels") || exemptChannels.some((id) => cmd.channelId === client.resolveId(id, "channels")))
    // return cmd.reply({ content: "This command is not available in this channel.", ephemeral: true })
    ; //-- revert to filter after testing
  const msgLink = client.mongoose.models["nc_msglink"]
  const doc = await msgLink.findById(cmd.channelId).exec() ?? await msgLink.create({ _id: cmd.channelId })
  if (!doc.firstMsg || !await cmd.channel.messages.fetch(doc.firstMsg).catch(() => null)) {
    let firstMsg
    for (let i = 0; i < 5; i++) {
      const msgs = await cmd.channel.messages.fetch({ limit: 100, before: firstMsg })
      firstMsg = msgs.lastKey()
      if (msgs.size < 100) break
      if (i === 4) return recieveFirstMsg(cmd)
    }
    await msgLink.findByIdAndUpdate(cmd.channelId, { $set: { firstMsg } }).exec()
  }
  cmd.reply({ content: "Logged", ephemeral: true })
})

function recieveFirstMsg(cmd) {
  cmd.reply({ content: "More than 500 messages found, please provide a message ID manually.", ephemeral: true })
  // add collector logic for message id
}

// add function to remove old message, send new message, overwrite database (user, linkMsg)
