import { Event } from '../../shared/structures.js'
import mongoose from 'mongoose'

export const event = new Event('ready', (client) => {
  console.log(client.source)
  console.log(process.env[`MONGO_${client.source}`])
  // not connecting
  // const uri = `mongodb://MONGO_JPHELP:${process.env[`MONGO_${client.source}`]}@japanese101db.mcpc1.mongodb.net/Japanese101DB`
  const uri = `mongodb+srv://MONGO_JPHELP:${process.env[`MONGO_${client.source}`]}@japanese101db.mcpc1.mongodb.net/Japanese101DB?retryWrites=true&w=majority`
  mongoose.connect(uri).then(() => console.log(1))
})
