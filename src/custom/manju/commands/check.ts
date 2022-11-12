import ChatInputCommand from "@/structure/ChatInputCommand";

export default new ChatInputCommand({
  name: "check",
  description: "Check user reference",
  guild: "",
}, (client, cmd) => {
  cmd.reply({
    content: client.state.current
      ? `User reference: <@${client.state.current}>`
      : "No user reference",
    ephemeral: true,
  });
});
