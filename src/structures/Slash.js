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

export default class Slash {
  constructor(
    {
      name = "test",
      desc = "Unknown use",
      help = "Unknown use",
      options = [],
      isGlobal = true,
      enabled = true,
      permissions = [],
      test = false
    },
    run = (_client, cmd) => cmd.reply("This command does not have functionality.")
  ) {
    this.info = {
      name,
      desc,
      help,
      options,
      isGlobal,
      enabled,
      test
    }

    this.structure = {
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
    }

    this.permissions = !isGlobal && permissions?.length ? permissions.map((permission) => ({
      id: permission.id,
      type: permissionTypes[permission.type],
      permission: permission.allow
    })) : null

    this.run = run
  }
}
