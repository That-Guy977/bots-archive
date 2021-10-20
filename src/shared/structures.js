const fs = require('node:fs')
const path = require('node:path')
const files = fs.readdirSync('../structures').filter((f) => f.endsWith('.js'))
for (const file of files)
  module.exports[path.basename(file, '.js')] = require(`../structures/${file}`)
//-- change to static structure
