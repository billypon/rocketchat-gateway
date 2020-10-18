const express = require('express')

const logger = require('./logger')
const config = require('./config')

const router = express.Router()

router.get('/', (req, res) => {
  res.write('Rocket.Chat PushGateway')
  res.end()
})

// see README: parameters from Rocket.Chat
router.post('/push/:service/send', async (req, res) => {
  const { params: { service }, body: { token, options } } = req
  const { title, badge, sound, topic, userId, uniqueId, notId, payload = { } } = options
  const text = config.msgMask || options.text
  logger.info({
    service,
    registerId: token,
    badge,
    sound,
    topic,
    userId,
    uniqueId,
    notId,
    payload: {
      messageId: payload.messageId,
      rid: payload.messageId,
      notificationType: payload.notificationType,
      type: payload.type,
      sender: payload.sender,
    },
  }, 'push notification')
  res.write('')
  res.end()
})

module.exports = router
