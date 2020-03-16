const community = require('express').Router();
const communityCtrl = require('./community.ctrl');
const comment = require('./comment');
const like = require('./like');
const authMiddleWare = require('../../middleware/auth');

community.post('/', authMiddleWare, communityCtrl.writePost);
community.get('/kind', authMiddleWare, communityCtrl.getPostCategory);
community.get('/', authMiddleWare, communityCtrl.getPosts);
community.put('/', authMiddleWare, communityCtrl.updatePost);
community.delete('/', authMiddleWare, communityCtrl.deletePost);

community.use('/comment', authMiddleWare, comment);
community.use('/like', authMiddleWare, like);

module.exports = community;
