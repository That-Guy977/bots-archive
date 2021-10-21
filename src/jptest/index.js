import { cmdData } from '../shared/config.js'
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
  ],
  presence: {
    activities: [{
      type: 'PLAYING',
      name: `${cmdData.prefix[source]}help`
    }]
  },
  restRequestTimeout: 60000,
  retryLimit: 10
}

init(options, source)

/**
 * //-- to test
 * guildUpdate - lose level
 * guildMemberUpdate - boost, gain level
 */
