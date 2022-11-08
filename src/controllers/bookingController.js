const fs = require('fs');
const AppError = require('../utils/appError');
const cloudinary = require('../utils/cloudinary');
const {
  Booking,
  StadiumSlot,
  StadiumDetail,
  User,
  sequelize
} = require('../models');
const stadiumService = require('../services/stadiumService');
const { BOOKING_CANCEL, BOOKING_SUCCESS } = require('../config/constants');
const { Op } = require('sequelize');

exports.create = async (req, res, next) => {
  try {
    const {
      userId,
      stadiumDetailId,
      priceTotal,
      timeTotal,
      adminId,
      timeSlots
    } = req.body;

    const dataBooking = {
      userId,
      stadiumDetailId,
      priceTotal,
      timeTotal,
      adminId: adminId ? adminId : null
    };

    const bookNew = await Booking.create(dataBooking);

    const dataStadiumSlots = timeSlots.map((slot) => {
      return {
        ...slot,
        bookingId: bookNew.id
      };
    });

    const stadiumSlotsNew = await StadiumSlot.bulkCreate(dataStadiumSlots);
    res.status(200).json({
      data: {
        ...bookNew,
        slots: stadiumSlotsNew
      }
    });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

function addHours(numOfHours, date = new Date()) {
  date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
  return date;
}

function findSlotTime(
  openStadium, //เวลา เปิดสนาม
  closedStadium, //เวลา ปิดสนาม
  stadiumData, // ข้อมูลสนาม
  slotsTimeBooking // ข้อมูลตารางที่จองไว้แล้ว
) {
  // let totalOpenStadium = 16; // สนามเปิด 16 ชั่วโมง 08.00 - 00.00

  // const parseDateStart = Date.parse(openStadium); //เวลาเปิด สนาม
  // const parseDateEnd = Date.parse('2022-10-22T23:59:59.000Z'); // เวลปิด สนาม

  // จำนวนชั่วโมง สนามเปิด 16 ชั่วโมง จากเวลาเปิด-ปิดสนาม 08.00 - 00.00
  let totalOpenStadium = +(
    Math.abs(
      new Date(openStadium).getTime() - new Date(closedStadium).getTime()
    ) / 36e5
  ).toFixed();

  let timeAllSlotInDay = [];
  for (let i = 0; i < totalOpenStadium; i++) {
    const start = addHours(i, new Date(openStadium));
    const end = addHours(i + 1, new Date(openStadium));

    let is_booking = false;
    // map ข้อมูลช่วงเวลาที่ว่างจากที่มีคนเคยจองแล้ว
    slotsTimeBooking.find((slot) => {
      const slotStart = slot.startTime.getTime();
      const slotEnd = slot.endTime.getTime();

      const startTime = start.getTime();
      const endTime = end.getTime();

      if (slotStart <= startTime && slotEnd >= endTime) {
        is_booking = true;
        return true;
      }
      return false;
    });

    timeAllSlotInDay.push({
      start: start.toISOString(),
      end: end.toISOString(),
      price: stadiumData.price,
      is_booking
    });
  }

  return timeAllSlotInDay;
}

exports.getSlots = async (req, res, next) => {
  try {
    // SELECT * FROM p2c_stadium_db.stadium_slots as ss
    // left join p2c_stadium_db.bookings as b
    // on ss.booking_id = b.id and b.stadium_detail_id = 1
    // where ss.start_time BETWEEN '2022-10-22 00:00:00' AND '2022-10-22 23:59:59'

    const { dayBooking, stadiumId } = req.body;

    if (!stadiumId) {
      throw new AppError('stadiumId is required', 400);
    }

    if (!dayBooking) {
      throw new AppError('dayBooking is required', 400);
    }

    let stadiumDetailId = stadiumId;

    // let opened = Date.parse(dayBooking);
    // let closed = addHours(24, new Date(opened)).toISOString();

    // console.log('opened', opened);
    // console.log('closed', closed);

    const stadiumData = await stadiumService.getStadiumById(stadiumDetailId);

    if (!stadiumData) {
      throw new AppError('stadiumId not found stadium data', 404);
    }

    // const openTimeStadium = Date.parse(dayBooking);

    const dateBooking = new Date(dayBooking)
      .toISOString()
      .substr(0, 19)
      .split('T')[0];

    const openTimeStadium = Date.parse(`${dateBooking}T08:00:00.000Z`);
    const closedTimeStadium = Date.parse(`${dateBooking}T23:59:59.000Z`);

    // const openTimeStadium = Date.parse('2022-10-22T08:00:00.000Z');
    // const closedTimeStadium = Date.parse('2022-10-22T23:59:59.000Z');

    const startedDate = new Date(openTimeStadium);
    const endDate = new Date(closedTimeStadium);

    const slotsTimeBooking = await StadiumSlot.findAll({
      attributes: ['id', 'startTime', 'endTime'],
      where: {
        startTime: { [Op.between]: [startedDate, endDate] },
        endTime: { [Op.between]: [startedDate, endDate] }
      },
      order: [['updatedAt', 'ASC']],
      include: [
        {
          model: Booking,
          where: { stadiumDetailId },
          attributes: ['stadiumDetailId']
        }
      ]
    });

    const timeAllSlotInDay = findSlotTime(
      openTimeStadium,
      closedTimeStadium,
      stadiumData.dataValues,
      slotsTimeBooking
    );

    res.status(200).json({ data: slotsTimeBooking, slots: timeAllSlotInDay });
  } catch (err) {
    next(err);
  } finally {
  }
};

exports.list = async (req, res, next) => {
  try {
    const bookingAll = await Booking.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: StadiumDetail,
          attributes: ['stadiumName']
        }
      ]
    });

    res.status(200).json({ data: bookingAll });
  } catch (err) {
    next(err);
  } finally {
  }
};

