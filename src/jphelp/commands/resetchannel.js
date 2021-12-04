import { Client, Command } from '../../shared/structures.js'
import { chnArchived, genLogs } from '../../shared/util.js'
import { MessageActionRow } from 'discord.js'

export default new Command({
  name: "resetchannel",
  description: "Resets a channel to make space to remake content.",
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
  if (!chnArchived(cmd.channel))
    return cmd.reply({ content: "This command is not available in this channel.", ephemeral: true })
  if (!await cmd.channel.messages.fetch({ limit: 1 }).then((coll) => coll.size)) return cmd.reply({ content: "This channel doesn't have any messages!", ephemeral: true })
  const actionRow = new MessageActionRow()
  .addComponents(
    {
      type: 'BUTTON',
      label: "Cancel",
      style: 'SECONDARY',
      customId: 'cancel'
    },
    {
      type: 'BUTTON',
      label: "Confirm Reset",
      style: 'DANGER',
      disabled: true,
      customId: 'confirm'
    }
  )
  const reply = await cmd.reply({
    content: `Are you sure you want to reset ${cmd.channel}? **This action cannot be undone!**`,
    components: [actionRow],
    fetchReply: true
  })
  const enable = setTimeout(() => {
    actionRow.components[1].setDisabled(false)
    cmd.editReply({ components: [actionRow] })
  }, 5000)
  const filter = (i) => {
    switch (i.customId) {
      case 'confirm': {
        if (i.user.id === cmd.user.id) return true
        i.reply({ content: "You cannot confirm someone else's command.", ephemeral: true })
        return false
      }
      case 'cancel': {
        if (i.user.id === cmd.user.id || i.member.roles.hasAny([client.resolveId('mod', 'role'), client.resolveId('contributor', 'role')])) return true
        i.reply({ content: "You don't have permission to do this.", ephemeral: true })
        return false
      }
    }
  }
  reply.createMessageComponentCollector({
    filter,
    max: 1,
    time: 15000
  }).on('collect', async (i) => {
    clearTimeout(enable)
    switch (i.customId) {
      case 'confirm': {
        const reason = "ResetChannel"
        await cmd.editReply({ content: "Command confirmed, resetting channel...", components: [] })
        const channel = await cmd.channel.clone({ reason })
        await cmd.channel.delete(reason)
        genLogs(client, 'mod-logs', {
          action: "Clone Channel, Delete Channel",
          channel: `#${channel.name} (${cmd.channelId}, ${channel.id})`,
          executor: `@${cmd.user.tag} (${cmd.user.id})`,
          reason: "ResetChannel"
        }, [
          { name: "Clone Channel", match: [channel.name, "Channel Created"] },
          { name: "Delete Channel", match: [channel.name, "Channel Deleted"] }
        ])
        break
      }
      case 'cancel': {
        cmd.editReply({ content: "Command canceled.", components: [] })
        break
      }
    }
  }).on('end', (_coll, reason) => {
    if (reason === 'time') cmd.editReply({ content: "Command timed out.", components: [] })
    setTimeout(() => cmd.deleteReply().catch(() => null), 5000)
  })
})
