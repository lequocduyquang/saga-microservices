const express = require('express')
const router = express.Router()

const ProductController = require('../controllers/product.controller')

router.post('/', ProductController.create)
router.put('/:id', ProductController.update)

module.exports = router