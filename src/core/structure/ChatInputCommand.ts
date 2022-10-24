import Command from "@/structure/Command";
import { ApplicationCommandType } from "discord.js";
import type Client from "@/structure/Client";
import type { ChatInputCommandConfig } from "@/types";
import type {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  ApplicationCommandOptionData,
  LocalizationMap,
} from "discord.js";

export default class ChatInputCommand extends Command<ApplicationCommandType.ChatInput> {
  readonly descriptionLocalizations: LocalizationMap;

  constructor(
    name: string,
    readonly description: string,
    exec: (client: Client, interaction: ChatInputCommandInteraction) => void,
    readonly options: ApplicationCommandOptionData[] = [],
    {
      guild = null,
      permissions = {},
      nameLocalizations = {},
      descriptionLocalizations = {},
    }: ChatInputCommandConfig = {},
  ) {
    super(name, exec, guild, permissions, nameLocalizations);
    this.descriptionLocalizations = descriptionLocalizations;
  }

  construct(): ChatInputApplicationCommandData {
    return {
      type: ApplicationCommandType.ChatInput,
      ...this.baseData(),
      description: this.description,
      descriptionLocalizations: this.descriptionLocalizations,
      options: this.options,
    };
  }
}
