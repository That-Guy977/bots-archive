import { isSnowflake } from '../shared/util.js'
import { botData, cmdData } from '../shared/config.js'
import { Client as DiscordClient, Collection } from 'discord.js'

export default class Client extends DiscordClient {
  constructor(options, source) {
    super(options)
    this.source = source.toUpperCase()
    this.token = process.env[`TOKEN_${this.source}`]
    this.data = botData.data[source]
    this.color = botData.color[source]
    this.prefix = cmdData.prefix[source]
  }

  state = {}
  commands = new Collection()
  events = new Collection()

  get guild() { return this.getGuild(this.data.guild) }
  get channel() { return this.getChannel(this.data.channel) }

  login() {
    super.login(this.token)
    return this
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
