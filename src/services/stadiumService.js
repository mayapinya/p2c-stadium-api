const { StadiumDetail } = require('../models');
const { STADIUM_OPEN } = require('../config/constants');

exports.getStadiumOpen = async () => {
  const stadium = await StadiumDetail.findAll({
    where: { stadiumStatus: STADIUM_OPEN }
  });
  return stadium;
};

exports.getStadiumAll = async () => {
  const stadium = await StadiumDetail.findAll();
  return stadium;
};

exports.getStadiumById = async (stadiumId) => {
  const stadium = await StadiumDetail.findOne({
    where: { id: stadiumId }
  });
  return stadium;
};
