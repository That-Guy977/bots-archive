import ChatInputCommand from "@/structure/ChatInputCommand";
import { ApplicationCommandOptionType } from "discord.js";

export default new ChatInputCommand({
  name: "delsigma",
  description: "Delete recent messages from Apex Sigma.",
  guild: "",
}, async (client, cmd) => {
  const limit = cmd.options.getInteger("limit") ?? 1;
  const messages = await cmd.channel!.messages.fetch({ limit: 100 })
  .then((msgs) => msgs.filter((msg) => msg.author.id === client.getId("sigma", "user")).first(limit));
  if (!messages.length) cmd.reply({ content: "No messages found to delete.", ephemeral: true });
  else {
    await Promise.all([
      cmd.deferReply(),
      cmd.channel!.bulkDelete(messages, true),
    ]);
    cmd.editReply(`Finished deleting ${messages.length} message(s).`);
  }
}, [
  {
    name: "limit",
    description: "Limit to how many messages are deleted. Default 1.",
    type: ApplicationCommandOptionType.Integer,
    minValue: 1,
    maxValue: 20,
  },
]);
