import fs from "node:fs/promises";
import type Client from "@/structure/Client";

export default async function initState(client: Client): Promise<void> {
  client.log("Fetching state", "scripts.initState");
  client.state.current = await fs.readFile(`${client.path}/_state`, "utf8").catch(() => "");
}
