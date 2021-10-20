const { Event } = require('../../shared/structures.js')

module.exports = new Event('rateLimit', (client, data) => {
  const str = `Rate limit hit at \`${data.method.toUpperCase()} ${data.path}\`\nLimited to \`${data.limit}\` requests. Rate limit ends in \`${data.timeout} ms\`.`
  console.log(str.replace(/`/g, ''))
  client.channel.send(str).catch(() => console.log(`Failed to send rate limit data to #${client.channel.name}.`))
})
