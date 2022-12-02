import DevCmd from "@/structure/DevCmd";
import chalk from "chalk";
import { PermissionFlagsBits } from "discord.js";

export default new DevCmd("end", async (client, msg, args) => {
  if (!msg.member?.permissions.has(PermissionFlagsBits.ManageGuild)) return;
  await msg.react("\u{2705}").catch(() => null);
  client.log(`Ended by ${chalk.green(msg.author.tag)} (${chalk.yellow(msg.author.id)})${args.length ? ` with reason: ${chalk.cyan(args.join(" "))}` : ""}`, "core.devcmd.end");
  client.destroy();
});
