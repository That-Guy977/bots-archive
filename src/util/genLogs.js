import strCapitalize from './strCapitalize.js'

export default async function genLogs(client, {
  channelId,
  info = { note: "Test" },
  logChannel = client.channel,
  match = []
}) {
  const dynoOnline = await client.getMember('dyno').then((m) => m.presence?.status ?? 'offline') !== 'offline'
  info.logs ??= dynoOnline ? "Pending..." : "N/A - Dyno offline"
  const msg = await client.getChannel(logChannel).send(
    `\`\`\`\n${Object.entries(info).map(
      ([field, value]) => `${strCapitalize(field).padEnd(8)}: ${value}`
    ).join("\n")}\n\`\`\``
  )
  if (!dynoOnline) return
  const channel = client.getChannel(channelId)
  const filter = (m) => match.every((str) => m.embeds[0]?.description?.includes(str))
  const coll = channel.createMessageCollector({
    filter,
    max: 1,
    time: 30000
  }).on('collect', (m) => updateLogs(msg, m.id))
  .on('end', (_coll, reason) => {
    if (reason === 'time') updateLogs(msg, "N/A - Logs not found")
  })
  channel.messages.fetch().then((ms) => {
    const m = ms.filter(filter).first()
    if (!m) return
    coll.stop()
    updateLogs(msg, m.id)
  })
}

function updateLogs(msg, val) {
  msg.edit(msg.content.replace(/^(?<header>Logs +): .+/m, `$<header>: ${val}`))
}
