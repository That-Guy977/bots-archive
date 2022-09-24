import Command from "@/structure/Command";
import { ApplicationCommandType } from "discord.js";
import type Client from "@/structure/Client";
import type { CommandConfig } from "@/types";
import type {
  MessageContextMenuCommandInteraction,
  ApplicationCommandData,
} from "discord.js";

export default class MessageCommand extends Command<MessageContextMenuCommandInteraction> {
  constructor(
    name: string,
    exec: (client: Client, interaction: MessageContextMenuCommandInteraction) => void,
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
      type: ApplicationCommandType.Message,
      ...this.baseData(),
    };
  }
}
