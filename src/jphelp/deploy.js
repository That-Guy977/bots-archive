import { Client } from '../shared/structures.js'
import { getSource } from '../shared/util.js'
import { readdir } from 'node:fs/promises'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { config } from 'dotenv'
const { source } = getSource(import.meta.url)

config({ path: '../../.env' })

const client = new Client({ intents: [] }, source)
const rest = new REST({ version: '9' }).setToken(client.token)
const commandData = {
  globalCommands: [],
  guildCommands: [],
  guildCommandPermissions: []
}

await Promise.all(['shared/commands', `${source}/commands`].map(async (folder) => {
  const files = await readdir(`../${folder}`).then((fs) => fs.filter((f) => f.endsWith(".js"))).catch(() => [])
  await Promise.all(files.map(async (file) => {
    const { default: command } = await import(`../${folder}/${file}`)
    commandData[command.info.isGlobal ? "globalCommands" : "guildCommands"].push(command.structure)
    if ('permissions' in command) commandData.guildCommandPermissions.push({ name: command.info.name, permissions: command.permissions })
  }))
}))

if (commandData.globalCommands.length)
  await rest.put(
    Routes.applicationCommands(client.resolveId(source, 'user')),
    { body: commandData.globalCommands }
  )

if (commandData.guildCommands.length)
  await rest.put(
    Routes.applicationGuildCommands(client.resolveId(source, 'user'), client.resolveId(client.main.guild, 'guild')),
    { body: commandData.guildCommands }
  )

const commands = await rest.get(
  Routes.applicationGuildCommands(client.resolveId(source, 'user'), client.resolveId(client.main.guild, 'guild'))
).then((cmds) => Object.fromEntries(cmds.map((cmd) => [cmd.name, cmd.id])))

if (commandData.guildCommandPermissions.length)
  await rest.put(
    Routes.guildApplicationCommandsPermissions(client.resolveId(source, 'user'), client.resolveId(client.main.guild, 'guild')),
    { body: commandData.guildCommandPermissions.map((cmdPerms) => ({ id: commands[cmdPerms.name], permissions: cmdPerms.permissions })) }
  )
