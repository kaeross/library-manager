const Sequelize = require("sequelize");

module.exports = {
  "development": {
    "storage": "development.db",
    "dialect": "sqlite",
    "operatorsAliases": Sequelize.Op
  },
  "test": {
    "storage": "test.db",
    "dialect": "sqlite",
    "operatorsAliases": Sequelize.Op
  },
  "production": {
    "storage": "production.db",
    "dialect": "sqlite",
    "operatorsAliases": Sequelize.Op
  }
}
