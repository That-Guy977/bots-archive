import ChatInputCommand from "@/structure/ChatInputCommand";

export default new ChatInputCommand("check", "Check user reference", (client, cmd) => {
  cmd.reply({
    content: client.state.current
      ? `User reference: <@${client.state.current}>`
      : "No user reference",
    ephemeral: true,
  });
}, [], {
  guild: "",
});
