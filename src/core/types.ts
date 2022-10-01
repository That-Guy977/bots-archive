import type {
  ClientOptions as DiscordClientOptions,
  GatewayIntentBits,
  PermissionsString,
  LocalizationMap,
} from "discord.js";

export type ClientOptions = Partial<DiscordClientOptions> & {
  intents?: GatewayIntentBits[];
};
export type ClientConfig = {
  scripts?: string[];
  events?: Record<string, Record<string, string | number>>;
};
export type IdKey = Record<string, string>;
export type IdConfig = {
  guild: string;
  channel?: IdKey;
  user?: IdKey;
  role?: IdKey;
  emoji?: IdKey;
};
export type SourceConfig = {
  config: ClientConfig;
  clientOptions: ClientOptions;
  ids: IdConfig;
};

export enum LogLevel {
  INFO,
  DEBUG,
  WARN,
  ERROR,
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
