# Express Base API

## Overview
* Base projects capabilities:
  + Notifications (email, push notifications, webpush, slack, sms, and some more)
  + Authentication usind JWT (Remember to define SECRET_KEY when building docker image)
  + Tests


## Setup
* Set LOG_LEVEL to one of [debug, info, error]. Default=info.
* In order to catch all notifications localy using notification-catcher daemon (npm install notificatin-catcher) set env var NOTIFME_CATCHER_OPTIONS=smtp://127.0.0.1:3025?ignoreTLS=true before building the docker image (in the same line).
Example: SECRET_KEY=mysecret NOTIFME_CATCHER_OPTIONS=smtp://172.17.0.1:1025?ignoreTLS=true docker-compose up -d --build
**Notification catcher usage:**
  + Run notification-catcher outside docker images, and redirect notifications to your host using NOTIFME_CATCHER_OPTIONS env var. 
  Visit https://www.npmjs.com/package/notifme-sdk#4-send-a-notification for more details regarding push notificatons.
  + The ip of the host is the assigned to the virtual interface docker0
  + To get the ip run > ```ip addr | grep 'global docker0' | sed -e 's/:/ /' | awk '{print $2}'```
## Tests
Test are defined under tests foldier. 
* Suggested foldier structure:
  + tests:
    - api (integration tests)
    - dao (dao unit tests)
    - stubs (simulate the behaviors of software components)
    - utils (tests for utils folider within source code)

## Sequelize
In order to avoid duplicated database exception handline code, queryWrapper module should be use to wrapp most common exception erros.

### Relation One-To-Many with CamelCase

To customize the foreign key in a one-to-many relation, it is essential to write the following code in both sides of the relation:

```javascript
{foreignKey: 'customizeKey'}
```

To see more, check [this](https://github.com/sequelize/sequelize/issues/2827#issuecomment-69709220) link.
