const cors = require("cors");
const bodyParser = require("body-parser");

module.exports = logger => {
  return {
    parseJSON: bodyParser.json(),
    logRequests: (req, res, next) => {
      logger.debug({
        method: req.method,
        host: req.headers.host,
        url: req.url,
        useragent: req.headers["user-agent"]
      });
      next();
    },
    enableCors: cors(),
    returnApplicationJson: (req, res, next) => {
      res.set("Content-Type", "application/json");
      next();
    }
  };
};
