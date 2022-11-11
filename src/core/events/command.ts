import EventListener from "@/structure/EventListener";

export default new EventListener("interactionCreate", (client, interaction) => {
  if (!interaction.isCommand() || !interaction.inCachedGuild()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (cmd) {
    cmd.exec(client, interaction);
    client.debug(`Command ${cmd.name} executed`, "core.event.command");
  } else {
    interaction.reply({ content: "Unknown command", ephemeral: true });
    client.error(`Unknown command ${interaction.commandName} executed`, "core.event.command");
  }
});
