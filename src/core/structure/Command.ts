import type Client from "@/structure/Client";
import type { CommandPermissions } from "@/types";
import type {
  ApplicationCommandType,
  ApplicationCommandData,
  BaseApplicationCommandData,
  InteractionType,
  Interaction,
  LocalizationMap,
} from "discord.js";

export default abstract class Command<T extends ApplicationCommandType = ApplicationCommandType> {
  constructor(
    readonly name: string,
    readonly exec: (
      client: Client,
      interaction: Extract<Interaction, { type: InteractionType.ApplicationCommand; commandType: T }>
    ) => void,
    readonly guild: string | null,
    readonly permissions: CommandPermissions,
    readonly nameLocalizations: LocalizationMap,
  ) {}

  baseData(): BaseApplicationCommandData {
    return {
      name: this.name,
      nameLocalizations: this.nameLocalizations,
      dmPermission: this.permissions.dm ?? true,
      defaultMemberPermissions: this.permissions.default ?? null,
    };
  }

  abstract construct(): Extract<ApplicationCommandData, { type?: T }>;
}
