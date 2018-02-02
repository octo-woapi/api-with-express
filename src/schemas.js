const Joi = require("joi");

module.exports = () => {
  const Product = Joi.object().keys({
    name: Joi.required(),
    price: Joi.required(),
    weight: Joi.required()
  });

  const Order = Joi.object().keys({
    product_list: Joi.array()
      .items(Joi.number())
      .required()
  });

  return { Order, Product };
};
