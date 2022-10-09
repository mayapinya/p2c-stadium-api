const express = require('express');

const stadiumController = require('../controllers/stadiumController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.route('/create').post(upload.single('image'), stadiumController.create);

router.get('/list', stadiumController.list);
router.get('/detail/:id', stadiumController.detail);
router.patch('/update-detail', stadiumController.updateDetail);

module.exports = router;
