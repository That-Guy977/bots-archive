import { Client } from '../shared/structures.js'
import { readdir } from 'node:fs/promises'
import { basename } from 'node:path'
import { config } from 'dotenv'

config({ path: '../../.env' })

export default async function init(options, source) {
  const client = new Client(options, source).login()
  const folders = ['commands', 'events'].map((strc) => [`shared/${strc}`, `${source}/${strc}`]).flat()
  await Promise.all(folders.map(async (folder) => {
    const files = await readdir(`../${folder}`).then((fs) => fs.filter((f) => f.endsWith(".js")))
    await Promise.all(files.map(async (file) => {
      const data = await import(`../${folder}/${file}`)
      if (folder.endsWith('commands')) client.commands.set(data.command.info.name, data.command)
      else if (folder.endsWith('events')) client.events.set(basename(file, ".js"), data.event)
    }))
  }))
  for (const [, event] of client.events)
    client.on(event.name, (...params) => event.run(client, ...params))
}
