import { Slash } from '../../shared/structures.js'

export const command = new Slash({
  name: "linktotop",
  desc: "Provides a message linking to the start of the channel.",
  isGlobal: false,
  enabled: false,
  test: true
})
