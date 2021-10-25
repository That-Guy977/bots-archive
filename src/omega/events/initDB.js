import { Event } from '../../shared/structures.js'
import mongoose from 'mongoose'

export const event = new Event('ready', () => {
  const uri = `mongodb+srv://japanese101db.mcpc1.mongodb.net`
  mongoose.connect(uri, { auth: { username: `MONGO_JPHELP`, password: process.env[`MONGO_JPHELP`] }, dbName: "Japanese101DB" }).then(console.log)
})
