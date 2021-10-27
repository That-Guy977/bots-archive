import { Command } from '../../shared/structures.js'
import { MessageEmbed } from 'discord.js'
const order = [
  "help",
  "ping",
  "invite",
  "delsigma"
]

export const command = new Command({
  name: "help",
  desc: "Sends this help embed, or details for the specified command or argument.",
  help: "Sends an embed with basic info on each command, or detailed info about a specific command or argument.",
  args: [
    {
      name: "command",
      desc: "The command to send info about.",
      help: "Sends information about the given command, if provided.",
      type: "string",
      req: false
    },
    {
      name: "argument",
      desc: "The argument to send info about.",
      help: "Sends information about the given argument of the command, if provided.",
      type: "string",
      req: false
    }
  ]
}, (client, msg, arg) => {
  const commands = client.commands
  .filter(({ info }) => !info.hide && !info.test)
  .sort((cmdA, cmdB) => order.indexOf(cmdA.info.name) - order.indexOf(cmdB.info.name))
  const embed = new MessageEmbed()
  .setTitle(`${client.user.username} Commands`)
  .setColor(client.color)
  .setFooter(`Requested by ${msg.author.tag}.${"slash" in client ? " | Type / to see Slash Commands." : ""}`, msg.author.displayAvatarURL())
  .setTimestamp()
  if (!arg.length) embed.addFields(commands.map(({ info }, name) => ({
    name: `${client.prefix}${name}`,
    value: info.desc
  })))
  else {
    const cmd = arg.shift()
    if (!commands.has(cmd)) return msg.channel.send(`Command \`${arg[0]}\` not found.`)
    const { info } = commands.get(cmd)
    if (!arg.length) {
      const { name: cmdName, help, args } = info
      embed
      .setTitle(`${client.prefix}${cmdName} ${args.map(({ name: argName, req }) => (req ? `<${argName}>` : `[${argName}]`)).join(" ")}`)
      .setDescription(help)
      .addFields(args.map(({ name: argName, desc, type, req }) => ({
        name: `${argName} (${type})`,
        value: `[${req ? "Required" : "Optional"}] ${desc}`
      })))
      if (!embed.fields.length) embed.description += `\n\`${client.prefix}${cmdName}\` has no arguments.`
    } else {
      const argument = arg.shift()
      const { args } = info
      if (!args.some(({ name: argName }) => argName === argument)) return msg.channel.send(`Argument \`${argument}\` of command \`${cmd}\` not found.`)
      const { name, help, req } = args.find(({ argName }) => argName === argument)
      embed.setTitle(`${client.prefix}${name} ${
        args.map(({ name: argName, req: argReq }) => (
          argReq
            ? argName === argument ? `__**<${argName}>**__` : `<${argName}>`
            : argName === argument ? `__**[${argName}]**__` : `[${argName}]`
        )).join(" ")
      }`).setDescription(`[${req ? "Required" : "Optional"}] ${help}`)
    }
  }
  msg.channel.send({ embeds: [embed] })
})
