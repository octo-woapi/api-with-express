const Joi = require("joi");

module.exports = {
  Product: Joi.object().keys({
    name: Joi.required(),
    price: Joi.required(),
    weight: Joi.required()
  }),

  Order: Joi.object().keys({
    product_list: Joi.array()
      .items(Joi.number())
      .required()
  })
};
