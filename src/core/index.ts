import init from "@/init";
import fileExists from "@/util/fileExists";
import fs from "node:fs/promises";
import "dotenv/config";

const args = process.argv.slice(2);
const debug = args[0] === "--debug";
if (debug) args.shift();
const run = args[0] === "--run" || !args.length;
const sources = await fs.readdir("src/custom");
if (run) {
  args.shift();
  if (args.length) {
    const exists = await Promise.all(args.map(sourceValid));
    if (exists.every((e) => e))
      for (const source of args)
        init(source);
    else throw new Error(`Source(s) ${args.filter((_source, i) => !exists[i]).join(", ")} not found.`);
  } else for (const source of sources)
    if (await sourceValid(source))
      init(source);
} else {
  const source = args.shift()!;
  if (await sourceValid(source))
    init(source, args, debug);
  else throw new Error(`Source ${source} not found.`);
}

async function sourceValid(source: string): Promise<boolean> {
  return sources.includes(source) && await fileExists(`build/custom/${source}/config.js`);
}
