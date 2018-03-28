module.exports = ({ bills }) => {
  return {
    async list(req, res) {
      const billList = await bills.list();
      res.status(200).send(billList);
    },

    async removeAll(req, res) {
      bills.removeAll();
      res.status(204).send();
    }
  };
};
