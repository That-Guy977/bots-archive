import EventListener from "@/structure/EventListener";
import { LogLevel } from "../types";

export default new EventListener("interactionCreate", (client, interaction) => {
  if (!interaction.isCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (cmd) {
    cmd.exec(client, interaction);
    client.log(`command ${cmd.name} executed`, "event.command", LogLevel.DEBUG);
  } else {
    interaction.reply({ content: "Unknown command", ephemeral: true });
    client.log(`unknown command ${interaction.commandName} executed`, "event.command", LogLevel.WARN);
  }
});
