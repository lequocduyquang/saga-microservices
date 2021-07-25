const express = require('express')
const productRoute = require('./src/routes/product.route')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1/products', productRoute)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Inventory service is running on port ${PORT}`)
})