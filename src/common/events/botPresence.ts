import EventListener from "@/structure/EventListener";
import BaseEmbed from "@/structure/BaseEmbed";
import chalk from "chalk";
import { Colors } from "discord.js";
import type Client from "@/structure/Client";
import type { Presence } from "discord.js";

export default new EventListener("presenceUpdate", (client, oldPresence, presence) => {
  const config = client.config.botPresence;
  if (!config) return;
  if (presence.guild?.id !== client.idConfig.guild) return;
  if (isOffline(presence) === isOffline(oldPresence)) return;
  if (!presence.user?.bot) return;
  const logOnline = config.online ?? true;
  if (logOnline) client.state.botPresence ??= new Set<string>();
  const embed = new BaseEmbed(client, `${presence.user.username} ${isOffline(presence) ? "offline." : "online!"}`, Colors.Blue);
  embed.setAuthor({ name: presence.user.tag, iconURL: presence.user.displayAvatarURL() });
  if (isOffline(presence))
    setTimeout(async () => {
      if (await presence.member!.fetch().then((m) => !isOffline(m.presence))) return;
      if (logOnline) client.state.botPresence!.add(presence.userId);
      sendStatus(client, embed);
    }, (config.delay ?? 0) * 1000);
  else if (logOnline && client.state.botPresence!.delete(presence.userId))
    sendStatus(client, embed);
});

declare module "@/types" {
  interface ClientConfig {
    botPresence?: {
      channel: string;
      delay?: number;
      online?: boolean;
    };
  }
  interface ClientState {
    botPresence?: Set<string>;
  }
}

function sendStatus(client: Client, embed: BaseEmbed): void {
  const channelName = client.config.botPresence!.channel;
  const channel = client.getChannel(channelName);
  const warnUnavailable = (): void => client.error(`Channel ${chalk.cyan(channelName)} unavailable.`, "event.botPresence");
  if (channel.isTextBased())
    channel.send({ embeds: [embed] }).catch(warnUnavailable);
  else warnUnavailable();
}

function isOffline(presence: Presence | null): boolean {
  return !presence || presence.status === "offline";
}
