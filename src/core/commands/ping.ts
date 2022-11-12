import ChatInputCommand from "@/structure/ChatInputCommand";
import BaseEmbed from "@/structure/BaseEmbed";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, GuildMember } from "discord.js";
import type Client from "@/structure/Client";
import type { Interaction } from "discord.js";

export default new ChatInputCommand({
  name: "ping",
  description: "Pings the bot.",
}, async (client, cmd) => {
  const now = Date.now();
  const reply = await cmd.deferReply({ fetchReply: true });
  const msg = await cmd.editReply({
    embeds: [pingEmbed(client, cmd, reply.createdTimestamp, now)],
    components: [
      new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
        .setLabel("Ping")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("\u{1F501}")
        .setCustomId("ping")
      ),
    ],
  }).catch(() => null);
  msg?.createMessageComponentCollector({
    time: 600000,
    idle: 60000,
  }).on("collect", async (i) => {
    if (i.customId !== "ping") return;
    const iNow = Date.now();
    const iReply = await i.update({ content: "Pinging...", fetchReply: true });
    i.editReply({ content: null, embeds: [pingEmbed(client, i, iReply.editedTimestamp!, iNow)] }).catch(() => null);
  }).on("end", () => {
    cmd.editReply({ components: [] }).catch(() => null);
  });
});

function pingEmbed(client: Client, i: Interaction, replied: number, now: number): BaseEmbed {
  const sent = i.createdTimestamp;
  const req = i.member instanceof GuildMember ? i.member : i.user;
  return new BaseEmbed(client, "Pong!", Colors.Blue, req)
  .setDescription(`\u{1F493} \`${client.ws.ping} ms\``)
  .addFields(
    { name: "\u{1F553} Latency", value: `\`${replied - sent} ms\``, inline: true },
    { name: "\u{1F4E5} Recieving", value: `\`${now - sent} ms\``, inline: true },
    { name: "\u{1F4E4} Sending", value: `\`${replied - now} ms\``, inline: true }
  )
  .setTimestamp();
}
