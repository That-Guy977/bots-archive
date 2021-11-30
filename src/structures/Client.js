import { isSnowflake } from '../shared/util.js'
import { readFile } from 'node:fs/promises'
import { Client as DiscordClient, Collection } from 'discord.js'
const { botData } = JSON.parse(await readFile('../shared/config.json'))

export default class Client extends DiscordClient {
  constructor(options, source) {
    super(options)
    this.source = source
    this.token = process.env[`TOKEN_${source.toUpperCase()}`]
    this.data = botData.data[source]
    this.color = botData.color[source]
  }

  state = {}
  commands = new Collection()
  events = new Collection()

  get guild() { return this.getGuild(this.data.guild) }
  get channel() { return this.getChannel(this.data.channel) }

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
    id = isSnowflake(id) ? Object.entries(botData.ids.users).find(([, v]) => v === id)?.[0] : id
    return botData.color[id] ?? null
  }

  resolveId(id, type) {
    const ids = botData.ids[`${type}s`]
    return isSnowflake(id) ? id : ids[id] ?? ids[this.data.guild]?.[id] ?? null
  }

  static resolveId(id, type, guild) {
    const ids = botData.ids[`${type}s`]
    return isSnowflake(id) ? id : ids[id] ?? ids[guild]?.[id] ?? null
  }
}
