export default class Event {
  constructor(
    name = 'ready',
    run = () => console.log(`Event ${name} triggered.`)
  ) {
    this.name = name
    this.run = run
  }
}
