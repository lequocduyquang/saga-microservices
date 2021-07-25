const express = require('express')
const router = express.Router()

const OrderController = require('../controllers/order.controller')

router.post('/', OrderController.create)
router.put('/:id', OrderController.update)

module.exports = router