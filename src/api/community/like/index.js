const like = require('express').Router();
const likeCtrl = require('./like.ctrl');

like.post('/is_like', likeCtrl.isLike);

module.exports = like;
