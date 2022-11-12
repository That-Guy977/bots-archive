import type Client from "@/structure/Client";
import type {
  ApplicationCommandType,
  ApplicationCommandData,
  BaseApplicationCommandData,
  InteractionType,
  PermissionsString,
  Interaction,
  LocalizationMap,
} from "discord.js";

export default abstract class Command<T extends ApplicationCommandType = ApplicationCommandType> {
  constructor(
    readonly name: string,
    readonly exec: (
      client: Client,
      interaction: Extract<Interaction<"cached">, { type: InteractionType.ApplicationCommand; commandType: T }>
    ) => void,
    readonly guild: string | null,
    readonly permissions: PermissionsString[],
    readonly nameLocalizations: LocalizationMap,
  ) {}

  baseData(): BaseApplicationCommandData {
    return {
      name: this.name,
      nameLocalizations: this.nameLocalizations,
      dmPermission: false,
      defaultMemberPermissions: this.permissions,
    };
  }

  abstract construct(): Extract<ApplicationCommandData, { type?: T }>;
}
