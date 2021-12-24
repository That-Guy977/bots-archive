import strCapitalize from './strCapitalize.js'
import getSource from './getSource.js'
import { readFile } from 'node:fs/promises'
const { config } = JSON.parse(await readFile('shared/data.json'))
const { thisFile } = getSource(import.meta.url)

export default async function genLogs(client, channelId, info, logInfo = []) {
  const dynoOnline = await client.getMember('dyno').then((m) => m.presence?.status ?? 'offline') !== 'offline'
  if (logInfo.length) info.logs ??= dynoOnline ? "Pending..." : "N/A - Dyno offline"
  const msg = await client.getChannel(config[thisFile][client.source])?.send(
    `\`\`\`\n${Object.entries(info).map(
      ([field, value]) => `${strCapitalize(field).padEnd(8)}: ${value}`
    ).join("\n")}\n\`\`\``
  ).catch(() => null)
  if (!msg || !dynoOnline || !logInfo.length) return
  const channel = client.getChannel(channelId)
  const logData = []
  const logCheck = (m) => logInfo.findIndex(({ match }) => match.every((str) => m.embeds[0]?.description?.includes(str)))
  const filter = (m) => logCheck(m) !== -1
  const coll = channel.createMessageCollector({
    filter,
    max: logInfo.length,
    time: 30000
  }).on('collect', (m) => {
    logInfo.splice(logCheck(m), 1)
    logData.push(m.id)
    if (!logInfo.length) coll.stop()
  }).on('end', () => {
    msg.edit(msg.content.replace(/^(?<header>Logs +): (?:Pending\.\.\.)?.*/m, `$<header>: ${
      logData.length ? logData.concat(logInfo.map((log) => `${log.name} logs not found`)).join(", ") : "N/A - Logs not found"
    }`))
  })
  channel.messages.fetch({ limit: 10 }).then((ms) => {
    for (const [, m] of ms) {
      if (!filter(m)) continue
      logData.push(m.id)
      logInfo.splice(logCheck(m), 1)
      if (!logInfo.length) {
        coll.stop()
        break
      }
    }
  })
}
