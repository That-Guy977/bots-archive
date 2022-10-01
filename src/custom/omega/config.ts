import { GatewayIntentBits, Partials } from "discord.js";
import type { ClientConfig, ClientOptions, IdConfig } from "@/types";

export const config: ClientConfig = {};

export const clientOptions: ClientOptions = {
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [
    Partials.GuildMember,
  ],
};

export const ids: IdConfig = {
  guild: "847136199436009502",
  channel: {
    spam: "1008586602844540998",
  },
  role: {
    member: "855150270467538954",
    bot: "855146634118430720",
  },
};
