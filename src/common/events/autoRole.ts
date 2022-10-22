import EventListener from "@/structure/EventListener";

export default new EventListener("guildMemberAdd", (client, member) => {
  const config = client.config.autoRole;
  if (!config) return;
  if (member.guild.id !== client.getGuildId()) return;
  const roleName = !member.user.bot ? config.member : config.bot;
  const warnInvalid = (): void => client.error(`Role ${roleName} add failed.`, "event.autoRole");
  if (roleName) member.roles.add(client.getRole(roleName)).catch(warnInvalid);
});

declare module "@/types" {
  interface ClientConfig {
    autoRole?: {
      member?: string;
      bot?: string;
    };
  }
}
