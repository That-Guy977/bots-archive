import ChatInputCommand from "@/structure/ChatInputCommand";
import setState from "@/manju/util/setState";

export default new ChatInputCommand("reset", "Reset user reference", async (client, cmd) => {
  if (!client.state["current"]) {
    cmd.reply({ content: "No user reference", ephemeral: true });
    return;
  }
  await Promise.all([
    cmd.deferReply(),
    cmd.guild!.members.me!.setNickname(null),
    setState(client, ""),
  ]);
  client.log("Reset state", "commands.reset");
  cmd.editReply("Reset user reference.");
}, "");
