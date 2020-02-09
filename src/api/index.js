const router = require('express').Router();

const auth = require('./auth');
const upload = require('./upload');
const bamboo = require('./bamboo');
const market = require('./market');
const admin = require('./admin');

const authMiddleware = require('../middleware/auth');

router.use('/auth', auth);
router.use('/upload', upload);
router.use('/bamboo', bamboo);
router.use('/market', market);
router.use('/admin', admin);

module.exports = router;
