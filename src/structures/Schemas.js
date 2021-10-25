import mongoose from 'mongoose'
const { Schema } = mongoose

export default {
  nc_firstmsg: new Schema({
    channel: { type: String, required: true, unique: true },
    firstMsg: String,
    linkMsg: String
  })
}
