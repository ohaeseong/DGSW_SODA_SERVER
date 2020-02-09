const bamboo = require('express').Router();
const bambooCtrl = require('./bamboo.ctrl');
const comment = require('./comment');
const authMiddleWare = require('../../middleware/auth');

bamboo.post('/', bambooCtrl.writePost);// 게시물 작성
bamboo.get('/', bambooCtrl.getAllowPost);// 승인된 게시물 목록 조회

bamboo.use('/comment', authMiddleWare, comment);

module.exports = bamboo;
