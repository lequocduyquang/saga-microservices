const { kafka } = require('./config')
const { STATUS } = require('./constants')


class SagaProcessor { 
  constructor(sagaDefinitions = []) {
    this.admin = kafka.admin()
    this.producer = kafka.producer()
    this.consumer = kafka.consumer({ groupId: 'saga-group' })
    this.sagaDefinitions = sagaDefinitions
  }

  async init() {
    try {
      await this.admin.connect()
      await this.producer.connect()
      await this.consumer.connect()

      const stepTopics = this.sagaDefinitions.map((definition) => definition.channelName);
      const kafkaTopics = stepTopics.map((topic) => ({topic, numPartitions : 1, replicationFactor : 3}));

      await this.admin.createTopics({ topics: kafkaTopics, waitForLeaders: true })

      console.log('Saga topics created successfully');

      for (let topic of stepTopics) {
        await this.consumer.subscribe({topic});
      }

      await this.consumer.run({
        eachMessage: async ({ topic, message, partition }) => {
          const sagaMessage = JSON.parse(message.value.toString())
          console.log('Saga message: ', sagaMessage)

          const { saga, payload } = sagaMessage
          const { index, phase } = saga


          switch (phase) {
            case STATUS.NEXT: {
              const stepForward = this.sagaDefinitions[index].phases[STATUS.NEXT].command;
              try {
                await stepForward();
                await this.goNext(index + 1, payload)
              } catch (e) {
                  await this.goBack(index - 1, payload)
              }
              return
            }
            case STATUS.BACK: {
              const stepBackward = this.sagaDefinitions[index].phases[STATUS.BACK].command;
              await stepBackward();
              await this.goBack(index - 1, payload);
              return;
            }
            default: {
              console.log('UNAVAILBLE SAGA PHASE')
            }
          }
        }
      })
    } catch (error) {
      console.error(`Error init ${error}`)
    }
  }

  async goNext(index, payload) {
    if (index >= this.sagaDefinitions.length) {
      console.log('Finished and transaction successful');
      return;
    }

    const message = {
      payload,
      saga: {
        index, 
        phase: STATUS.NEXT
      }
    }
    await this.producer.send({
      topic: this.sagaDefinitions[index].channelName,
      messages: [
        { value: JSON.stringify(message) }
      ]
    })
  }

  async goBack(index, payload) {
    if (index < 0) {
      console.log('Finished and transaction rolled back');
      return;
    }

    await this.producer.send({
      topic: this.sagaDefinitions[index].channelName,
      messages: [
        {
          value: JSON.stringify({
            payload, 
            saga: {
              index,
              phase: STATUS.BACK
            }
          })
        }
      ]
    })
  }

  async start(payload) {
    await this.goNext(0, payload)
    console.log('Start...')
  }
}

module.exports = SagaProcessor