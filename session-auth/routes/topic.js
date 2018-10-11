const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template');
const libauth = require('../lib/auth');

router.get('/create', (req, res, next) => {
  let title = 'WEB - create';
  let list = template.list(req.list);
  let html = template.HTML(
    title,
    list,
    `<form action="/topic/create" method="post">
            <p><input type="text" name="title" placeholder="title" /></p>
            <p><textarea name="desc" placeholder="Description"></textarea></p>
            <p><input type="submit" /></p>
          </form>`,
    '',
    libauth.uiStatus(req, res)
  );
  res.send(html);
});

router.post('/create', (req, res, next) => {
  let post = req.body;

  let title = post.title;
  let desc = post.desc;

  fs.writeFile(`data/${title}`, desc, 'utf8', err => {
    if (err) {
      next(err);
    } else {
      res.redirect(`/topic/${title}`);
    }
  });
});

router.post('/delete', (req, res, next) => {
  let post = req.body;

  let id = post.id;
  let filteredId = path.parse(id).base;

  fs.unlink(`data/${filteredId}`, err => {
    if (err) {
      next(err);
    } else {
      res.redirect('/');
    }
  });
});

router.post('/update', (req, res, next) => {
  let post = req.body;

  let id = post.id;
  let title = post.title;
  let desc = post.desc;

  fs.rename(`data/${id}`, `data/${title}`, err => {
    if (err) {
      next(err);
    } else {
      fs.writeFile(`data/${title}`, desc, 'utf8', err => {
        if (err) {
          next(err);
        } else {
          res.redirect(`/topic/${title}`);
        }
      });
    }
  });
});

router.get('/update/:pageId', (req, res, next) => {
  let filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', (err, desc) => {
    if (err) {
      next(err);
    } else {
      let title = req.params.pageId;
      let list = template.list(req.list);
      let html = template.HTML(
        title,
        list,
        `<form action="/topic/update" method="post">
            <input type="hidden" name="id" value="${title}" />
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p><textarea name="desc" placeholder="Description">${desc}</textarea></p>
            <p><input type="submit" value="update" /></p>
        </form>`,
        `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`,
        libauth.uiStatus(req, res)
      );
      res.send(html);
    }
  });
});

router.get('/:pageId', (req, res, next) => {
  let filteredId = path.parse(req.params.pageId).base;

  fs.readFile(`data/${filteredId}`, 'utf8', (err, desc) => {
    if (err) {
      next(err);
    } else {
      let title = req.params.pageId;
      let sanitizedTitle = sanitizeHtml(title);
      let sanitizedDesc = sanitizeHtml(desc, {
        allowedTags: ['h1']
      });
      let list = template.list(req.list);
      let html = template.HTML(
        sanitizedTitle,
        list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDesc}`,
        `<a href="/topic/create">create</a>
        <a href="/topic/update/${sanitizedTitle}">update</a>
        <form action="/topic/delete" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}" />
            <input type="submit" value="delete" />
        </form>`,
        libauth.uiStatus(req, res)
      );
      res.send(html);
    }
  });
});

module.exports = router;
