const SagaProcessor = require('./processor')
const { STATUS } = require('./constants')

class SagaDefinitionBuilder {
  constructor() {
    this.index = null
    this.sagaDefinitions = []
  }

  route(channelName) {
    this.index = this.index === null ? 0 : this.index + 1
    this.sagaDefinitions = [
      ...this.sagaDefinitions,
      {
        channelName,
        phases: {}
      }
    ]
    return this
  }

  invoke(command) {
    if (this.index === null) {
      throw new Error('Something wrong')
    }
    this.sagaDefinitions[this.index].phases[STATUS.NEXT] = { command }
    return this
  } 
  
  rollBack(command) {
    if (this.index === null) {
      throw new Error('Something wrong')
    }
    this.sagaDefinitions[this.index].phases[STATUS.BACK] = { command }
    return this
  }

  async build() {
    const sagaProcessor = new SagaProcessor(this.sagaDefinitions);
    await sagaProcessor.init();
    return sagaProcessor;
  }
}

module.exports = SagaDefinitionBuilder