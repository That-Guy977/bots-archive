import { getSource } from '../shared/util.js'
import init from '../shared/init.js'
const { source } = getSource(import.meta.url)
const options = {
  intents: [
    'GUILDS'
  ]
}

init(options, source)
