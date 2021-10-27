import { getShortStructure, strCapitalize } from '../shared/util.js'

export default class SendError {
  static send(msg, str) {
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

  static general = {
    invalidGuild: (msg) => SendError.send(msg, "This command is not available in this guild."),
    insufficientPerms: (msg) => SendError.send(msg, "You don't have permission to do that!")
  }

  static readCmd = {
    invalidChannel: (msg) => SendError.send(msg, "This command is not available in Direct Messages."),
    requiredArgs: (msg, arg) => SendError.send(msg, `Argument \`${arg}\` is required for this command.`)
  }

  static help = {
    invalidCommand: (msg, cmd) => SendError.send(msg, `Command \`${cmd}\` not found.`),
    invalidArgument: (msg, cmd, arg) => SendError.send(msg, `Argument \`${arg}\` of command \`${cmd}\` not found.`)
  }

  static getdata = {
    invalidType: (msg) => SendError.send(msg, "Please provide a valid structure to get."),
    invalidData: (msg) => SendError.send(msg, "Please specify a valid ID or keyword to get."),
    invalidId: (msg, type, id) => SendError.send(msg, `${strCapitalize(type)} of ID ${id} not found.`),
    invalidAccess: (msg, cur) => SendError.send(msg, `Invalid property: \`${cur}\`.`),

    propUndefined: (msg, pchain) => SendError.send(msg, `Value \`undefined\` at \`${pchain}\`.`),
    propPrimitive: (msg, pchain, s) => SendError.send(msg, `Primitive value \`${getShortStructure(s)}\` at \`${pchain}\`.`),
    propNotMethod: (msg, pchain) => SendError.send(msg, `Property \`${pchain}\` is not a function.`),
    propToken: (msg) => SendError.send(msg, "Token access is prohibited."),

    paramNotPrimitive: (msg, param) => SendError.send(msg, `Value \`${param}\` is not a valid primitive value.`),
    methodError: (msg, func, e) => SendError.send(msg, `Error at \`${func}\`:\n\`${e}\``),

    noReply: (msg) => SendError.send(msg, "Please reply to the message you want to get data from."),
    invalidGetThis: (msg, type) => SendError.send(msg, `The specified message does not have a \`${type}\` property.`),
    invalidGetMessage: (msg) => SendError.send(msg, "The specified channel is not a text-based channel.")
  }

  static delsigma = {
    invalidNumber: (msg, num) => SendError.send(msg, `\`${num}\` is not a valid number.`),
    numberTooLarge: (msg) => SendError.send(msg, "Cannot delete more than 20 messages."),
    numberTooSmall: (msg) => SendError.send(msg, "Cannot delete less than 1 message."),
    noMessages: (msg) => SendError.send(msg, "No messages found to delete.")
  }
}
