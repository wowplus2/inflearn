const express = require('express');
const router = express.Router();

const cookie = require('cookie');
const template = require('../lib/template');

function authIsOwner(req, res) {
  let cookies = {};

  if (req.headers.cookie) {
    cookies = cookie.parse(req.headers.cookie);
  }
  return cookies.email === 'wowplus2@gmail.com' && cookies.password === '1111'
    ? true
    : false;
}

router.get('/', (req, res, next) => {
  let title = 'Welcome';
  let desc = 'Hello, Node.js';
  let isOwner = authIsOwner(req, res);
  let authStatusUi =
    isOwner === false
      ? '<a href="/login">login</a>'
      : '<a href="/logout">logout</a>';

  let list = template.list(req.list);
  let html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>${desc}
      <img src="/imgs/lion.png" style="width:300px;display:block;margin-top:10px;" />`,
    `<a href="/topic/create">create</a>`,
    authStatusUi
  );
  res.send(html);
});

router.get('/login', (req, res, next) => {
  let title = 'WEB - login';
  let html = template.LOGIN(
    title,
    '',
    `<form action="/login" method="post">
        <p><input type="text" name="email" id="email" placeholder="Input your email address." /></p>
        <p><input type="password" name="passwd" id="passwd" placeholder="Input your password" /></p>
        <p><input type="submit" value="LOG-IN"/></p>
    </form>`
  );
  res.send(html);
});

router.post('/login', (req, res, next) => {
  let post = req.body;

  let email = post.email;
  let passwd = post.passwd;

  if (email === 'wowplus2@gmail.com' && passwd === '1111') {
    res.writeHead(302, {
      'Set-Cookie': [
        `email=${email}`,
        `password=${passwd}`,
        `nickname=wowplus`
      ],
      Location: `/`
    });

    res.end();
  } else {
    res.end('Who??');
  }
});

router.get('/logout', (req, res, next) => {
  res.writeHead(302, {
    'Set-Cookie': [
      `email=; Max-Age=0`,
      `password=; Max-Age=0`,
      `nickname=; Max-Age=0`
    ],
    Location: `/`
  });

  res.end();
});

module.exports = router;
