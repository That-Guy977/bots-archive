import { Event } from '../../shared/structures.js'
import mongoose from 'mongoose'

export const event = new Event('ready', () => {
  // not connecting
  mongoose.connect(/* ??? */)
})
