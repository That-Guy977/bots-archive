import chalk from "chalk";
import type {
  ClientOptions as DiscordClientOptions,
  GatewayIntentBits,
  PermissionsString,
  LocalizationMap,
} from "discord.js";

export const log = {
  INFO: chalk.blue("INFO"),
  DEBUG: chalk.magenta("DEBUG"),
  WARN: chalk.yellow("WARN"),
  ERROR: chalk.red("ERROR"),
};

export interface ClientConfig {
  scripts?: string[];
}
export interface ClientOptions extends Partial<DiscordClientOptions> {
  intents?: GatewayIntentBits[];
}
export type IdKey = Record<string, string>;
export interface IdConfig {
  guild: string;
  channel?: IdKey;
  user?: IdKey;
  role?: IdKey;
  emoji?: IdKey;
}
export interface SourceConfig {
  config: ClientConfig;
  clientOptions: ClientOptions;
  idConfig: IdConfig;
}

export interface CommandConfig {
  permissions?: CommandPermissions;
  nameLocalizations?: LocalizationMap;
}
export interface ChatInputCommandConfig extends CommandConfig {
  descriptionLocalizations?: LocalizationMap;
}
export interface CommandPermissions {
  default?: PermissionsString[];
  dm?: boolean;
}

export interface DefImport<T = unknown> { default: T }
