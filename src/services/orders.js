const Joi = require("joi");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = app => {
  async function create(req, res) {
    const schemas = app.get("schemas");
    const models = app.get("models");

    const { error } = Joi.validate(req.body, schemas.Order, {
      abortEarly: false
    });

    if (error) {
      const errorMessage = error.details.map(({ message, context }) =>
        Object.assign({ message, context })
      );
      return res.status(400).send({ data: errorMessage });
    }

    const productList = await models.Product.findAll({
      where: {
        id: { [Op.in]: req.body.product_list.map(id => parseInt(id, 0)) }
      }
    });

    if (productList.length === 0) {
      return res.status(400).send({
        data: [
          { message: "Unknown products", context: { key: "product_list" } }
        ]
      });
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
      { product_list: req.body.product_list }
    );

    const order = await models.Order.create(orderData);
    res.set("Location", `/orders/${order.id}`);
    res.status(201).send();
  }

  async function list(req, res) {
    const models = app.get("models");

    let orderList = await models.Order.findAll();
    const { sort } = req.query;
    orderList = orderList.sort((a, b) => {
      if (a[sort] < b[sort]) return -1;
      if (a[sort] > b[sort]) return 1;
      return 0;
    });
    res.status(200).send(orderList);
  }

  async function find(req, res) {
    const models = app.get("models");

    const { id } = req.params;
    const order = await models.Order.findById(id);
    if (!order) return res.status(404).send();
    return res.status(200).send(order.toJSON());
  }

  async function removeAll(req, res) {
    const models = app.get("models");

    const orderList = await models.Order.findAll();
    orderList.forEach(order => order.destroy());
    res.status(204).send();
  }

  async function updateStatus(req, res) {
    const models = app.get("models");

    const { id } = req.params;
    const order = await models.Order.findById(id);
    if (!order) return res.status(404).send();

    const { status } = req.body;
    if (!["pending", "paid", "cancelled"].includes(status)) {
      return res.status(400).send();
    }

    if (status === "paid") {
      models.Bill.create({ total_amount: order.toJSON().total_amount });
    }

    await order.update({ status });

    return res.status(200).send();
  }

  return { create, find, list, removeAll, updateStatus };
};
