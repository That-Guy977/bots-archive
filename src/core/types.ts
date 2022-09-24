import type {
  ClientOptions as DiscordClientOptions,
  GatewayIntentBits,
  PermissionsString,
  LocalizationMap,
} from "discord.js";

export type ClientOptions = DiscordClientOptions & {
  intents: GatewayIntentBits[];
};
export type ClientConfig = {
  guild?: string;
  channel?: string;
};
export type SourceConfig = {
  config: ClientConfig;
  clientOptions: ClientOptions;
};

export enum LogLevel {
  INFO,
  DEBUG,
  WARN,
  ERR,
}

export type CommandConfig = {
  permissions?: CommandPermissions;
  nameLocalizations?: LocalizationMap;
};
export type ChatInputCommandConfig = CommandConfig & {
  descriptionLocalizations?: LocalizationMap;
};
export type CommandPermissions = {
  default?: PermissionsString[];
  dm?: boolean;
};

export type DefImport<T = unknown> = { default: T };
