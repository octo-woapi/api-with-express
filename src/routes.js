module.exports = app => {
  const services = app.get("services");

  app.use(services.utils.parseJSON);
  app.use(services.utils.logRequests);
  app.use(services.utils.enableCors);
  app.use(services.utils.returnApplicationJson);

  app.post("/products", services.products.create);
  app.get("/products", services.products.list);
  app.get("/products/:id", services.products.find);
  app.delete("/products", services.products.removeAll);

  app.post("/orders", services.orders.create);
  app.get("/orders", services.orders.list);
  app.get("/orders/:id", services.orders.find);
  app.delete("/orders", services.orders.removeAll);
  app.put("/orders/:id/status", services.orders.updateStatus);

  app.get("/bills", services.bills.list);
  app.delete("/bills", services.bills.removeAll);
};
