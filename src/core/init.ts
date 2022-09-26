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
  await Promise.all([
    ...paths.map(
      (src) => fs.readdir(`build/${src}/commands`)
      .then((ls) => ls.filter(asModule).map(asModule), () => [])
      .then((commandModules) => Promise.all(
        commandModules.map(
          async (commandModule) => import(`../${src}/commands/${commandModule}.js`)
          .then(({ default: command }: DefImport<Command>) => client.commands.set(command.name, command))
        )
      ))
    ),
    ...paths.map(
      (src) => fs.readdir(`build/${src}/events`)
      .then((ls) => ls.filter(asModule).map(asModule), () => [])
      .then((eventModules) => Promise.all(
        eventModules.map(
          async (eventModule) => import(`../${src}/events/${eventModule}.js`)
          .then(({ default: event }: DefImport<EventListener>) => client.events.set(eventModule!, event))
        )
      ))
    ),
  ]);
  for (const [, listener] of client.events)
    client.on(listener.event, (...args) => listener.emit(client, ...args));
  await client.login(process.env[`TOKEN_${source.toUpperCase()}`]);
  await Promise.all(scripts.map((script) => script(client)));
  client.log("init", "core");
}
