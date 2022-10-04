import ChatInputCommand from "@/structure/ChatInputCommand";
import setState from "@/manju/util/setState";

export default new ChatInputCommand("update", "Update user reference", async (client, cmd) => {
  if (!client.state["current"]) {
    cmd.reply({ content: "No user reference", ephemeral: true });
    return;
  }
  const member = await cmd.guild!.members.fetch(client.state["current"]).catch(() => null);
  if (!member) {
    cmd.reply({ content: "Invalid member", ephemeral: true });
    setState(client, "");
    return;
  }
  await Promise.all([
    cmd.deferReply(),
    cmd.guild!.members.me!.setNickname(member.displayName),
  ]);
  cmd.editReply(`Updated user reference to ${member}.`);
}, "");
