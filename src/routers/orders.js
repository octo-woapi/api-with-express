module.exports = ({ orders }, { MissingResourceError }) => {
  return {
    async updateStatus(req, res) {
      const { id } = req.params;
      const { status } = req.body;
      try {
        await orders.updateStatus(id, status);
        res.status(200).send();
      } catch (e) {
        res.status(getStatusCode(e)).send({ data: e.data || e.message });
      }
    },

    async find(req, res) {
      const { id } = req.params;
      try {
        const order = await orders.find(id);
        res.status(200).send(order);
      } catch (e) {
        res.status(getStatusCode(e)).send({ data: e.data || e.message });
      }
    },

    async list(req, res) {
      const { sort } = req.query;
      try {
        const orderList = await orders.list(sort);
        res.status(200).send(orderList);
      } catch (e) {
        res.status(getStatusCode(e)).send({ data: e.data || e.message });
      }
    },

    async create(req, res) {
      const { body } = req;
      try {
        const id = await orders.create(body);
        res
          .set("Location", `/orders/${id}`)
          .status(201)
          .send();
      } catch (e) {
        res.status(getStatusCode(e)).send({ data: e.data || e.message });
      }
    },

    async removeAll(req, res) {
      try {
        await orders.removeAll();
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
