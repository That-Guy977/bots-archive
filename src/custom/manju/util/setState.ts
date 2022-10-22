import fs from "node:fs/promises";
import type Client from "@/structure/Client";

export default async function setState(client: Client, state: string): Promise<void> {
  client.state.current = state;
  await fs.writeFile(`${client.path}/_state`, state)
  .catch(() => client.warn("Failed to save state", "util.setState"));
}
