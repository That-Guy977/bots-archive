import Client from "@/structure/Client";
import isModule from "@/util/isModule";
import path from "node:path";
import glob from "tiny-glob";
import chalk from "chalk";
import type { SourceConfig, DefImport } from "@/types";
import type Command from "@/structure/Command";
import type EventListener from "@/structure/EventListener";
const commonPaths = ["core", "common"];

export default async function init(source: string, scripts: string[] = [], debug = false): Promise<void> {
  const { clientOptions, config, idConfig } = await import(`../custom/${source}/config.js`) as SourceConfig;
  const client = new Client(clientOptions, source.toUpperCase(), config, idConfig, debug);
  client.log("Start", "core.init");
  const paths = [`custom/${source}`, ...commonPaths];
  scripts.push(...config.scripts ?? []);
  const scriptPaths = new Map<string, string>();
  for (const src of paths) {
    const scriptModules = await glob(`build/${src}/scripts/**/*.js`, { filesOnly: true })
    .then((files) => files.filter(isModule), (): string[] => []);
    for (const scriptModule of scriptModules) {
      const scriptName = path.basename(scriptModule, ".js");
      if (!scriptPaths.has(scriptName))
        scriptPaths.set(scriptName, scriptModule);
    }
  }
  if (!scripts.every((script) => scriptPaths.has(script))) {
    client.error(`Script(s) ${scripts.filter((script) => !scriptPaths.has(script)).map(chalk.cyan).join(", ")} not found.`, "core");
    return;
  }
  const scriptFns: ((client: Client) => void)[] = [];
  await Promise.all([
    ...paths.map(
      (src) => glob(`build/${src}/commands/**/*.js`, { filesOnly: true })
      .then((ls) => ls.filter(isModule), () => [])
      .then((commandModules) => Promise.all(
        commandModules.map(
          async (commandModule) => import(`../../${commandModule}`)
          .then(({ default: command }: DefImport<Command>) => client.commands.set(command.name, command))
        )
      ))
    ),
    ...paths.map(
      (src) => glob(`build/${src}/events/**/*.js`, { filesOnly: true })
      .then((ls) => ls.filter(isModule), () => [])
      .then((eventModules) => Promise.all(
        eventModules.map(
          async (eventModule) => import(`../../${eventModule}`)
          .then(({ default: event }: DefImport<EventListener>) => client.events.set(path.basename(eventModule, ".js"), event))
        )
      ))
    ),
    ...scripts.map(
      (script) =>
        import(`../../${scriptPaths.get(script)}`)
        .then(({ default: scriptFn }: DefImport<(client: Client) => void>) => scriptFns.push(scriptFn))
    ),
  ]);
  for (const [, listener] of client.events)
    client.on(listener.event, (...args) => listener.emit(client, ...args));
  await client.login(process.env[`${client.source}_TOKEN`]);
  await Promise.all(scriptFns.map((script) => script(client)));
  client.log("Done", "core.init");
}
