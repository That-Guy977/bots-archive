import { getSource } from '../shared/util.js'
import init from '../shared/init.js'
import { readFile } from 'node:fs/promises'
const { cmdData } = JSON.parse(await readFile('../shared/config.json'))
const { source } = getSource(import.meta.url)
const options = {
  intents: [
    'GUILDS',
    'GUILD_MEMBERS',
    'GUILD_PRESENCES',
    'GUILD_MESSAGES',
    'DIRECT_MESSAGES'
  ],
  partials: [
    'CHANNEL',
    'GUILD_MEMBER'
  ],
  presence: {
    activities: [{
      type: 'PLAYING',
      name: `god | ${cmdData.prefix[source]}`
    }]
  }
}

init(options, source)
