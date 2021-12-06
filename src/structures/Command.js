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
      permissions = []
    },
    run = (_client, cmd) => cmd.reply({ content: "This command does not have functionality.", ephemeral: true })
  ) {
    this.info = {
      type,
      name,
      isGlobal,
      isEnabled
    }

    this.structure = {
      type: commandTypes[type],
      name,
      description: "",
      default_permission: isEnabled
    }

    if (type === 'CHAT_INPUT') {
      Object.assign(this.info, { description, options })
      Object.assign(this.structure, {
        description,
        options: options.map((option) => ({
          name: option.name,
          description: option.description,
          type: optionTypes[option.type],
          required: option.required ?? false,
          ...option.restraints
        }))
      })
    }

    this.permissions = !isGlobal && permissions?.length ? permissions.map((permission) => ({
      id: permission.id,
      type: permissionTypes[permission.type],
      permission: permission.allow
    })) : null

    this.run = run
  }
}
