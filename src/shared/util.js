const fs = require('node:fs')
const path = require('node:path')
const files = fs.readdirSync('../util').filter((f) => f.endsWith('.js'))
for (const file of files)
  module.exports[path.basename(file, '.js')] = require(`../util/${file}`)
//-- change to static structure
