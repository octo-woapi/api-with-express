module.exports = app => {
  async function list(req, res) {
    const models = app.get("models");

    let billList = await models.Bill.findAll();
    res.status(200).send(billList);
  }

  async function removeAll(req, res) {
    const models = app.get("models");

    const billList = await models.Bill.findAll();
    billList.forEach(bill => bill.destroy());
    res.status(204).send();
  }

  return { list, removeAll };
};
