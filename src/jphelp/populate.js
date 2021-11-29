import { Client } from '../shared/structures.js'
import { isSnowflake, isIdData, getSource, chnArchived } from '../shared/util.js'
import mongoose from 'mongoose'
import fetch from 'node-fetch'
import { config } from 'dotenv'
const { Schema } = mongoose
const { source } = getSource(import.meta.url)
config({ path: '../../.env' })

const client = new Client({ intents: [
  'GUILDS',
  'GUILD_MESSAGES'
] }, source).login()
client.on('ready', () => console.log(`Logged into Discord as ${client.user.tag}`))
const dbUsername = `MONGO_${client.source.toUpperCase()}`
const connect = mongoose.connect(`mongodb+srv://${dbUsername}:${process.env[dbUsername]}@${process.env['MONGO_DATABASE']}.${process.env['MONGO_ID']}.mongodb.net/${process.env['MONGO_DATABASE']}`)
mongoose.connection.once('connected', () => console.log(`Logged into MongoDB as ${dbUsername}`))
mongoose.model('nc_message', new Schema({
  _id: { type: String, validate: isSnowflake },
  name: { type: String, match: /^[a-z\d-]+$/ },
  messages: {
    type: [{
      _id: { type: String, validate: isSnowflake },
      content: { type: String, default: "" },
      attachments: {
        type: [{
          _id: { type: String, validate: isSnowflake },
          file: { type: Buffer },
          name: { type: String },
          url: { type: String }
        }]
      },
      author: { type: String, validate: isSnowflake },
      createdTimestamp: { type: Number },
      deleted: { type: Boolean, default: false },
      deletedTimestamp: { type: Number, default: null },
      edits: {
        type: [{
          _id: { type: Number },
          content: { type: String },
          attachments: {
            type: [{
              _id: { type: String, validate: isSnowflake },
              file: { type: Buffer },
              name: { type: String },
              url: { type: String }
            }]
          }
        }],
        default: []
      }
    }],
    default: []
  },
  createdTimestamp: { type: Number },
  deleted: { type: Boolean, default: false },
  deletedTimestamp: { type: Number, default: null }
}, { versionKey: false }))
mongoose.model('nc_msglink', new Schema({
  _id: { type: String, validate: isSnowflake },
  name: { type: String, match: /^[a-z\d-]+$/ },
  firstMsg: { type: String, validate: isIdData, default: null },
  linkMsg: { type: String, validate: isIdData, default: null },
  user: { type: String, validate: isIdData, default: null }
}, { versionKey: false }))

client.on('ready', async () => {
  await connect
  const archive = mongoose.models['nc_message']
  const channels = client.guild.channels.cache.filter(chnArchived)
  let i = 0
  for (const [, channel] of channels) {
    const doc = await archive.create({ _id: channel.id, name: channel.name, createdTimestamp: channel.createdTimestamp })
    const messageColls = []
    let lastMsg = "0"
    while (!(messageColls[0]?.size < 100)) {
      messageColls.unshift(await channel.messages.fetch({ limit: 100, after: lastMsg }))
      lastMsg = messageColls[0].firstKey()
    }
    const messages = messageColls.flatMap((coll) => [...coll.values()]).reverse().filter((msg) => !msg.author.bot && msg.type === 'DEFAULT')
    for (const message of messages) {
      doc.messages.unshift({
        _id: message.id,
        content: message.content,
        attachments: await Promise.all(message.attachments.map(async (attachment) => ({
          _id: attachment.id,
          file: await fetch(attachment.url).then((res) => res.buffer()),
          name: attachment.name,
          url: attachment.url
        }))),
        author: message.author.id,
        createdTimestamp: message.createdTimestamp
      })
    }
    await doc.save()
    console.log(`Saved ${messages.length.toString().padStart(3)} messages from #${channel.name.padEnd(20)} (${(++i).toString().padStart(2)}/${channels.size})`)
  }
  process.exit()
})
