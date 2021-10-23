const types = {
  STRING: 3,
  INTEGER: 4,
  BOOLEAN: 5,
  USER: 6,
  CHANNEL: 7,
  ROLE: 8,
  MENTIONABLE: 9,
  NUMBER: 10
}

export default class Slash {
  constructor(
    {
      name = "test",
      desc = "Unknown use",
      help = "Unknown use",
      options = [],
      isGlobal = true,
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
      test
    }

    this.structure = {
      name,
      description: desc,
      options: options.map((option) => ({
        name: option.name,
        description: option.desc,
        type: types[option.type],
        required: option.required,
        choices: option.choices
      }))
    }

    this.run = run
  }
}
