const { Client } = require('../shared/structures.js')
const fs = require('node:fs/promises')
const path = require('node:path')
require('dotenv').config({ path: '../../.env' })

async function init(options, source) {
  const client = new Client(options, source).login()
  for (const folder of ['commands', 'events'].map((strc) => [`shared/${strc}`, `${source}/${strc}`]).flat()) {
    for (const file of await fs.readdir(`../${folder}`).then((files) => files.filter((f) => f.endsWith(".js")))) {
      const data = require(`../${folder}/${file}`)
      if (folder.endsWith('commands')) client.commands.set(data.info.name, data)
      else if (folder.endsWith('events')) client.events.set(path.basename(file, ".js"), data)
    }
  }
  for (const [, event] of client.events)
    client.on(event.name, (...params) => event.run(client, ...params))
}

module.exports = init
