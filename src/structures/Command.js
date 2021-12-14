const commandTypes = {
  CHAT_INPUT: 1,
  USER: 2,
  MESSAGE: 3
}
const optionTypes = {
  SUB_COMMAND: 1,
  SUB_COMMAND_GROUP: 2,
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
        options: options.map(parseOption)
      })
      const autocomplete = options.map(parseAutocomplete).reduce((acc, cur) => Object.assign(acc, cur), {})
      if (Object.keys(autocomplete).length) Object.assign(this.info, { autocomplete })
    }

    if (!isGlobal && permissions.length) Object.assign(this, { permissions: permissions.map(parsePermission) })

    this.run = run
  }
}

function parseOption(option) {
  const structure = {
    name: option.name,
    description: option.description,
    type: optionTypes[option.type],
    autocomplete: Boolean(option.autocomplete),
    ...option.restraints
  }
  if ('required' in option) Object.assign(structure, { required: option.required })
  if ('options' in option) Object.assign(structure, { options: option.options.map(parseOption) })
  return structure
}

function parsePermission(permission) {
  return {
    id: permission.id,
    type: permissionTypes[permission.type],
    permission: permission.allow
  }
}

function parseAutocomplete(option) {
  if ('options' in option) return { [option.name]: { ...option.options.map(parseAutocomplete).reduce((acc, cur) => Object.assign(acc, cur), {}) } }
  if ('autocomplete' in option) return { [option.name]: option.autocomplete }
  return {}
}
