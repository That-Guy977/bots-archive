import { getSource } from '../shared/util.js'
import init from '../shared/init.js'
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
  ]
}

init(options, source)
