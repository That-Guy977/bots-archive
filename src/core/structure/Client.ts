import { LogLevel } from "@/types";
import { Client as DiscordClient, GatewayIntentBits } from "discord.js";
import chalk from "chalk";
import type Command from "@/structure/Command";
import type EventListener from "@/structure/EventListener";
import type { ClientOptions } from "@/types";
const logLevelColor: { [K in keyof typeof LogLevel]: string } = {
  INFO: chalk.blue("INFO"),
  DEBUG: chalk.magenta("DEBUG"),
  WARN: chalk.yellow("WARN"),
  ERR: chalk.red("ERR"),
};

export default class Client extends DiscordClient<true> {
  commands = new Map<string, Command>();
  events = new Map<string, EventListener>();

  constructor(options: ClientOptions, readonly source: string, readonly debug: boolean = false) {
    options.intents.push(
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    );
    super(options);
  }

  log(content: string, scope: string, level: LogLevel = LogLevel.INFO): void {
    if (!this.debug && level === LogLevel.DEBUG) return;
    console.log(Date(), `[${logLevelColor[level]};${this.source}] ${scope}:`, content);
  }
}
