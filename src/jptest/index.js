const { cmdData } = require('../shared/config.json')
const source = __dirname.slice(__dirname.lastIndexOf("/") + 1)
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

require('../shared/init.js')(options, source)

/**
 * //-- to test
 * guildUpdate - lose level
 * guildMemberUpdate - boost, gain level
 */
