import EventListener from "@/structure/EventListener";
import { log } from "../types";

export default new EventListener("interactionCreate", (client, interaction) => {
  if (!interaction.isCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (cmd) {
    cmd.exec(client, interaction);
    client.log(`Command ${cmd.name} executed`, "event.command", log.DEBUG);
  } else {
    interaction.reply({ content: "Unknown command", ephemeral: true });
    client.log(`Unknown command ${interaction.commandName} executed`, "event.command", log.WARN);
  }
});
