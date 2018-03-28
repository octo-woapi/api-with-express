module.exports = (logger, schemas, models, exceptions) => {
  return {
    bills: require("./bills")(models),
    products: require("./products")(schemas, models, exceptions),
    orders: require("./orders")(schemas, models, exceptions),
    utils: require("./utils")(logger)
  };
};
