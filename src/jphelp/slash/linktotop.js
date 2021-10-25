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
}, (client, cmd) => {
  const exemptChannels = cmdData['nc-manage-exempt']
  if (cmd.channel.parentId !== client.resolveId("nihongo-centre", "channels") || exemptChannels.some((id) => cmd.channelId === client.resolveId(id, "channels")))
    return cmd.reply({ content: "This command is not available in this channel.", ephemeral: true })
  cmd.reply({ content: "Add response", ephemeral: true })
})
