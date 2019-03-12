'use strict';
module.exports = (sequelize, DataTypes) => {
  var Prices = sequelize.define('Prices', {
    exchange: {
      type: DataTypes.STRING,
      allowNull: false
    },
    utc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
    }
  }, {});
  Prices.associate = function(models) {
    // associations can be defined here
    Prices.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    })
  };
  return Prices;
};