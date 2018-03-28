const express = require("express");

const env = process.env.NODE_ENV || "development";

module.exports = async () => {
  const conf = require("./conf")(env);
  const logger = require("./src/logger")(conf);
  const database = require("./src/database")(conf, env);
  const models = require("./src/models")(database);

  await database.sync({});

  const schemas = require("./src/schemas");
  const exceptions = require("./src/services/exceptions");
  const services = require("./src/services")(
    logger,
    schemas,
    models,
    exceptions
  );
  const { route } = require("./src/routers")(services, exceptions);

  const app = express();

  route(app);

  return app;
};
