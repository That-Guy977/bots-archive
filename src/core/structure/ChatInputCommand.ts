import Command from "@/structure/Command";
import { ApplicationCommandType } from "discord.js";
import type Client from "@/structure/Client";
import type { ChatInputCommandConfig } from "@/types";
import type {
  ChatInputCommandInteraction,
  ApplicationCommandData,
  ApplicationCommandOptionData,
  LocalizationMap,
} from "discord.js";

export default class ChatInputCommand extends Command<ChatInputCommandInteraction> {
  readonly descriptionLocalizations: LocalizationMap;

  constructor(
    name: string,
    readonly description: string,
    exec: (client: Client, interaction: ChatInputCommandInteraction) => void,
    guild: string | null = null,
    readonly options: ApplicationCommandOptionData[] = [],
    {
      permissions = {},
      nameLocalizations = {},
      descriptionLocalizations = {},
    }: ChatInputCommandConfig = {},
  ) {
    super(name, exec, guild, permissions, nameLocalizations);
    this.descriptionLocalizations = descriptionLocalizations;
  }

  construct(): ApplicationCommandData {
    return {
      type: ApplicationCommandType.ChatInput,
      ...this.baseData(),
      description: this.description,
      descriptionLocalizations: this.descriptionLocalizations,
      options: this.options,
    };
  }
}
