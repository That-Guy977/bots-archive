import { Event } from '../../shared/structures.js'
import { isSnowflake, updatePremium } from '../../shared/util.js'
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
    _id: { type: String, validate: isSnowflake, required: true },
    name: { type: String, match: /^[a-z-]$/, required: true },
    firstMsg: { type: String, validate: isSnowflake, default: null },
    linkMsg: { type: String, validate: isSnowflake, default: null },
    user: { type: String, validate: isSnowflake, default: null }
  }, { versionKey: false }))
  mongoose.model("nc_message", new Schema({
    _id: { type: String, validate: isSnowflake, required: true },
    name: { type: String, match: /^[a-z-]$/, required: true },
    messages: {
      type: [{
        id: { type: String, validate: isSnowflake, required: true },
        content: { type: String, required: true },
        attachments: { type: [Buffer], required: true },
        author: { type: String, validate: isSnowflake, required: true },
        createdTimestamp: { type: Number, required: true },
        deleted: { type: Boolean, default: false },
        deletedTimestamp: { type: Number, default: null }
      }],
      required: true
    }
  }, { versionKey: false }))
})
