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
  const { params: { service }, body: { token, options }, headers } = req
  const { title, badge, sound, topic, userId, uniqueId, notId, payload = { } } = options
  const text = config.msgMask || options.text
  const platform = service === 'apn' ? 'ios' : 'android'
  const fields = {
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
  }
  if (!config.gateway || platform !== 'ios') {
    logger.info(fields, 'push notification')
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
  } else {
    logger.info(fields, 'forward notification')
    try {
      await axios.post(`${ config.gateway }/push/${ service }/send`, { token, options }, {
        headers: {
          authorization: headers.authorization,
        }
      })
    } catch ({ message, response = { } }) {
      const { status, data, headers } = response
      logger.error({
        message,
        status,
        fields,
        data,
        headers,
      }, 'forward notification error')
    }
  }
  res.write('')
  res.end()
})

module.exports = router
