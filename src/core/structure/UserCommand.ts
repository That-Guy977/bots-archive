import Command from "@/structure/Command";
import { ApplicationCommandType } from "discord.js";
import type Client from "@/structure/Client";
import type { CommandConfig } from "@/types";
import type {
  UserApplicationCommandData,
  UserContextMenuCommandInteraction,
} from "discord.js";

export default class UserCommand extends Command<ApplicationCommandType.User> {
  constructor(
    name: string,
    exec: (client: Client, interaction: UserContextMenuCommandInteraction<"cached">) => void,
    {
      guild = null,
      permissions = [],
      nameLocalizations = {},
    }: CommandConfig = {},
  ) {
    super(name, exec, guild, permissions, nameLocalizations);
  }

  construct(): UserApplicationCommandData {
    return {
      type: ApplicationCommandType.User,
      ...this.baseData(),
    };
  }
}
