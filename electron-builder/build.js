'use strict'

process.env.NODE_ENV = 'production'
const del = require('del')
if (process.env.BUILD_TARGET === 'clean') clean()

function clean () {
  del.sync(['build/*', '!build/qmc_build', '!build/*.nsh', '!build/*.rtf', '!build/icons', '!build/icons/icon.*'])
  process.exit()
}
