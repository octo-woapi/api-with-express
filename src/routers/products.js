module.exports = ({ products }, { MissingResourceError }) => {
  return {
    async find(req, res) {
      const { id } = req.params;
      try {
        const product = await products.find(id);
        res.status(200).send(product);
      } catch (e) {
        res.status(getStatusCode(e)).send({ data: e.data || e.message });
      }
    },

    async list(req, res) {
      const { sort } = req.query;
      try {
        const productList = await products.list(sort);
        res.status(200).send(productList);
      } catch (e) {
        res.status(getStatusCode(e)).send({ data: e.data || e.message });
      }
    },

    async create(req, res) {
      const { body } = req;
      try {
        const id = await products.create(body);
        res
          .set("Location", `/products/${id}`)
          .status(201)
          .send();
      } catch (e) {
        res.status(getStatusCode(e)).send({ data: e.data || e.message });
      }
    },

    async removeAll(req, res) {
      try {
        products.removeAll();
        res.status(204).send();
      } catch (e) {
        res.status(getStatusCode(e)).send({ data: e.data || e.message });
      }
    }
  };

  function getStatusCode(error) {
    if (error instanceof MissingResourceError) {
      return 404;
    } else {
      return 400;
    }
  }
};
