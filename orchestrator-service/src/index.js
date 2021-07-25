const axios = require('axios')
const SagaBuilder = require('./saga/builder')

const seedProduct = {
  id: 2,
  name: 'Order 2',
  customer: 'Quang Le',
  total_price: 200000,
  status: 'ACTIVE'
}

async function runTransaction() {
  const sagaBuilder = new SagaBuilder()
    .route('ORDER_SERVICE')
      .invoke(async () => {
        await axios.post('http://localhost:3000/api/v1/orders', seedProduct)
      })
      .rollBack(async () => {
        await axios.put('http://localhost:3000/api/v1/orders/2', { status: 'INACTIVE' })
      })
    .route('INVENTORY_SERVICE')
      .invoke(async () => {
        await axios.put('http://localhost:4000/api/v1/products/1', { type: 'INVOKE' })
      })
      .rollBack(async () => {
        await axios.put('http://localhost:4000/api/v1/products/1', { type: 'ROLLBACK' })
      })
    .route('SHIPMENT_SERVICE')
      .invoke(async () => {
        // console.log('Create shipment...');
        throw new Error('Something wrong')
      })
      .rollBack(async () => {
        console.log('Roll back to Shipment Service API');
      });

  const sagaProcessor = await sagaBuilder.build()
  sagaProcessor.start({ id: 1 })
}

run()