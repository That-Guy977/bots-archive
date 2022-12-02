import DevCmd from "@/structure/DevCmd";
import chalk from "chalk";

export default new DevCmd("debug", async (client, msg, args) => {
  if (msg.author.id !== client.getId("dev", "user")) return;
  if (args.length > 1 || args.length && !["0", "1"].includes(args[0]!)) return;
  const state = client.state.debug;
  client.state.debug = !args[0] ? !state : args[0] === "1";
  const change = state !== client.state.debug;
  await msg.react(change ? "\u{2705}" : "\u{2611}").catch(() => null);
  if (change) client.log(`Debug mode ${chalk.cyan(client.state.debug ? "on" : "off")}`, "core.devcmd.debug");
});
