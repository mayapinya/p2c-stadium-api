const express = require('express');

const stadiumController = require('../controllers/stadiumController');
const authenticate = require('../middlewares/authenticate');

const upload = require('../middlewares/upload');

const router = express.Router();

router.route('/create').post(stadiumController.create);
router.post(
  '/create-admin',
  authenticate,
  upload.single('image'),
  stadiumController.createByAdmin
);

router.patch(
  '/update-admin',
  authenticate,
  upload.single('image'),
  stadiumController.updateByAdmin
);

router.get('/list', stadiumController.list);
router.get('/all', stadiumController.all);
router.get('/detail/:id', stadiumController.detail);
router.patch('/update-detail', stadiumController.updateDetail);
router.patch(
  '/update-status',
  authenticate,
  upload.single('image'),
  stadiumController.updateStatusByAdmin
);

module.exports = router;
