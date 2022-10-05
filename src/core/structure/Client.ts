import { log } from "@/types";
import { Client as DiscordClient, GatewayIntentBits } from "discord.js";
import chalk from "chalk";
import type Command from "@/structure/Command";
import type EventListener from "@/structure/EventListener";
import type { ClientOptions, IdConfig } from "@/types";

export default class Client extends DiscordClient<true> {
  readonly path: string;
  readonly commands = new Map<string, Command>();
  readonly events = new Map<string, EventListener>();
  readonly state: Record<string, string> = {};
  readonly idConfig: Required<IdConfig>;

  constructor(options: ClientOptions, readonly source: string, idConfig: IdConfig, readonly debug: boolean = false) {
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
    this.idConfig = {
      guild: idConfig.guild,
      channel: idConfig.channel ?? {},
      user: {
        dev: process.env["DEV_ID"]!,
        ...idConfig.user,
      },
      role: idConfig.role ?? {},
      emoji: idConfig.emoji ?? {},
    };
  }

  log(content: string, scope: string, level: string = log.INFO): void {
    if (!this.debug && level === log.DEBUG) return;
    /* eslint-disable-next-line no-console -- Client#log */
    console.log(`[${chalk.magenta(new Date().toISOString())}][${level};${this.source}] ${chalk.green(scope)}:`, content);
  }

  getGuildId(): string {
    return this.idConfig.guild;
  }

  getId(name: string, type: Exclude<keyof IdConfig, "guild">): string | null {
    const id = this.idConfig[type][name] ?? null;
    if (!id) this.log(`Id \`${name}\` type \`${type}\` not found`, "client.getId", log.WARN);
    return id;
  }
}
