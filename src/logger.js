const bunyan = require("bunyan");

module.exports = conf => {
  const logLevel = process.env.LOG_LEVEL || "info";
  return bunyan.createLogger({ name: conf.appname, level: logLevel });
};
