import ChatInputCommand from "@/structure/ChatInputCommand";
import setState from "@/manju/util/setState";
import chalk from "chalk";
import { ApplicationCommandOptionType } from "discord.js";

export default new ChatInputCommand("set", "Set user reference", async (client, cmd) => {
  const { id } = cmd.options.getUser("user", true);
  if (id === client.user.id)
    client.commands.get("reset")!.exec(client, cmd);
  else if (id === client.state.current)
    client.commands.get("update")!.exec(client, cmd);
  else {
    const member = await cmd.guild!.members.fetch(id).catch(() => null);
    if (member) {
      await Promise.all([
        cmd.deferReply(),
        cmd.guild!.members.me!.setNickname(member.displayName),
        setState(client, id),
      ]);
      cmd.editReply(`Set state to ${member}`);
      client.debug(`Set state to ${chalk.green(member.displayName)} (${chalk.yellow(member.id)})`, "command.set");
    } else cmd.reply({ content: "Invalid member", ephemeral: true });
  }
}, "", [
  {
    name: "user",
    description: "Reset user reference",
    type: ApplicationCommandOptionType.User,
    required: true,
  },
]);

declare module "@/types" {
  interface ClientState {
    current?: string;
  }
}
