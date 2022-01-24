import { isSnowflake } from '../shared/util.js'
import { readFile } from 'node:fs/promises'
import { Client as DiscordClient, Collection } from 'discord.js'
const data = JSON.parse(await readFile('shared/data.json'))

export default class Client extends DiscordClient {
  constructor(options, source) {
    super(options)
    this.source = source
    this.token = process.env[`TOKEN_${source.toUpperCase()}`]
    this.main = data.main[source]
  }

  state = {}
  commands = new Collection()
  events = new Collection()

  get guild() {
    return this.getGuild(this.main.guild)
  }

  get channel() {
    return this.getChannel(this.main.channel)
  }

  login() {
    super.login()
    return this
  }

  getGuild(id) {
    return this.guilds.cache.get(this.resolveId(id, 'guild')) ?? null
  }

  getChannel(id) {
    return this.channels.cache.get(this.resolveId(id, 'channel')) ?? null
  }

  getRole(id) {
    return this.guild.roles.cache.get(this.resolveId(id, 'role')) ?? null
  }

  getMember(id) {
    id = this.resolveId(id, 'user')
    return id && this.guild.members.fetch(id).catch(() => null)
  }

  getEmoji(id) {
    return this.guild.emojis.cache.get(this.resolveId(id, 'emoji')) ?? null
  }

  getColor(id) {
    return data.color[isSnowflake(id) ? Object.entries(data.ids.users).find(([, v]) => v === id)?.[0] : id] ?? null
  }

  resolveId(id, type) {
    return Client.resolveId(id, type, this.main.guild)
  }

  static resolveId(id, type, guild) {
    const ids = data.ids[`${type}s`]
    return isSnowflake(id) ? id : ids[id] ?? ids[guild]?.[id] ?? null
  }
}
