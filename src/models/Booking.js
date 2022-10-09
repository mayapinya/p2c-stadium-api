const {
  BOOKING_NOT_PAID,
  BOOKING_CANCEL,
  BOOKING_SUCCESS
} = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    'Booking',
    {
      bookingStatus: {
        type: DataTypes.ENUM(BOOKING_NOT_PAID, BOOKING_SUCCESS, BOOKING_CANCEL),
        allowNull: false,
        defaultValue: BOOKING_NOT_PAID
      },
      priceTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      timeTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    { underscored: true }
  );

  Booking.associate = (db) => {
    Booking.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    Booking.hasMany(db.StadiumSlot, {
      foreignKey: {
        name: 'BookingId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    Booking.belongsTo(db.StadiumDetail, {
      foreignKey: {
        name: 'stadiumDetailId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    Booking.belongsTo(db.Admin, {
      foreignKey: {
        name: 'adminId',
        allowNull: true
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return Booking;
};
