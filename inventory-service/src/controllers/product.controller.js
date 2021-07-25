const db = require("../models");
const Product = db.products;

exports.create = async (req, res) => {
  if (!req.body.name || !req.body.price || !req.body.amount) {
    res.status(400).send({
      message: "Product info must not empty"
    })
    return
  }
  const product = {
    name: req.body.name,
    price: req.body.price,
    amount: req.body.amount
  }
  try {
    const rs = await Product.create(product)
    res.status(201).send(rs)
  } catch (err) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred."
    });
  }
} 

exports.update = async (req, res) => {
  const { id } = req.params
  try {
    const foundProduct = await Product.findOne({ where: { id } })
    const currentAmount = foundProduct.amount
    if (req.body.type === 'ROLLBACK') {
      await Product.update({
        amount: currentAmount + 1
      }, {
        where: { id }
      })
      return res.status(200).send('Update successfully')
    } else {
      await Product.update({
        amount: currentAmount - 1
      }, {
        where: { id }
      })
      return res.status(200).send('Update successfully')
    }
    
  } catch (err) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred."
    });
  }
}