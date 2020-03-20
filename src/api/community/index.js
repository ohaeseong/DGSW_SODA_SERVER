const community = require('express').Router();
const communityCtrl = require('./community.ctrl');
const comment = require('./comment');
const like = require('./like');
const authMiddleWare = require('../../middleware/auth');

community.post('/', authMiddleWare, communityCtrl.writePost);
community.get('/kind', communityCtrl.getPostCategory);
community.get('/', communityCtrl.getPosts);
community.put('/', authMiddleWare, communityCtrl.updatePost);
community.delete('/', authMiddleWare, communityCtrl.deletePost);

community.use('/comment', authMiddleWare, comment);
community.use('/like', authMiddleWare, like);

module.exports = community;
