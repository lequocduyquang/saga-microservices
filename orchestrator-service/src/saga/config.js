const { Kafka, logLevel } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'saga-broker',
  brokers: ['pkc-lzvrd.us-west4.gcp.confluent.cloud:9092'],
  requestTimeout: 3000, // ** important
  logLevel: logLevel.ERROR,
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: 'HH4DO47AA5OWHILX',
    password: 'N2MgTnkZUikSbxJQF8EsJRU0J10BY6887aY9L6psVc8sPk/DVIGsCdTw4HqX2HIJ'
  },
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
})

module.exports = { kafka }