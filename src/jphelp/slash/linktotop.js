import { Client, Slash } from '../../shared/structures.js'

export const command = new Slash({
  name: "linktotop",
  desc: "Provides a message linking to the start of the channel.",
  isGlobal: false,
  enabled: false,
  permissions: [
    {
      id: Client.resolveId("mod", "roles", "jp101"),
      type: "ROLE",
      allow: true
    },
    {
      id: Client.resolveId("contributor", "roles", "jp101"),
      type: "ROLE",
      allow: true
    }
  ],
  test: true
})
