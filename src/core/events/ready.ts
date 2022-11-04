import EventListener from "@/structure/EventListener";
import chalk from "chalk";

export default new EventListener("ready", (client) => {
  client.log(`Logged in as ${chalk.green(client.user.tag)}`, "core.event.ready");
});
