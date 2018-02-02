const Sequelize = require("sequelize");

module.exports = database => {
  const Product = database.define("product", {
    name: Sequelize.STRING,
    price: Sequelize.INTEGER,
    weight: Sequelize.INTEGER
  });

  const Order = database.define("order", {
    status: {
      type: Sequelize.ENUM("pending", "cancelled", "paid"),
      defaultValue: "pending"
    },
    shipment_amount: {
      type: Sequelize.INTEGER,
      defaultValue: 25
    },
    total_amount: Sequelize.INTEGER,
    total_weight: Sequelize.INTEGER
  });

  Order.hasMany(Product, { as: "ProductList" });

  const Bill = database.define("bill", {
    total_amount: Sequelize.INTEGER
  });

  return { Product, Bill, Order };
};
