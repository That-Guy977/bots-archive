import { Client, Command } from '../../shared/structures.js'
import { writeFile, mkdir } from 'node:fs/promises'
import fetch from 'node-fetch'
import YAML from 'yaml'
const ARCHIVE_PATH = '/Users/that_guy977/Desktop/archive'
const ARCHIVE_CHANNEL = "946307426687283231"

YAML.scalarOptions.str.fold.lineWidth = 100

export default new Command({
  name: "archive",
  description: "Creates archive of temporary channel",
  options: [
    {
      name: 'save',
      description: "Create local save (default no)",
      type: 'STRING',
      restraints: {
        choices: [
          { name: "yes", value: "yes" },
          { name: "no", value: "no" }
        ]
      }
    },
    {
      name: 'with-attachments',
      description: "Include attachments (default no)",
      type: 'STRING',
      restraints: {
        choices: [
          { name: "yes", value: "yes" },
          { name: "no", value: "no" }
        ]
      }
    }
  ],
  isGlobal: false,
  isEnabled: false,
  permissions: [
    {
      id: Client.resolveId('mod', 'role', 'jp101'),
      type: 'ROLE',
      allow: true
    }
  ]
}, async (client, cmd) => {
  const defer = cmd.deferReply()
  const save = cmd.options.get('save')?.value === "yes"
  const withAtt = cmd.options.get('with-attachments')?.value === "yes"
  if (save && cmd.user.id !== client.resolveId('main', 'user')) return cmd.reply("No.")
  const channel = client.channels.cache.get(ARCHIVE_CHANNEL)
  const messageColls = []
  let lastMsg = "0"
  while (!(messageColls[0]?.size < 100)) {
    messageColls.unshift(await channel.messages.fetch({ limit: 100, after: lastMsg }))
    lastMsg = messageColls[0].firstKey()
  }
  const messages = messageColls.flatMap((coll) => [...coll.values()]).reverse().filter((msg) => !msg.author.bot && ['DEFAULT', 'REPLY'].includes(msg.type))
  const msgIds = messageColls.flatMap((coll) => [...coll.keys()])
  const attachments = []
  const archive = Buffer.from(YAML.stringify({
    channel: {
      id: channel.id,
      name: channel.name,
      topic: channel.topic,
      messages: messages.length,
      archived: cmd.createdAt
    },
    messages: messages.map((msg) => {
      const msgData = {
        id: msg.id,
        author: `@${msg.author.tag} (${msg.author.id})`,
        at: msg.createdAt
      }
      if (msg.reference) {
        msgData.reply = msg.reference.messageId
        if (!msgIds.includes(msg.reference.messageId)) msgData.reply += " (Deleted)"
      }
      if (msg.content) msgData.content = msg.content
      if (msg.attachments.size) msgData.files = msg.attachments.map((att) => {
        attachments.push(att)
        return `${att.name} [${attachments.length.toString().padStart(3, 0)}]`
      })
      return msgData
    })
  }))
  const archiveDate = cmd.createdAt.toISOString().replace(/^(?<Y>\d+)-(?<M>\d+)-(?<D>\d+)T(?<h>\d+):(?<m>\d+):(?<s>\d+).(?:\d+)Z$/, "$<Y>$<M>$<D>-$<h>$<m>$<s>")
  if (save) {
    await writeFile(`${ARCHIVE_PATH}/${archiveDate}.yaml`, archive)
    if (withAtt) {
      const archiveDir = `${ARCHIVE_PATH}/${archiveDate}-files`
      await mkdir(archiveDir)
      await Promise.all(
        attachments.map(async (att, i) =>
          writeFile(`${archiveDir}/arch_${(i + 1).toString().padStart(3, 0)}${att.name.match(/\.\w+?$/)[0]}`, await fetch(att.url).then((res) => res.buffer())))
      )
    }
  }
  await defer
  await cmd.editReply({
    content: `Archive ${save ? "saved" : "created"} from ${messages.length} messages${withAtt ? ` with ${attachments.length} attachments` : ""}`,
    files: [{ attachment: archive, name: `archive-${archiveDate}.yaml` }]
  })
  if (withAtt && !save) {
    const attachmentArchive = attachments.map((att, i) => `[arch_${(i + 1).toString().padStart(3, 0)}${att.name.match(/\.\w+?$/)[0]}](${att.url})`)
    const attachmentSections = attachmentArchive.reduce((acc, cur) => {
      if (!acc.length || acc[acc.length - 1].length === 10) acc.push([])
      acc[acc.length - 1].push(cur)
      return acc
    }, []).map((atts, i, arr) => `(${i + 1}/${arr.length})\n${atts.join(", ")}`)
    cmd.followUp(`Attachments:\n${attachmentSections.shift()}`)
    while (attachmentSections.length) {
      cmd.followUp(attachmentSections.shift())
    }
  }
})
