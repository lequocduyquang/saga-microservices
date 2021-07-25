const db = require("../models");
const Order = db.orders;

exports.create = async (req, res) => {
  if (!req.body.name || !req.body.customer || !req.body.total_price) {
    res.status(400).send({
      message: "Order info must not empty"
    })
    return
  }
  const order = {
    name: req.body.name,
    customer: req.body.customer,
    total_price: req.body.total_price,
    status: 'ACTIVE'
  }
  try {
    const rs = await Order.create(order)
    res.status(201).send(rs)
  } catch (error) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred."
    });
  }
} 

exports.update = async (req, res) => {
  const { id } = req.params
  try {
    await Order.update({ status: 'INACTIVE' },{
      where: {
        id
      }
    })
    return res.status(200).send('Update successfully')
  } catch (error) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred."
    });
  }
}