const commandTypes = {
  CHAT_INPUT: 1,
  USER: 2,
  MESSAGE: 3
}
const optionTypes = {
  STRING: 3,
  INTEGER: 4,
  BOOLEAN: 5,
  USER: 6,
  CHANNEL: 7,
  ROLE: 8,
  MENTIONABLE: 9,
  NUMBER: 10
}
const permissionTypes = {
  ROLE: 1,
  USER: 2
}

export default class ApplicationCommand {
  constructor(
    {
      type = "CHAT_INPUT",
      name = "test",
      desc = "Unknown use",
      options = [],
      isGlobal = true,
      enabled = true,
      permissions = [],
      test = false
    },
    run = (_client, cmd) => cmd.reply({ content: "This command does not have functionality.", ephemeral: true })
  ) {
    this.info = type === "CHAT_INPUT" ? {
      type,
      name,
      desc,
      options,
      isGlobal,
      enabled,
      test
    } : {
      type,
      name,
      isGlobal,
      enabled,
      test
    }

    this.structure = type === "CHAT_INPUT" ? {
      type: commandTypes[type],
      name,
      description: desc,
      options: options.map((option) => ({
        name: option.name,
        description: option.desc,
        type: optionTypes[option.type],
        required: option.required,
        ...option.restraints
      })),
      default_permission: enabled
    } : {
      type: commandTypes[type],
      name,
      description: "",
      default_permission: enabled
    }

    this.permissions = !isGlobal && permissions?.length ? permissions.map((permission) => ({
      id: permission.id,
      type: permissionTypes[permission.type],
      permission: permission.allow
    })) : null

    this.run = run
  }
}
