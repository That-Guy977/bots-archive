import type Client from "@/structure/Client";
import type Command from "@/structure/Command";

export default function deploy(client: Client): void {
  const commandMap = new Map<string | null, Command[]>();
  for (const [, command] of client.commands) {
    if (!commandMap.has(command.guild)) commandMap.set(command.guild, []);
    commandMap.get(command.guild)!.push(command);
  }
  for (const [guild, commands] of commandMap) {
    const commandData = commands.map((command) => command.construct());
    if (guild === null) client.application.commands.set(commandData);
    else client.application.commands.set(commandData, guild || client.getGuildId());
  }
}
