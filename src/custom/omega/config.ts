import { GatewayIntentBits, Partials } from "discord.js";
import type { ClientConfig, ClientOptions } from "@/types";

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
