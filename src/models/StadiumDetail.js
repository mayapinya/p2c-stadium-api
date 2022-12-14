const { STADIUM_OPEN, STADIUM_CLOSE } = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const StadiumDetail = sequelize.define(
    'StadiumDetail',
    {
      stadiumName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      facility: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      openTime: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      closeTime: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      stadiumStatus: {
        type: DataTypes.ENUM(STADIUM_OPEN, STADIUM_CLOSE),
        allowNull: false,
        defaultValue: STADIUM_OPEN
      },
      image: {
        type: DataTypes.STRING
      }
    },
    { underscored: true }
  );

  StadiumDetail.associate = (db) => {
    StadiumDetail.hasMany(db.Booking, {
      foreignKey: {
        name: 'stadiumDetailId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return StadiumDetail;
};
