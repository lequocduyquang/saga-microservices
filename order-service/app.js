const express = require('express')
const orderRoute = require('./src/routes/order.route')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1/orders', orderRoute)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Order service is running on port ${PORT}`)
})