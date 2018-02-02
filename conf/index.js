const path = require("path");

module.exports = env => require(path.resolve(__dirname, env));
