module.exports = models => {
  return { list, removeAll };

  async function list() {
    return await models.Bill.findAll();
  }

  async function removeAll() {
    const billList = await models.Bill.findAll();
    billList.forEach(bill => bill.destroy());
  }
};
