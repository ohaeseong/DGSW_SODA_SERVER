const router = require('express').Router();
const imageCtrl = require('./image.ctrl');
const { uploadImgLocal } = require('../../../lib/upload');

router.route('/').post(uploadImgLocal, imageCtrl.uploadImgs);

module.exports = router;
