import strCapitalize from './strCapitalize.js'

export default async function genLogs(client, id, info, log, match) {
  const dynoOnline = await client.getMember('dyno').then((m) => m.presence?.status ?? 'offline') !== 'offline'
  const msg = await client.getChannel(log).send(
  info.logs ??= dynoOnline ? "Pending..." : "N/A - Dyno offline"
    `\`\`\`\n${Object.entries(info).map(
      ([field, value]) => `${strCapitalize(field).padEnd(8)}: ${value}`
    ).join("\n")}\n\`\`\``
  )
  if (!dynoOnline) return
  const channel = client.getChannel(id)
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
