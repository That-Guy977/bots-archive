import { GatewayIntentBits, Partials } from "discord.js";
import type { ClientConfig, ClientOptions, IdConfig } from "@/types";

export const clientOptions: ClientOptions = {
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [
    Partials.GuildMember,
    Partials.Message,
  ],
  rest: {
    retries: 5,
    timeout: 30000,
  },
};

export const config: ClientConfig = {};

export const idConfig: IdConfig = {
  guild: "778426035141869620",
  channel: {
    modtest: "779380025299959829",
  },
};
