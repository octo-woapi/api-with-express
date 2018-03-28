const Joi = require("joi");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = (
  schemas,
  models,
  { MissingResourceError, ValidationError }
) => {
  return {
    create,
    find,
    list,
    removeAll,
    updateStatus
  };

  async function create(data) {
    const { error } = Joi.validate(data, schemas.Order, {
      abortEarly: false
    });

    if (error) {
      const errorMessage = error.details.map(({ message, context }) =>
        Object.assign({ message, context })
      );

      throw new ValidationError(errorMessage);
    }

    const productList = await models.Product.findAll({
      where: {
        id: { [Op.in]: data.product_list.map(id => parseInt(id, 0)) }
      }
    });

    if (productList.length === 0) {
      throw new ValidationError([
        { message: "Unknown products", context: { key: "product_list" } }
      ]);
    }

    const productListData = productList.map(product => product.toJSON());

    const orderTotalWeight = productListData
      .map(p => p.weight)
      .reduce((prev, cur) => prev + cur, 0);

    const orderProductListPrice = productListData
      .map(p => p.price)
      .reduce((prev, cur) => prev + cur, 0);

    const SHIPMENT_PRICE_STEP = 25;
    const SHIPMENT_WEIGHT_STEP = 10;
    const orderShipmentPrice =
      SHIPMENT_PRICE_STEP * Math.round(orderTotalWeight / SHIPMENT_WEIGHT_STEP);

    let totalAmount = orderProductListPrice + orderShipmentPrice;

    const DISCOUNT_THRESHOLD = 1000;
    const DISCOUNT_RATIO = 0.95;
    if (totalAmount > DISCOUNT_THRESHOLD) {
      totalAmount = totalAmount * DISCOUNT_RATIO;
    }

    const orderData = Object.assign(
      {
        total_amount: totalAmount,
        shipment_amount: orderShipmentPrice,
        total_weight: orderTotalWeight
      },
      { product_list: data.product_list }
    );

    const { id } = await models.Order.create(orderData);
    return id;
  }

  async function list(sort) {
    let orderList = await models.Order.findAll();

    orderList = orderList.sort((a, b) => {
      if (a[sort] < b[sort]) return -1;
      if (a[sort] > b[sort]) return 1;
      return 0;
    });

    return orderList;
  }

  async function find(id) {
    const order = await models.Order.findById(id);
    if (!order) {
      throw new MissingResourceError();
    }
    return order.toJSON();
  }

  async function removeAll() {
    const orderList = await models.Order.findAll();
    orderList.forEach(order => order.destroy());
  }

  async function updateStatus(id, status) {
    const order = await models.Order.findById(id);
    if (!order) {
      throw new MissingResourceError();
    }

    if (!["pending", "paid", "cancelled"].includes(status)) {
      throw new ValidationError();
    }

    if (status === "paid") {
      models.Bill.create({ total_amount: order.toJSON().total_amount });
    }

    await order.update({ status });
  }
};
