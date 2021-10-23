import { getSource } from '../shared/util.js'
import { botData } from '../shared/config.js'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { readdir } from 'node:fs/promises'
import { config } from 'dotenv'
const { source } = getSource(import.meta.url)

config({ path: '../../.env' })

const rest = new REST({ version: '9' }).setToken(process.env[`TOKEN_${source.toUpperCase()}`])
const commands = {
  global: [],
  guild: []
}

for (const file of await readdir(`../jphelp/slash`).then((files) => files.filter((f) => f.endsWith(".js")))) {
  const { command } = await import(`../jphelp/slash/${file}`)
  commands[command.info.isGlobal ? "global" : "guild"].push(command.structure)
}

if (commands.global.length)
  rest.put(
    Routes.applicationCommands(botData.ids.users[source]),
    { body: commands.global }
  )

if (commands.guild.length)
  rest.put(
    Routes.applicationGuildCommands(botData.ids.users[source], botData.ids.guilds['jp101']),
    { body: commands.guild }
  )