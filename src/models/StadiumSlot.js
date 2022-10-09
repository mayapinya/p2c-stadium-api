module.exports = (sequelize, DataTypes) => {
  const StadiumSlot = sequelize.define(
    'StadiumSlot',
    {
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    { underscored: true }
  );

  StadiumSlot.associate = (db) => {
    StadiumSlot.belongsTo(db.Booking, {
      foreignKey: {
        name: 'bookingId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return StadiumSlot;
};
