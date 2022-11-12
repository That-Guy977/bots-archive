import ChatInputCommand from "@/structure/ChatInputCommand";
import setVanity from "@/jp101/util/setVanity";
import { GuildFeature } from "discord.js";
import chalk from "chalk";
const vanityCodeDefault = "jp101";

export default new ChatInputCommand({
  name: "invite",
  description: "Gives the invite link of the server.",
  guild: "",
}, (client, cmd) => {
  const { guild } = cmd;
  const permaInvite = `**Invite link of ${guild.name}**: https://discord.gg/7hvYKa4Zek\n`;
  const vanityInvite = (code: string): string => `Vanity invite: ${code}\n`;
  const redirect = `The invite link is also available in ${client.getChannel("rules")}.`;
  const hasVanity = guild.features.includes(GuildFeature.VanityURL);
  const vanityCode = guild.vanityURLCode;
  if (hasVanity && !vanityCode) {
    const warnNoAccess = (): void => client.warn(`Vanity invite ${chalk.cyan(vanityCodeDefault)} set failed.`, "jp101.command.invite");
    setVanity(client).catch(warnNoAccess);
  }
  cmd.reply(`${permaInvite}${hasVanity ? vanityInvite(vanityCode ?? "jp101") : ""}${redirect}`);
});
