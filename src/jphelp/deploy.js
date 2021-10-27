import { getSource } from '../shared/util.js'
import { botData } from '../shared/config.js'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { readdir } from 'node:fs/promises'
import { config } from 'dotenv'
const { source } = getSource(import.meta.url)

config({ path: '../../.env' })

const rest = new REST({ version: '9' }).setToken(process.env[`TOKEN_${source.toUpperCase()}`])
const data = {
  globalCommands: [],
  guildCommands: [],
  guildCommandPermissions: []
}

for (const file of await readdir(`../jphelp/interactionCommands`).then((files) => files.filter((f) => f.endsWith(".js")))) {
  const { command } = await import(`../jphelp/interactionCommands/${file}`)
  data[command.info.isGlobal ? "globalCommands" : "guildCommands"].push(command.structure)
  if (command.permissions) data.guildCommandPermissions.push({ name: command.info.name, permissions: command.permissions })
}

if (data.globalCommands.length)
  await rest.put(
    Routes.applicationCommands(botData.ids.users[source]),
    { body: data.globalCommands }
  )

if (data.guildCommands.length)
  await rest.put(
    Routes.applicationGuildCommands(botData.ids.users[source], botData.ids.guilds['jp101']),
    { body: data.guildCommands }
  )

const commands = await rest.get(
  Routes.applicationGuildCommands(botData.ids.users[source], botData.ids.guilds['jp101'])
).then((cmds) => Object.fromEntries(cmds.map((cmd) => [cmd.name, cmd.id])))

if (data.guildCommandPermissions.length)
  await rest.put(
    Routes.guildApplicationCommandsPermissions(botData.ids.users[source], botData.ids.guilds['jp101']),
    { body: data.guildCommandPermissions.map((cmdPerms) => ({ id: commands[cmdPerms.name], permissions: cmdPerms.permissions })) }
  )