exports.detail = async (req, res, next) => {
  try {
    const { id: bookingId } = req.params;
    const bookingAll = await Booking.findOne({
      where: { userId: req.user.id, id: bookingId },
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'phoneNumber', 'email']
        },
        {
          model: StadiumDetail,
          attributes: ['stadiumName', 'price']
        },
        {
          model: StadiumSlot
        }
      ]
    });

    if (!bookingAll) {
      throw new AppError('cannot find booking id', 400);
    }

    res.status(200).json({ data: bookingAll });
  } catch (err) {
    next(err);
  } finally {
  }
};

exports.cancel = async (req, res, next) => {
  try {
    const { id: bookingId } = req.body;
    await Booking.update(
      {
        bookingStatus: BOOKING_CANCEL
      },
      { where: { id: bookingId } }
    );

    const bookingUpdated = await Booking.findOne({
      where: { id: bookingId },
      order: [['updatedAt', 'ASC']]
    });

    res.status(200).json({ data: bookingUpdated });
  } catch (err) {
    next(err);
  } finally {
  }
};

exports.getAllBooking = async (req, res, next) => {
  try {
    const bookingAll = await Booking.findAll({
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: StadiumDetail,
          attributes: ['stadiumName']
        }
      ]
    });

    res.status(200).json({ data: bookingAll });
  } catch (err) {
    next(err);
  } finally {
  }
};

exports.adminUpdateStatus = async (req, res, next) => {
  try {
    const { id: bookingId, bookingStatus } = req.body;
    console.log(req.user.id);
    await Booking.update(
      {
        bookingStatus,
        adminId: req.user.id
      },
      { where: { id: bookingId } }
    );

    const bookingUpdated = await Booking.findOne({
      where: { id: bookingId },
      order: [['updatedAt', 'ASC']]
    });

    res.status(200).json({ data: bookingUpdated });
  } catch (err) {
    next(err);
  } finally {
  }
};
