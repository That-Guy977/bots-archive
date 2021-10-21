export default class Command {
  constructor(
    {
      name = "test",
      desc = "Unknown use",
      help = "Unknown use",
      errr = '\u2757',
      args = [],
      perm = [],
      indm = true,
      hide = false,
      test = false
    },
    run = (_client, msg) => msg.channel.send("This command does not have functionality.")
  ) {
    this.info = {
      name,
      help,
      desc,
      errr,
      args,
      perm,
      indm,
      hide,
      test
    }

    this.run = run
  }
}
