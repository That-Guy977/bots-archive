import { EmbedBuilder } from "discord.js";
import type Client from "@/structure/Client";
import type { User, GuildMember, ColorResolvable } from "discord.js";

export default class BaseEmbed extends EmbedBuilder {
  constructor(client: Client, title: string, color: ColorResolvable, requester?: User | GuildMember) {
    super({ title });
    this.setColor(color)
    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
    .setTimestamp();
    if (requester)
      this.setFooter({
        text: `Requested by ${client.users.resolve(requester)!.tag}`,
        iconURL: requester.displayAvatarURL(),
      });
  }
}
