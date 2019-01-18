# Express Base API

## Overview
### Base projects capabilities:
  + Notifications (email, push notifications, webpush, slack, sms, and some more)
  + Authentication usind JWT (Remember to define SECRET_KEY when building docker image)
  + Tests
  + Steps to define new content types (models):
    1. Define new content type as model within models foldier. Checkout sequelize framework to see all available data types.
    2. Define new model dao services. NOTE: in order to use generic exception handling from sequelize each method must be wrapped with the queryWrapper method from dao/queryWrapper.js. **Example:**  ```module.exports = { addUser: queryWrapper (_addUser) }```
    3. Define new model api within api/vX/modelName/modelName.js (yes, a fodier first in case some utils are needed at model level).
    4. Add tests for new content type defined.
    5. [FIXME: comming soon!] Remember to update swagger with new api documentation.

## Setup
* ENV VARS
  | Vars | Values | Explanation |
  | --- | --- |
  | NOTIFME_CATCHER_OPTIONS | smtp://172.17.0.1:1025?ignoreTLS=true | In order to catch all notifications locally using notification-catcher daemon (npm install notificatin-catcher) set env var ```NOTIFME_CATCHER_OPTIONS``` before building the docker image (in the same line). **Example:** ```SECRET_KEY=mysecret NOTIFME_CATCHER_OPTIONS=smtp://172.17.0.1:1025?ignoreTLS=true docker-compose up -d --build``` |
  | APP_SETTINGS | "project.config.DevelopmentConfig" | |
  | SECRET_KEY | "someSuperSecretString" | Secret used to create JWTs |
  | MAIL_SERVER | **TODO** | **TODO** |
  | MAIL_PORT | 465 | **TODO** |
  | MAIL_USERNAME | **TODO**"my_email@my_email_domain.com" | Email client credentials needed to send emails |
  | MAIL_PASSWORD  | **TODO**"my_email_password" | Email client password needed to send emails |
  | MAIL_DEFAULT_SENDER | **TODO** "my_email@my_email_domain.com" | Email *from* field |
  | MAIL_USE_TLS | "False" | **TODO** |                                                                      
  | MAIL_USE_SSL | "True" | **TODO** |
  | LOG_LEVEL | "debug" | **TODO** |
  | LOGGLY_TOKEN | logglyToken | Loggly account [token](https://www.loggly.com/docs/token-based-api-authentication/) value |
  | LOGGLY_SUBDOMAIN | logglySubdomain | [Loggly subdomain](https://www.loggly.com/docs/token-based-api-authentication/) |
  | LOGGLY_TAG | logglyTag | [Loggly](https://www.loggly.com/plans-and-pricing/) |

**Notification catcher usage:**
  * Run notification-catcher outside docker images, and redirect notifications to your host using NOTIFME_CATCHER_OPTIONS env var. 
  Visit [notifme](https://www.npmjs.com/package/notifme-sdk) for more details regarding push notificatons. 
  * The ip of the host is the assigned to the virtual interface docker0
  * To get the ip run: ```ip addr | grep 'global docker0' | sed -e 's/:/ /' | awk '{print $2}'```

## Tests foldier structure
* tests/api (integration tests)
* tests/dao (dao unit tests)
* tests/stubs (simulate the behaviors of software components)
* tests/utils (tests for utils folider within source code)

## Api versioning
To maintain backward compatibility, a versioned rest API is defined using ```vX/``` as the first value of each URL path. To support many api versions, the code inside source ```/api/vX``` must be defined for each compatible version. Remember to update the routing statement within the main index.js file.

## Sequelize
* To see database setup refer to main base project (docker definitions FIXME: [#REF](http://definemeplease.com));

##Development tips:
* In order to avoid duplicated database exception handline code, queryWrapper module should be use to wrapp most common exception erros.

### Relation One-To-Many with CamelCase

To customize the foreign key in a one-to-many relation, it is essential to write the following code in both sides of the relation:

```javascript
{foreignKey: 'customizeKey'}
```

To see more, check [this](https://github.com/sequelize/sequelize/issues/2827#issuecomment-69709220) link.
