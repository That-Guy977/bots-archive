import Client from "@/structure/Client";
import asModule from "@/util/asModule";
import fs from "node:fs/promises";
import type Command from "@/structure/Command";
import type EventListener from "@/structure/EventListener";
import type { SourceConfig, DefImport } from "@/types";
const commonPaths = ["core", "common"];

export default async function init(source: string, scripts: ((client: Client) => void)[] = []): Promise<void> {
  const { clientOptions } = await import(`../custom/${source}/config.js`) as SourceConfig;
  const client = new Client(clientOptions, source);
  const paths = [...commonPaths, source];
  const commandPaths = paths.map((src) => `${src}/commands`);
  const eventPaths = paths.map((src) => `${src}/events`);
  for (const commandPath of commandPaths)
    for (const commandModule of await fs.readdir(`build/${commandPath}`).then((ls) => ls.filter(asModule).map(asModule), () => [])) {
      const { default: command } = await import(`../${commandPath}/${commandModule}.js`) as DefImport<Command>;
      client.commands.set(command.name, command);
    }
  for (const eventPath of eventPaths)
    for (const eventModule of await fs.readdir(`build/${eventPath}`).then((ls) => ls.filter(asModule).map(asModule), () => [])) {
      const { default: event } = await import(`../${eventPath}/${eventModule}.js`) as DefImport<EventListener>;
      client.events.set(eventModule!, event);
    }
  for (const [, listener] of client.events)
    client.on(listener.event, (...args) => listener.emit(client, ...args));
  await client.login(process.env[`TOKEN_${source.toUpperCase()}`]);
  await Promise.all(scripts.map((script) => script(client)));
}
