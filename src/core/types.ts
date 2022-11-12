import type {
  ClientOptions as DiscordClientOptions,
  GatewayIntentBits,
  PermissionsString,
  LocalizationMap,
} from "discord.js";

export interface ClientOptions extends Partial<DiscordClientOptions> {
  intents?: GatewayIntentBits[];
}
export interface ClientConfig {
  scripts?: string[];
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

export interface ClientState {
  debug: boolean;
}

export interface CommandConfig {
  name: string;
  guild?: string | null;
  permissions?: PermissionsString[];
  localizations?: LocalizationMap;
}
export interface ChatInputCommandConfig extends Omit<CommandConfig, "localizations"> {
  description: string;
  localizations?: Localized<"name" | "description">;
}
export type Localized<K extends string> = Partial<Record<K, LocalizationMap>>;

export interface DefImport<T = unknown> { default: T }
