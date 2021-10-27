import { getShortStructure, strCapitalize } from '../shared/util.js'

export default function SendError(msg, str) {
  msg.channel.send(
    str.length <= 2000 ? {
      content: str,
      allowedMentions: { parse: [] }
    } : {
      content: "Something went wrong while executing this command.",
      files: [{
        attachment: Buffer.from(str),
        name: "error.txt"
      }]
    }
  ).catch(() => msg.react('\u2757'))
}

SendError.general = {
  invalidGuild: (msg) => SendError(msg, "This command is not available in this guild."),
  invalidMember: (msg, id) => SendError(msg, `${id} is not a valid member.`),
  insufficientPerms: (msg) => SendError(msg, "You don't have permission to do that!")
}

SendError.readCmd = {
  invalidChannel: (msg) => SendError(msg, "This command is not available in Direct Messages."),
  requiredArgs: (msg, arg) => SendError(msg, `Argument \`${arg}\` is required for this command.`)
}

SendError.help = {
  invalidCommand: (msg, cmd) => SendError(msg, `Command \`${cmd}\` not found.`),
  invalidArgument: (msg, cmd, arg) => SendError(msg, `Argument \`${arg}\` of command \`${cmd}\` not found.`)
}

SendError.getdata = {
  invalidType: (msg) => SendError(msg, "Please provide a valid structure to get."),
  invalidData: (msg) => SendError(msg, "Please specify a valid ID or keyword to get."),
  invalidId: (msg, type, id) => SendError(msg, `${strCapitalize(type)} of ID ${id} not found.`),
  invalidAccess: (msg, cur) => SendError(msg, `Invalid property: \`${cur}\`.`),

  propUndefined: (msg, pchain) => SendError(msg, `Value \`undefined\` at \`${pchain}\`.`),
  propPrimitive: (msg, pchain, s) => SendError(msg, `Primitive value \`${getShortStructure(s)}\` at \`${pchain}\`.`),
  propNotMethod: (msg, pchain) => SendError(msg, `Property \`${pchain}\` is not a function.`),
  propToken: (msg) => SendError(msg, "Token access is prohibited."),

  paramNotPrimitive: (msg, param) => SendError(msg, `Value \`${param}\` is not a valid primitive value.`),
  methodError: (msg, func, e) => SendError(msg, `Error at \`${func}\`:\n\`${e}\``),

  noReply: (msg) => SendError(msg, "Please reply to the message you want to get data from."),
  invalidGetThis: (msg, type) => SendError(msg, `The specified message does not have a \`${type}\` property.`),
  invalidGetMessage: (msg) => SendError(msg, "The specified channel is not a text-based channel.")
}

SendError.delsigma = {
  invalidNumber: (msg, num) => SendError(msg, `\`${num}\` is not a valid number.`),
  numberTooLarge: (msg) => SendError(msg, "Cannot delete more than 20 messages."),
  numberTooSmall: (msg) => SendError(msg, "Cannot delete less than 1 message."),
  noMessages: (msg) => SendError(msg, "No messages found to delete.")
}
