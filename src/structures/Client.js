import { isSnowflake } from '../shared/util.js'
import { readFile } from 'node:fs/promises'
import { Client as DiscordClient, Collection } from 'discord.js'
const config = JSON.parse(await readFile('../shared/config.json'))

export default class Client extends DiscordClient {
  constructor(options, source) {
    super(options)
    this.source = source
    this.token = process.env[`TOKEN_${source.toUpperCase()}`]
    this.main = config.main[source]
    this.color = config.color[source]
  }

  state = {}
  commands = new Collection()
  events = new Collection()

  get guild() { return this.getGuild(this.main.guild) }
  get channel() { return this.getChannel(this.main.channel) }

  login() {
    super.login()
    return this
  }

  getGuild(id) {
    id = this.resolveId(id, 'guild')
    return this.guilds.cache.get(id) ?? null
  }

  getChannel(id) {
    id = this.resolveId(id, 'channel')
    return this.channels.cache.get(id) ?? null
  }

  getRole(id) {
    id = this.resolveId(id, 'role')
    return this.guild.roles.cache.get(id) ?? null
  }

  getMember(id) {
    id = this.resolveId(id, 'user')
    return id ? this.guild.members.fetch(id).catch(() => null) : null
  }

  getColor(id) {
    id = isSnowflake(id) ? Object.entries(config.ids.users).find(([, v]) => v === id)?.[0] : id
    return config.color[id] ?? null
  }

  resolveId(id, type) {
    return Client.resolveId(id, type, this.main.guild)
  }

  static resolveId(id, type, guild) {
    const ids = config.ids[`${type}s`]
    return isSnowflake(id) ? id : ids[id] ?? ids[guild]?.[id] ?? null
  }
}
