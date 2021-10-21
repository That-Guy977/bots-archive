import { Command, SendError } from '../../shared/structures.js'
import { getSource } from '../../shared/util.js'
import { MessageEmbed } from 'discord.js'
const { thisFile } = getSource(import.meta.url)
const order = [
  "help",
  "ping",
  "invite",
  "delsigma"
]

export const command = new Command({
  name: "help",
  help: "Sends this help embed, or details for the specified command or argument.",
  desc: "Sends a embed with basic info on each command, or detailed info about a specific command or argument.",
  args: [
    {
      name: "command",
      help: "The command to send info about.",
      desc: "Sends information about the given command, if provided.",
      type: "string",
      req: false
    },
    {
      name: "argument",
      help: "The argument to send info about.",
      desc: "Sends information about the given argument of the command, if provided.",
      type: "string",
      req: false
    }
  ]
}, (client, msg, arg) => {
  const commands = client.commands
  .filter(({ info }) => !info.hide && !info.test)
  .sort((cmdA, cmdB) => order.indexOf(cmdA.info.name) - order.indexOf(cmdB.info.name))
  const embed = new MessageEmbed()
  .setTitle("Japanese 101 Help Commands")
  .setColor(client.color)
  .setFooter(`Requested by ${msg.author.tag}.`, msg.author.displayAvatarURL())
  .setTimestamp()
  if (!arg[0]) embed.addFields(commands.map(({ info }, name) => ({
    name: `${client.prefix}${name}`,
    value: info.help
  })))
  else {
    if (!commands.has(arg[0])) return SendError[thisFile].invalidCommand(msg, arg[0])
    const { info } = commands.get(arg[0])
    if (!arg[1]) {
      const { name: cmdName, desc, args } = info
      embed
      .setTitle(`${client.prefix}${cmdName} ${args.map(({ name: argName, req }) => (req ? `<${argName}>` : `[${argName}]`)).join(" ")}`)
      .setDescription(desc)
      .addFields(args.map(({ name: argName, help, type, req }) => ({
        name: `${argName} (${type})`,
        value: `[${req ? "Required" : "Optional"}] ${help}`
      })))
      if (!embed.fields.length) embed.description += `\n\`${client.prefix}${cmdName}\` has no arguments.`
    } else {
      const { args } = info
      if (!args.some(({ name: argName }) => argName === arg[1])) return SendError[thisFile].invalidArgument(msg, arg[0], arg[1])
      const { name, desc, req } = args.find(({ argName }) => argName === arg[1])
      embed
      .setTitle(`${client.prefix}${name} ${
        args.map(({ name: argName, req: argReq }) => (
          argReq
            ? argName === arg[1] ? `__**<${argName}>**__` : `<${argName}>`
            : argName === arg[1] ? `__**[${argName}]**__` : `[${argName}]`
        )).join(" ")
      }`)
      .setDescription(`[${req ? "Required" : "Optional"}] ${desc}`)
    }
  }
  msg.channel.send({ embeds: [embed] })
})
