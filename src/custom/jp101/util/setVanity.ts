import { Routes } from "discord.js";
import type Client from "@/structure/Client";

export default async function vanity(client: Client): Promise<void> {
  client.log("Setting vanity code", "jp101.util.setVanity");
  await client.rest.patch(
    Routes.guildVanityUrl(client.getGuildId()),
    { body: { code: "jp101" } }
  );
}
