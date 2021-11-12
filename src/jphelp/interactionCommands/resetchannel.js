import { Client, ApplicationCommand } from '../../shared/structures.js'

export const command = new ApplicationCommand({
  name: "resetchannel",
  desc: "Clones a channel to make space to remake the content.",
  isGlobal: false,
  isEnabled: false,
  permissions: [
    {
      id: Client.resolveId('mod', 'roles', 'jp101'),
      type: 'ROLE',
      allow: true
    },
    {
      id: Client.resolveId('contributor', 'roles', 'jp101'),
      type: 'ROLE',
      allow: true
    }
  ]
})
