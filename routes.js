const express = require('express')
const axios = require('axios')
const JPush = require('jpush-async').JPushAsync

const logger = require('./logger')
const config = require('./config')

const router = express.Router()
const jpush = JPush.buildClient(config.jpush.appKey, config.jpush.secret)

router.get('/', (req, res) => {
  res.write('Rocket.Chat PushGateway')
  res.end()
})

// see README: parameters from Rocket.Chat
router.post('/push/:service/send', async (req, res) => {
  const { params: { service }, body: { token, options } } = req
  const { title, badge, sound, topic, userId, uniqueId, notId, payload = { } } = options
  const text = config.msgMask || options.text
  const platform = service === 'apn' ? 'ios' : 'android'
  logger.info({
    service,
    platform,
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
  try {
    await jpush
      .push()
      .setPlatform(platform)
      .setAudience(JPush.registration_id(token))
      .setNotification(
        JPush.ios(`${ title }\n${ text }`, sound, badge, null, payload, options.apn.category),
        JPush.android(text, title, null, payload, 1, options.apn.category, 2),
      )
      .send()
  } catch ({ name, httpCode, response }) {
    logger.error({
      error: name,
      httpCode,
      response: response && JSON.parse(response),
    }, 'JPush Error')
  }
  res.write('')
  res.end()
})

module.exports = router
