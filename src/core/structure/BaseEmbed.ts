import { EmbedBuilder } from "discord.js";
import type Client from "@/structure/Client";
import type { User, GuildMember, ColorResolvable } from "discord.js";

export default class BaseEmbed extends EmbedBuilder {
  constructor(client: Client, title: string, color: ColorResolvable, req: User | GuildMember) {
    super({ title });
    this.setColor(color)
    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
    .setFooter({ text: `Requested by ${"tag" in req ? req.tag : req.user.tag}`, iconURL: req.displayAvatarURL() })
    .setTimestamp();
  }
}
