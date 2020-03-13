const community = require('express').Router();
const communityCtrl = require('./community.ctrl');
const comment = require('./comment');
const authMiddleWare = require('../../middleware/auth');

community.post('/', authMiddleWare, communityCtrl.writePost);
community.get('/kind', authMiddleWare, communityCtrl.getPostCategory);
community.get('/', authMiddleWare, communityCtrl.getPosts);
community.put('/', authMiddleWare, communityCtrl.updatePost);
community.delete('/', authMiddleWare, communityCtrl.deletePost);


community.use('/comment', authMiddleWare, comment);

module.exports = community;
