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
  ERROR: chalk.red("ERROR"),
};

export default class Client extends DiscordClient<true> {
  readonly path: string;
  readonly commands = new Map<string, Command>();
  readonly events = new Map<string, EventListener>();
  readonly state: Record<string, unknown> = {};

  constructor(options: ClientOptions, readonly source: string, readonly debug: boolean = false) {
    super({
      allowedMentions: { parse: [] },
      ...options,
      intents: (options.intents ?? []).concat(
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ),
    });
    this.path = `build/custom/${source}`;
  }

  log(content: string, scope: string, level: LogLevel = LogLevel.INFO): void {
    if (!this.debug && level === LogLevel.DEBUG) return;
    console.log(Date(), `[${logLevelColor[level]};${this.source}] ${scope}:`, content);
  }
}
