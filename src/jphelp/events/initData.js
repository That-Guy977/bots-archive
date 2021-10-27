import { Event } from '../../shared/structures.js'
import { updatePremium } from '../../shared/util.js'
import { evtData } from '../../shared/config.js'
import { Collection } from 'discord.js'
import { readdir } from 'node:fs/promises'
import mongoose from 'mongoose'
const { Schema } = mongoose

export const event = new Event('ready', async (client) => {
  client.interactionCommands = new Collection()
  for (const file of await readdir('../jphelp/interactionCommands').then((files) => files.filter((f) => f.endsWith(".js")))) {
    const { command } = await import(`../interactionCommands/${file}`)
    client.interactionCommands.set(command.info.name, command)
  }
  client.state.offline = []
  for (const id of evtData['botPresence'][client.data.guild][2])
    if (await client.getMember(id).then((m) => m.presence?.status ?? 'offline') === 'offline')
      client.state.offline.push(client.resolveId(id, 'users'))
  updatePremium(client)
  client.mongoose = await mongoose.connect(
    `mongodb+srv://japanese101db.mcpc1.mongodb.net`,
    { auth: { username: `MONGO_${client.source}`, password: process.env[`MONGO_${client.source}`] }, dbName: "Japanese101DB" }
  )
  mongoose.model("nc_msglink", new Schema({
    _id: String,
    firstMsg: { type: String, default: null },
    linkMsg: { type: String, default: null },
    user: { type: String, default: null }
  }, { versionKey: false }))
})
