import { Event } from '../../shared/structures.js'
import { isSnowflake, isIdData, updatePremium } from '../../shared/util.js'
import { readFile } from 'node:fs/promises'
import mongoose from 'mongoose'
const { evtData } = JSON.parse(await readFile('../shared/config.json'))
const { Schema } = mongoose

export const event = new Event('ready', (client) => {
  client.state.offline = []
  evtData['botPresence'][client.source].forEach(async (id) => {
    if (await client.getMember(id).then((m) => m.presence?.status ?? 'offline') === 'offline')
      client.state.offline.push(client.resolveId(id, 'user'))
  })
  updatePremium(client)
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
})
