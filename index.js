const express = require("express");

const env = process.env.NODE_ENV || "development";

module.exports = async () => {
  const app = express();

  const conf = require("./conf")(env);
  const logger = require("./src/logger")(conf);
  const database = require("./src/database")(conf, env);
  const models = require("./src/models")(database);
  const schemas = require("./src/schemas")();
  const services = require("./src/services")(app, logger, schemas, models);

  await database.sync({});

  app.set("schemas", schemas);
  app.set("models", models);
  app.set("env", env);
  app.set("logger", logger);
  app.set("services", services);
  app.set("conf", services);

  require("./src/routes")(app);

  return app;
};
