const admin = require('express').Router();
const adminCtrl = require('./admin.ctrl');
const authMiddleWare = require('../../middleware/auth');

admin.post('/is_allow', authMiddleWare, adminCtrl.isAllowBamboo); // 게시물 거절/수락
admin.get('/', authMiddleWare, adminCtrl.getNotAllowBamboo);// 승인 되지 않은 게시글 목록 조회
admin.delete('/', authMiddleWare, adminCtrl.deleteBamboo);// 게시글 삭제

module.exports = admin;
