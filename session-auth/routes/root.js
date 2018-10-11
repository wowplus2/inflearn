const express = require('express');
const router = express.Router();

const cookie = require('cookie');
const template = require('../lib/template');
const libauth = require('../lib/auth');

router.get('/', (req, res, next) => {
  let title = 'Welcome';
  let desc = 'Hello, Node.js';

  let list = template.list(req.list);
  let html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>${desc}
      <img src="/imgs/lion.png" style="width:300px;display:block;margin-top:10px;" />`,
    `<a href="/topic/create">create</a>`,
    libauth.uiStatus(req, res)
  );
  res.send(html);
});

module.exports = router;
