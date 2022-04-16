import { Client, Command } from '../../shared/structures.js'
import { chnArchived } from '../../shared/util.js'
import { MessageActionRow } from 'discord.js'

export default new Command({
  name: "unpinall",
  description: "Removes all pins in a channel.",
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
  const pinned = await cmd.channel.messages.fetchPinned();
  if (!pinned.size) return cmd.reply({ content: "This channel doesn't have any pins!", ephemeral: true })
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
      label: "Confirm Unpin",
      style: 'DANGER',
      disabled: true,
      customId: 'confirm'
    }
  )
  const reply = await cmd.reply({
    content: `Are you sure you want to remove all pins in ${cmd.channel}? **This action cannot be undone!**`,
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
  let unpin = Promise.resolve()
  reply.createMessageComponentCollector({
    filter,
    max: 1,
    time: 15000
  }).on('collect', async (i) => {
    clearTimeout(enable)
    switch (i.customId) {
      case 'confirm': {
        cmd.editReply({ content: "Command confirmed, unpinning messages...", components: [] })
        unpin = Promise.all(pinned.map((msg) => msg.unpin().catch(() => null)))
        await unpin
        await cmd.editReply("Finished unpinning messages.")
        break
      }
      case 'cancel': {
        cmd.editReply({ content: "Command canceled.", components: [] })
        break
      }
    }
  }).on('end', async (_coll, reason) => {
    if (reason === 'time') cmd.editReply({ content: "Command timed out.", components: [] })
    await unpin
    setTimeout(() => cmd.deleteReply().catch(() => null), 5000)
  })
})
