const fs = require('fs');
const AppError = require('../utils/appError');
const cloudinary = require('../utils/cloudinary');
const { StadiumDetail, sequelize } = require('../models');
const stadiumService = require('../services/stadiumService');

exports.create = async (req, res, next) => {
  try {
    const { stadiumName, price, facility, openTime, closeTime, image } =
      req.body;

    // if ((!title || !title.trim()) && !req.file) {
    //   throw new AppError('title or image is required', 400);
    // }

    // const data = { userId: req.user.id };
    // if (title && title.trim()) {
    //   data.title = title;
    // }
    // if (req.file) {
    //   data.image = await cloudinary.upload(req.file.path);
    // }

    const data = { stadiumName, price, facility, openTime, closeTime, image };

    const newStadium = await StadiumDetail.create(data);
    res.status(201).json({ newStadium });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.list = async (req, res, next) => {
  try {
    const stadiumAll = await stadiumService.getStadiumAll();
    res.status(200).json({ data: stadiumAll });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.detail = async (req, res, next) => {
  try {
    const { id: stadiumId } = req.params;
    const stadiumDetail = await stadiumService.getStadiumById(stadiumId);

    if (!stadiumDetail) {
      throw new AppError('cannot find stadium id', 400);
    }

    res.status(200).json({ data: stadiumDetail });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.updateDetail = async (req, res, next) => {
  try {
    // const { id: stadiumId } = req.body;
    const { id: stadiumId, ...updateValue } = req.body;
    await StadiumDetail.update(updateValue, { where: { id: stadiumId } });
    const stadiumData = await stadiumService.getStadiumById(stadiumId);
    res.status(200).json({ data: stadiumData });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};
