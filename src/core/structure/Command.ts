import type Client from "@/structure/Client";
import type { CommandPermissions } from "@/types";
import type {
  ApplicationCommandData,
  BaseApplicationCommandData,
  CommandInteraction,
  LocalizationMap,
} from "discord.js";

export default abstract class Command<T extends CommandInteraction = CommandInteraction> {
  constructor(
    readonly name: string,
    readonly exec: (client: Client, interaction: T) => void,
    readonly guild: string | null = null,
    readonly permissions: CommandPermissions = {},
    readonly nameLocalizations: LocalizationMap = {},
  ) {}

  baseData(): BaseApplicationCommandData {
    return {
      name: this.name,
      nameLocalizations: this.nameLocalizations,
      dmPermission: this.permissions.dm ?? true,
      defaultMemberPermissions: this.permissions.default ?? null,
    };
  }

  abstract construct(): ApplicationCommandData;
}
