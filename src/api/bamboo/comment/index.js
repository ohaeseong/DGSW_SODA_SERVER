const comment = require('express').Router();
const commentCtrl = require('./comment.ctrl');

comment.post('/', commentCtrl.writeComment);// 게시물 댓글 작성
comment.get('/', commentCtrl.getComments);// 게시물 댓글 전체 조회
comment.delete('/', commentCtrl.deleteComment);// 게시물 댓글 삭제
comment.put('/', commentCtrl.updateComment);// 게시물 댓글 수정

module.exports = comment;
