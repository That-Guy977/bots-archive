import EventListener from "@/structure/EventListener";
import chalk from "chalk";

export default new EventListener("messageCreate", async (client, msg) => {
  if (msg.author.id !== client.getId("dev", "user")) return;
  const debug = msg.content.match(`^${client.user} debug ?([01]?)$`);
  if (!debug) return;
  const state = client.state.debug;
  client.state.debug = !debug[1] ? !state : debug[1] === "1";
  const change = state !== client.state.debug;
  await msg.react(change ? "\u{2705}" : "\u{2611}").catch(() => null);
  if (change) client.log(`Debug mode ${chalk.cyan(client.state.debug ? "on" : "off")}`, "core.event.debug");
});
