const { isSnowflake } = require('../shared/util.js')
const { botData, cmdData } = require('../shared/config.json')
const { Client: DiscordClient, Collection } = require('discord.js')

module.exports = class Client extends DiscordClient {
  constructor(options, source) {
    super(options)
    this.token = process.env[`TOKEN_${source.toUpperCase()}`]
    this.state = {}
    this.data = botData.data[source]
    this.color = botData.color[source]
    this.prefix = cmdData.prefix[source]
    this.commands = new Collection()
    this.events = new Collection()
  }

  login() {
    super.login(this.token)
    return this
  }

  get guild() {
    return this.getGuild(this.data.guild)
  }

  get channel() {
    return this.getChannel(this.data.channel)
  }

  getGuild(id) {
    id = this.resolveId(id, 'guilds')
    return this.guilds.cache.get(id) ?? null
  }

  getChannel(id) {
    id = this.resolveId(id, 'channels')
    return this.channels.cache.get(id) ?? null
  }

  getRole(id) {
    id = this.resolveId(id, 'roles')
    return this.guild.roles.cache.get(id) ?? null
  }

  getMember(id) {
    id = this.resolveId(id, 'users')
    return id ? this.guild.members.fetch(id).catch(() => null) : null
  }

  getColor(id) {
    id = isSnowflake(id) ? Object.entries(botData.ids.users).find(([, v]) => v === id)?.[0] : id
    return botData.color[id] ?? null
  }

  resolveId(id, type) {
    const ids = botData.ids[type]
    return isSnowflake(id) ? id : ids[id] ?? ids[this.data.guild]?.[id] ?? null
  }
}