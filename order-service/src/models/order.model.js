module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define('order', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true 
    },
    name: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    },
    customer: {
      type: Sequelize.STRING
    },
    total_price: {
      type: Sequelize.INTEGER
    }
  })

  return Order
}