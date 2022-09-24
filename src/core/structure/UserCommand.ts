import Command from "@/structure/Command";
import { ApplicationCommandType } from "discord.js";
import type Client from "@/structure/Client";
import type { CommandConfig } from "@/types";
import type {
  UserContextMenuCommandInteraction,
  ApplicationCommandData,
} from "discord.js";

export default class UserCommand extends Command<UserContextMenuCommandInteraction> {
  constructor(
    name: string,
    exec: (client: Client, interaction: UserContextMenuCommandInteraction) => void,
    guild: string | null = null,
    {
      permissions = {},
      nameLocalizations = {},
    }: CommandConfig = {},
  ) {
    super(name, exec, guild, permissions, nameLocalizations);
  }

  construct(): ApplicationCommandData {
    return {
      type: ApplicationCommandType.User,
      ...this.baseData(),
    };
  }
}
