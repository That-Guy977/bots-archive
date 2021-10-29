import { Event } from '../../shared/structures.js'
import { isSnowflake, updatePremium } from '../../shared/util.js'
import { evtData } from '../../shared/config.js'
import { Collection } from 'discord.js'
import { readdir } from 'node:fs/promises'
import mongoose from 'mongoose'
const { Schema } = mongoose

export const event = new Event('ready', async (client) => {
  client.interactionCommands = new Collection()
  const files = await readdir('../jphelp/interactionCommands').then((fs) => fs.filter((f) => f.endsWith(".js")))
  await Promise.all(files.map(async (file) => {
    const { command } = await import(`../interactionCommands/${file}`)
    client.interactionCommands.set(command.info.name, command)
  }))
  client.state.offline = []
  evtData['botPresence'][client.data.guild][2].map(async (id) => {
    if (await client.getMember(id).then((m) => m.presence?.status ?? 'offline') === 'offline')
      client.state.offline.push(client.resolveId(id, 'users'))
  })
  updatePremium(client)
  client.mongoose = await mongoose.connect(
    `mongodb+srv://japanese101db.mcpc1.mongodb.net`,
    { auth: { username: `MONGO_${client.source}`, password: process.env[`MONGO_${client.source}`] }, dbName: "Japanese101DB" }
  )
  console.log(`Logged into MongoDB as MONGO_${client.source}`)
  mongoose.model('nc_msglink', new Schema({
    _id: { type: String, validate: isSnowflake, required: true },
    name: { type: String, match: /^[a-z\d-]+$/, required: true },
    firstMsg: { type: String, validate: isSnowflake },
    linkMsg: { type: String, validate: isSnowflake },
    user: { type: String, validate: isSnowflake }
  }, { versionKey: false }))
  mongoose.model('nc_message', new Schema({
    _id: { type: String, validate: isSnowflake, required: true },
    name: { type: String, match: /^[a-z\d-]+$/, required: true },
    messages: {
      type: [{
        _id: { type: String, validate: isSnowflake, required: true },
        content: { type: String, default: "" },
        attachments: {
          type: [{
            file: { type: Buffer, required: true },
            name: { type: String, required: true },
            url: { type: String, required: true }
          }],
          default: []
        },
        author: { type: String, validate: isSnowflake, required: true },
        createdTimestamp: { type: Number, required: true },
        deleted: { type: Boolean, default: false },
        deletedTimestamp: { type: Number, default: null }
      }],
      default: []
    },
    createdTimestamp: { type: Number, required: true },
    deleted: { type: Boolean, default: false },
    deletedTimestamp: { type: Number, default: null }
  }, { versionKey: false }))
})
