const Joi = require("joi");

module.exports = (
  schemas,
  models,
  { MissingResourceError, ValidationError }
) => {
  return { find, list, create, removeAll };

  async function create(data) {
    const { error } = Joi.validate(data, schemas.Product, {
      abortEarly: false
    });

    if (error) {
      const errorMessage = error.details.map(({ message, context }) =>
        Object.assign({ message, context })
      );

      throw new ValidationError(errorMessage);
    }

    const { id } = await models.Product.create(data);

    return id;
  }

  async function list(sort) {
    let productList = await models.Product.findAll();

    productList = productList.sort((a, b) => {
      if (a[sort] < b[sort]) return -1;
      if (a[sort] > b[sort]) return 1;
      return 0;
    });

    return productList;
  }

  async function find(id) {
    const product = await models.Product.findById(id);
    if (!product) {
      throw new MissingResourceError();
    }

    return product.toJSON();
  }

  async function removeAll() {
    const productList = await models.Product.findAll();
    productList.forEach(product => product.destroy());
  }
};
