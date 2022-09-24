import type Client from "@/structure/Client";
import type { ClientEvents } from "discord.js";

export default class EventListener<K extends keyof ClientEvents = keyof ClientEvents> {
  constructor(
    readonly event: K,
    readonly emit: (client: Client, ...args: ClientEvents[K]) => void
    = (client, ..._args): void => client.log(`${event} emitted`, "event")
  ) {}
}
