import Client from "@/structure/Client";
import asModule from "@/util/asModule";
import fs from "node:fs/promises";
import type { SourceConfig, DefImport } from "@/types";
import type Command from "@/structure/Command";
import type EventListener from "@/structure/EventListener";
const commonPaths = ["core", "common"];

export default async function init(source: string, scripts: string[] = [], debug = false): Promise<void> {
  const { clientOptions, config, idConfig } = await import(`../custom/${source}/config.js`) as SourceConfig;
  const client = new Client(clientOptions, source.toUpperCase(), config, idConfig, debug);
  client.log("Start", "core.init");
  const scriptFns: ((client: Client) => void)[] = [];
  const paths = [...commonPaths, `custom/${source}`];
  scripts.push(...config.scripts ?? []);
  const scriptFiles = await Promise.all(
    paths.map(
      (src) => fs.readdir(`build/${src}/scripts`)
      .then((files) => files.filter(asModule).map(asModule))
      .catch<string[]>(() => [])
    )
  );
  if (!scripts.every((script) => scriptFiles.flat().includes(script))) {
    client.error(`Script(s) ${scripts.filter((script) => !scriptFiles.flat().includes(script)).join(", ")} not found.`, "core");
    return;
  }
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
    ...scripts.map(
      (script) => (
        scriptFiles[2]!.includes(script)
          ? import(`../custom/${source}/scripts/${script}.js`)
          : import(`./scripts/${script}.js`)
      ).then(({ default: scriptFn }: DefImport<(client: Client) => void>) => scriptFns.push(scriptFn))
    ),
  ]);
  for (const [, listener] of client.events)
    client.on(listener.event, (...args) => listener.emit(client, ...args));
  await client.login(process.env[`${client.source}_TOKEN`]);
  await Promise.all(scriptFns.map((script) => script(client)));
  client.log("Done", "core.init");
}
