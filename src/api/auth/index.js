const auth = require('express').Router();
const authCtrl = require('./auth.ctrl');

auth.post('/login', authCtrl.login);
auth.post('/register/member', authCtrl.registerAccount);
auth.post('/find/id', authCtrl.findId);
auth.post('/email', authCtrl.emailVerify);

module.exports = auth;
