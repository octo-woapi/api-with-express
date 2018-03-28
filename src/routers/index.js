module.exports = (services, exceptions) => {
  const productsRouter = require("./products")(services, exceptions);
  const ordersRouter = require("./orders")(services, exceptions);
  const billsRouter = require("./bills")(services, exceptions);

  return {
    route(app) {
      app.use(services.utils.parseJSON);
      app.use(services.utils.logRequests);
      app.use(services.utils.enableCors);
      app.use(services.utils.returnApplicationJson);

      app.post("/products", productsRouter.create);
      app.get("/products", productsRouter.list);
      app.get("/products/:id", productsRouter.find);
      app.delete("/products", productsRouter.removeAll);

      app.post("/orders", ordersRouter.create);
      app.get("/orders", ordersRouter.list);
      app.get("/orders/:id", ordersRouter.find);
      app.delete("/orders", ordersRouter.removeAll);
      app.put("/orders/:id/status", ordersRouter.updateStatus);

      app.get("/bills", billsRouter.list);
      app.delete("/bills", billsRouter.removeAll);
    }
  };
};
