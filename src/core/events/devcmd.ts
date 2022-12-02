import EventListener from "@/structure/EventListener";

export default new EventListener("messageCreate", (client, msg) => {
  if (msg.author.bot) return;
  const match = msg.content.match(`^${client.user} (\\w+)(?: +(.+))?$`);
  if (match) client.emit(`command-${match[1]}`, client, msg, match[2]?.split(/\s+/) ?? []);
});
