import { log } from "@/types";
import type Client from "@/structure/Client";
import type { ClientEvents } from "discord.js";

export default class EventListener<K extends keyof ClientEvents = keyof ClientEvents> {
  constructor(
    readonly event: K,
    readonly emit: (client: Client, ...args: ClientEvents[K]) => void
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars -- _args necessary for typing */
    = (client, ..._args): void => client.log(`Event ${event} emitted`, "event", log.DEBUG)
  ) {}
}
