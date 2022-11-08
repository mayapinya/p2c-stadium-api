const express = require('express');

const bookingController = require('../controllers/bookingController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.route('/create').post(bookingController.create);

router.get('/list', authenticate, bookingController.list);
router.get('/detail/:id', authenticate, bookingController.detail);
router.patch('/cancel', authenticate, bookingController.cancel);
router.post('/slots', authenticate, bookingController.getSlots);
router.get('/all', authenticate, bookingController.getAllBooking);
router.patch('/status', authenticate, bookingController.adminUpdateStatus);

module.exports = router;
