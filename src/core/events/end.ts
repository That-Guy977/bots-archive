import EventListener from "@/structure/EventListener";
import { PermissionFlagsBits } from "discord.js";

export default new EventListener("messageCreate", async (client, msg) => {
  if (msg.author.bot) return;
  if (msg.content !== `${client.source} end`) return;
  if (!msg.member?.permissions.has(PermissionFlagsBits.ManageGuild)) return;
  await msg.react("\u{2705}").catch(() => null);
  client.log(`ended by ${msg.author.tag} (${msg.author.id})`, "event.end");
  client.destroy();
});