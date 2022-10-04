import { log } from "@/types";
import type Client from "@/structure/Client";
import type Command from "@/structure/Command";

export default function deploy(client: Client): void {
  const commandMap = new Map<string | null, Command[]>();
  for (const [, command] of client.commands) {
    if (!commandMap.has(command.guild)) commandMap.set(command.guild, []);
    commandMap.get(command.guild)!.push(command);
  }
  client.log("Deploying commands", "scripts.deploy");
  for (const [guild, commands] of commandMap) {
    const commandData = commands.map((command) => command.construct());
    client.log(`  ${(guild ?? "global") || "main"}: ${commandData.length}`, "scripts.deploy");
    if (guild === null) client.application.commands.set(commandData).then(() => client.log("Deployed global", "scripts.deploy", log.DEBUG));
    else client.application.commands.set(commandData, guild || client.getGuildId()).then(() => client.log(`Deployed for ${guild || "main"}`, "scripts.deploy", log.DEBUG));
  }
}
