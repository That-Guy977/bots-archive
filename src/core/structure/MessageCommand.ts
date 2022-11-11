import Command from "@/structure/Command";
import { ApplicationCommandType } from "discord.js";
import type Client from "@/structure/Client";
import type { CommandConfig } from "@/types";
import type {
  MessageApplicationCommandData,
  MessageContextMenuCommandInteraction,
} from "discord.js";

export default class MessageCommand extends Command<ApplicationCommandType.Message> {
  constructor(
    name: string,
    exec: (client: Client, interaction: MessageContextMenuCommandInteraction<"cached">) => void,
    {
      guild = null,
      permissions = [],
      nameLocalizations = {},
    }: CommandConfig = {},
  ) {
    super(name, exec, guild, permissions, nameLocalizations);
  }

  construct(): MessageApplicationCommandData {
    return {
      type: ApplicationCommandType.Message,
      ...this.baseData(),
    };
  }
}
