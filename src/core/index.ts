import init from "@/init";
import fileExists from "@/util/fileExists";
import fs from "node:fs/promises";
import "dotenv/config";

const args = process.argv.slice(2);
const sources = await fs.readdir("src/custom");
if (args.length) {
  const source = args.shift()!;
  const debug = args[0] === "debug";
  if (debug) args.shift();
  if (sources.includes(source) && await fileExists(`build/custom/${source}/config.js`))
    init(source, args, debug);
  else throw new Error(`Source ${source} not found.`);
} else for (const source of sources)
  if (await fileExists(`build/custom/${source}/config.js`))
    init(source);
