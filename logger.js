const bunyan = require('bunyan')

const config = require('./config')

const logger = bunyan.createLogger({
  name: 'app',
  streams: [ config.logger ],
})

module.exports = logger
