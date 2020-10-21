const fs = require('fs')
const ini = require('ini')

if (!fs.existsSync('config.ini')) {
  console.error('config.ini is not found')
  process.exit(-1)
}

const config = ini.parse(fs.readFileSync('config.ini').toString())

const logger = {
  level: config.logger.level || 'info',
  stream: ![ '', '-', 'stdout' ].includes(config.logger.file) ? config.logger.file : process.stdout,
}

module.exports = {
  port: config.port || 8888,
  msgMask: config.msgMask,
  jpush: config.jpush,
  logger,
}
