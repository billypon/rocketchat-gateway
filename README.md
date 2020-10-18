## config

| name | remark |
| --- | --- |
| port | listening port |
| msgMask | replace message content with this mask |

## parameters from Rocket.Chat

* req.params.service: apn/gcm
* req.headers.authorization
* req.body.token
* req.body.options

## options of req.body

```json
{
  "createdAt": "197-01-01T00:00:00.000Z",
  "createdBy": "<SERVER>",
  "sent": false,
  "sending": 0,
  "from": "push",
  "title": "admin",
  "text": "hello",
  "userId": "h3xHgjQk9eXCjCoQt",
  "payload": {
    "host": "https://your.domain.com/",
    "messageId": "a2Bh3THbxsobnvXH9",
    "notificationType": "message",
    "rid": "BhEwGa7LYsqxaCrC3h3xHgjQk9eXCjCoQt",
    "sender": {
      "_id": "BhEwGa7LYsqxaCrC3",
      "username": "admin",
      "name": "admin"
    },
    "senderName": "admin",
    "type": "d"
  },
  "badge": 1,
  "sound": "default",
  "notId": -427272375,
  "apn": {
    "category": "MESSAGE"
  },
  "gcm": {
    "image": "https://your.domain.com/images/logo/android-chrome-192x192.png",
    "style": "inbox"
  },
  "topic": "chat.rocket.ios",
  "uniqueId": "9dNd4jrrjSJQcFXqz"
}
```
