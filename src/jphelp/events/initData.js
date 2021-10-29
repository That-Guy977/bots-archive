import { Event } from '../../shared/structures.js'
import { isSnowflake, updatePremium } from '../../shared/util.js'
import { evtData } from '../../shared/config.js'
import { Collection } from 'discord.js'
import { readdir } from 'node:fs/promises'
import mongoose from 'mongoose'
const { Schema } = mongoose

export const event = new Event('ready', (client) => {
  client.interactionCommands = new Collection()
  readdir('../jphelp/interactionCommands').then((fs) => fs.filter((f) => f.endsWith(".js"))).then((files) => {
    files.forEach(async (file) => {
      const { command } = await import(`../interactionCommands/${file}`)
      client.interactionCommands.set(command.info.name, command)
    })
  })
  client.state.offline = []
  evtData['botPresence'][client.data.guild][2].forEach(async (id) => {
    if (await client.getMember(id).then((m) => m.presence?.status ?? 'offline') === 'offline')
      client.state.offline.push(client.resolveId(id, 'users'))
  })
  updatePremium(client)
  mongoose.connection.once('connected', () => console.log(`Logged into MongoDB as MONGO_${client.source}`))
  mongoose.connect(
    `mongodb+srv://japanese101db.mcpc1.mongodb.net`,
    { user: `MONGO_${client.source}`, pass: process.env[`MONGO_${client.source}`], dbName: "Japanese101DB" }
  ).then((connection) => { client.mongoose = connection })
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
            _id: { type: String, validate: isSnowflake, required: true },
            file: { type: Buffer, required: true },
            name: { type: String, required: true },
            url: { type: String, required: true }
          }],
          default: []
        },
        author: { type: String, validate: isSnowflake, required: true },
        createdTimestamp: { type: Number, required: true },
        deleted: { type: Boolean, default: false },
        deletedTimestamp: { type: Number, default: null },
        edits: {
          type: [{
            _id: { type: Number, required: true },
            content: { type: String, required: true },
            attachments: {
              type: [{
                _id: { type: String, validate: isSnowflake, required: true },
                file: { type: Buffer, required: true },
                name: { type: String, required: true },
                url: { type: String, required: true }
              }],
              required: true
            }
          }],
          default: []
        }
      }],
      default: []
    },
    createdTimestamp: { type: Number, required: true },
    deleted: { type: Boolean, default: false },
    deletedTimestamp: { type: Number, default: null }
  }, { versionKey: false }))
})
