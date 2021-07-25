const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Shipment service is running on port ${PORT}`)
})