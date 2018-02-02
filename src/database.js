const Sequelize = require("sequelize");

module.exports = (conf, env) => {
  let sequelize = undefined;
  if (env === "production") {
    sequelize = new Sequelize(conf.db.uri);
  } else {
    sequelize = new Sequelize(
      conf.db.database,
      conf.db.username,
      conf.db.password,
      conf.db.sequelize
    );
  }

  return sequelize;
};
