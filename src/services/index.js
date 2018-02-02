module.exports = (app, logger, schemas, models) => {
  return {
    utils: require("./utils")(logger),
    bills: require("./bills")(app, schemas, models),
    products: require("./products")(app, schemas, models),
    orders: require("./orders")(app, schemas, models)
  };
};
