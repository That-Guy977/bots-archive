import init from "@/init";
import fileExists from "@/util/fileExists";
import fs from "node:fs/promises";
import "dotenv/config";
import type Client from "@/structure/Client";

const args = process.argv.slice(2);
const sources = await fs.readdir("src/custom");
if (args.length) {
  const source = args.shift()!;
  const scripts: string[] = await fs.readdir(`build/custom/${source}`).catch(() => []);
  if (sources.includes(source) || !scripts.includes("config.js"))
    if (args.every((script) => scripts.includes(`${script}.js`)))
      init(source, await Promise.all(args.map((script) => import(`../custom/${source}/${script}.js`) as Promise<(client: Client) => void>)));
    else throw new Error(`Script(s) ${scripts.filter((script) => !scripts.includes(script)).join(", ")} not found.`);
  else throw new Error(`Source ${source} not found.`);
} else for (const source of sources)
  if (await fileExists(`build/custom/${source}/config.js`))
    init(source);
