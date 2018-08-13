# Express Base API

## Overview

## Setup

## Tests

## Sequelize
In order to avoid duplicated database exception handline code, queryWrapper module should be use to wrapp most common exception erros.

### Relation One-To-Many with CamelCase

To customize the foreign key in a one-to-many relation, it is essential to write the following code in both sides of the relation:

```javascript
{foreignKey: 'customizeKey'}
```

To see more, check [this](https://github.com/sequelize/sequelize/issues/2827#issuecomment-69709220) link.
