import { Client } from '../shared/structures.js'
import { readdir } from 'node:fs/promises'
import { basename } from 'node:path'
import mongoose from 'mongoose'
import { config } from 'dotenv'

config({ path: '../../.env' })

export default async function init(options, source) {
  const client = new Client(options, source).login()
  const folders = ['commands', 'events'].map((strc) => [`shared/${strc}`, `${source}/${strc}`]).flat()
  await Promise.all(folders.map(async (folder) => {
    const files = await readdir(`../${folder}`).then((fs) => fs.filter((f) => f.endsWith(".js"))).catch(() => [])
    await Promise.all(files.map(async (file) => {
      const { default: structure } = await import(`../${folder}/${file}`)
      if (folder.endsWith('commands')) client.commands.set(structure.info.name, structure)
      else if (folder.endsWith('events')) client.events.set(basename(file, ".js"), structure)
    }))
  }))
  for (const [, event] of client.events)
    client.on(event.name, (...params) => event.run(client, ...params))
  if (process.env[`MONGO_${source.toUpperCase()}`]) {
    const mongoUsername = `MONGO_${client.source.toUpperCase()}`
    mongoose.connection.once('connected', () => console.log(`Logged into MongoDB as ${mongoUsername}`))
    mongoose.connect(
      `mongodb+srv://${mongoUsername}:${process.env[mongoUsername]}@${process.env['MONGO_HOST']}/${process.env['MONGO_DATABASE']}`
    ).then((connection) => { client.mongoose = connection })
  }
}
