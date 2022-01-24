import { getSource } from '../shared/util.js'
import init from '../shared/init.js'
const { source } = getSource(import.meta.url)
const options = {
  intents: [
    'GUILDS',
    'GUILD_MEMBERS',
    'GUILD_EMOJIS_AND_STICKERS',
    'GUILD_PRESENCES',
    'GUILD_MESSAGES'
  ],
  partials: [
    'GUILD_MEMBER',
    'MESSAGE'
  ],
  restRequestTimeout: 30000,
  retryLimit: 5
}

init(options, source)
