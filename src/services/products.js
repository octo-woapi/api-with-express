const Joi = require("joi");

module.exports = app => {
  async function create(req, res) {
    const schemas = app.get("schemas");
    const models = app.get("models");

    const { error } = Joi.validate(req.body, schemas.Product, {
      abortEarly: false
    });

    if (error) {
      const errorMessage = error.details.map(({ message, context }) =>
        Object.assign({ message, context })
      );
      return res.status(400).send({ data: errorMessage });
    }

    const product = await models.Product.create(req.body);
    res.set("Location", `/products/${product.id}`);
    res.status(201).send();
  }

  async function list(req, res) {
    const models = app.get("models");

    let productList = await models.Product.findAll();
    const { sort } = req.query;
    productList = productList.sort((a, b) => {
      if (a[sort] < b[sort]) return -1;
      if (a[sort] > b[sort]) return 1;
      return 0;
    });
    res.status(200).send(productList);
  }

  async function find(req, res) {
    const models = app.get("models");

    const { id } = req.params;
    const product = await models.Product.findById(id);
    if (!product) return res.status(404).send();
    return res.status(200).send(product.toJSON());
  }

  async function removeAll(req, res) {
    const models = app.get("models");

    const productList = await models.Product.findAll();
    productList.forEach(product => product.destroy());
    res.status(204).send();
  }

  return { find, list, create, removeAll };
};
