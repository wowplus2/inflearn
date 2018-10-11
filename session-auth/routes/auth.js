const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const template = require('../lib/template');
const libauth = require('../lib/auth');

let authData = {
  email: 'wowplus2@gmail.com',
  password: '1111',
  nickname: 'wowplus'
};

router.get('/login', (req, res, next) => {
  let title = 'WEB - auth/login';
  let list = libauth.isLogined(req, res) ? template.list(req.list) : '';
  let body = libauth.isLogined(req, res)
    ? `<img src="/imgs/lion.png" style="width:300px;display:block;margin-top:10px;" />`
    : `<form action="/auth/login" method="post">
        <p><input type="text" name="email" id="email" placeholder="Input your email address." /></p>
        <p><input type="password" name="passwd" id="passwd" placeholder="Input your password" /></p>
        <p><input type="submit" value="LOG-IN"/></p>
    </form>`;
  let control = libauth.isLogined(req, res)
    ? `<a href="/topic/create">create</a>`
    : '';
  let html = template.HTML(title, list, body, control, '');
  res.send(html);
});

router.post('/login', (req, res, next) => {
  let post = req.body;

  let email = post.email;
  let pass = post.passwd;

  if (email === authData.email && pass === authData.password) {
    req.session.is_logined = true;
    req.session.nickname = authData.nickname;
    req.session.save(() => {
      res.redirect('/');
    });
  } else {
    res.send('Who??');
  }
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/');
  });
});

module.exports = router;
