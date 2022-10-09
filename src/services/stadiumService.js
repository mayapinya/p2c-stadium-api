const { StadiumDetail } = require('../models');
const { STADIUM_OPEN } = require('../config/constants');

exports.getStadiumAll = async () => {
  const stadium = await StadiumDetail.findAll({
    where: { stadiumStatus: STADIUM_OPEN },
    order: [['updatedAt', 'ASC']]
  });
  return stadium;
};

exports.getStadiumById = async (stadiumId) => {
  const stadium = await StadiumDetail.findOne({
    where: { id: stadiumId },
    order: [['updatedAt', 'ASC']]
  });
  return stadium;
};
