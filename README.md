# Express Base API

## Overview
### Base projects capabilities:
  + Notifications (email, push notifications, webpush, slack, sms, and some more)
  + Authentication usind JWT (Remember to define SECRET_KEY when building docker image)
  + Tests
  + Steps to define new content types (models):
    1. Define new content type as model within models foldier. Checkout sequelize framework to see all available data types.
    2. Define new model dao services. NOTE: in order to use generic exception handling from sequelize each method must be wrapped with the queryWrapper method from dao/queryWrapper.js.
      
      **Example:**  ```module.exports = { addUser: queryWrapper (_addUser) }```
    3. Define new model api within api/vX/modelName/modelName.js (yes, a fodier first in case some utils are needed at model level).
    4. Add tests for new content type defined.
    5. [FIXME: comming soon!] Remember to update swagger with new api documentation.

## Setup
* Set ```LOG_LEVEL``` to one of [debug, info, error]. Default=info.
* In order to catch all notifications locally using notification-catcher daemon (npm install notificatin-catcher) set env var ```NOTIFME_CATCHER_OPTIONS``` before building the docker image (in the same line).
**Example:** ```SECRET_KEY=mysecret NOTIFME_CATCHER_OPTIONS=smtp://172.17.0.1:1025?ignoreTLS=true docker-compose up -d --build```

**Notification catcher usage:**
* Run notification-catcher outside docker images, and redirect notifications to your host using NOTIFME_CATCHER_OPTIONS env var. Visit [notifme](https://www.npmjs.com/package/notifme-sdk) for more details regarding push notificatons.
* The ip of the host is the assigned to the virtual interface docker0
* To get the ip run > ```ip addr | grep 'global docker0' | sed -e 's/:/ /' | awk '{print $2}'```

## Tests foldier structure
* tests:
  + api (integration tests)
  + dao (dao unit tests)
  + stubs (simulate the behaviors of software components)
  + utils (tests for utils folider within source code)

## Api versioning
To maintain backward compatibility, a versioned rest API is defined using ```vX/``` as the first value of each URL path. To support many api versions, the code inside source ```/api/vX``` must be defined for each compatible version. Remember to update the routing statement within the main index.js file.

## Sequelize
* To see database settup refer to main base project (docker definitions FIXME: #REF);
* Development tips:
  + In order to avoid duplicated database exception handline code, queryWrapper module should be use to wrapp most common exception erros.

### Relation One-To-Many with CamelCase

To customize the foreign key in a one-to-many relation, it is essential to write the following code in both sides of the relation:

```javascript
{foreignKey: 'customizeKey'}
```

To see more, check [this](https://github.com/sequelize/sequelize/issues/2827#issuecomment-69709220) link.
