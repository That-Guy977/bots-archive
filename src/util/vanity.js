import getSource from './getSource.js'
import { readFile } from 'node:fs/promises'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
const { config } = JSON.parse(await readFile('shared/data.json'))
const { thisFile } = getSource(import.meta.url)

export default async function vanity(client, guild) {
  const rest = new REST({ version: '9' }).setToken(client.token)
  const code = config[thisFile][client.source]
  if (!code) return
  await rest.patch(
    Routes.guildVanityUrl(guild.id),
    { body: { code } }
  )
}
