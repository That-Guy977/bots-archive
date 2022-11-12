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
  readonly description: string;
  readonly descriptionLocalizations: LocalizationMap;

  constructor(
    {
      name,
      description,
      guild = null,
      permissions = [],
      localizations = {},
    }: ChatInputCommandConfig,
    exec: (client: Client, interaction: ChatInputCommandInteraction<"cached">) => void,
    readonly options: ApplicationCommandOptionData[] = [],
  ) {
    super(name, exec, guild, permissions, localizations.name ?? {});
    this.description = description;
    this.descriptionLocalizations = localizations.description ?? {};
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
