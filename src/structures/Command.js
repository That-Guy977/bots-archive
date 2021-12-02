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

export default class Command {
  constructor(
    {
      type = 'CHAT_INPUT',
      name = "test",
      description = "Test command",
      options = [],
      isGlobal = true,
      isEnabled = true,
      permissions = [],
      test = false
    },
    run = (_client, cmd) => cmd.reply({ content: "This command does not have functionality.", ephemeral: true })
  ) {
    this.info = type === 'CHAT_INPUT' ? {
      type,
      name,
      description,
      options,
      isGlobal,
      isEnabled,
      test
    } : {
      type,
      name,
      isGlobal,
      isEnabled,
      test
    }

    this.structure = type === 'CHAT_INPUT' ? {
      type: commandTypes[type],
      name,
      description,
      options: options.map((option) => ({
        name: option.name,
        description: option.description,
        type: optionTypes[option.type],
        required: option.required,
        ...option.restraints
      })),
      default_permission: isEnabled
    } : {
      type: commandTypes[type],
      name,
      description: "",
      default_permission: isEnabled
    }

    this.permissions = !isGlobal && permissions?.length ? permissions.map((permission) => ({
      id: permission.id,
      type: permissionTypes[permission.type],
      permission: permission.allow
    })) : null

    this.run = run
  }
}
