import EventListener from "@/structure/EventListener";

export default new EventListener("ready", (client) => {
  client.log(`Logged in as ${client.user.tag}`, "event.ready");
});
