import chalk from "chalk";
import type Client from "@/structure/Client";
import type { Message } from "discord.js";

export default class DevCmd {
  constructor(
    readonly name: string,
    readonly exec: (client: Client, msg: Message, args: string[]) => void
    = (client, msg): void => client.debug(`DevCmd ${chalk.cyan(name)} executed by ${chalk.green(msg.author.tag)} (${chalk.yellow(msg.author.id)})`, "core.event")
  ) {}
}
