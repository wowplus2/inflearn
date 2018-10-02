const express = require('express');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const sanitizeHtml = require('sanitize-html');
const template = require('./lib/template.js');

const app = express();

app.get('/', (req, res) => {
  fs.readdir('./node_modules', (error, fields) => {
    let title = 'Welcome';
    let desc = 'Hello, Node.js';
    let list = template.list(fields);
    let html = template.HTML(
      title,
      list,
      `<h2>${title}</h2>${desc}`,
      `<a href="/create">create</a>`
    );

    res.send(html);
  });
});

app.get('/page/:pageId', (req, res) => {
  fs.readdir('./data', (error, fields) => {
    let filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', (err, desc) => {
      let title = req.params.pageId;
      let sanitizedTitle = sanitizeHtml(title);
      let sanitizedDesc = sanitizeHtml(desc, {
        allowedTags: ['h1']
      });
      let list = template.list(fields);
      let html = template.HTML(
        sanitizedTitle,
        list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDesc}`,
        `<a href="/create">create</a>
                <a href="/update/${sanitizedTitle}">update</a>
                <form action="/delete" method="post">
                    <input type="hidden" name="id" value="${sanitizedTitle}" />
                    <input type="submit" value="delete" />
                </form>`
      );

      res.send(html);
    });
  });
});

app.get('/create', (req, res) => {
  fs.readdir('./data', (error, fields) => {
    let title = 'WEB - create';
    let list = template.list(fields);
    let html = template.HTML(
      title,
      list,
      `<form action="/create" method="post">
          <p><input type="text" name="title" placeholder="title" /></p>
          <p><textarea name="desc" placeholder="Description"></textarea></p>
          <p><input type="submit" /></p>
        </form>`,
      ''
    );

    res.send(html);
  });
});

app.post('/create', (req, res) => {
  let body = '';
  req.on('data', data => {
    body = body + data;
  });

  req.on('end', () => {
    let post = qs.parse(body);
    let title = post.title;
    let desc = post.desc;

    fs.writeFile(`data/${title}`, desc, 'utf8', err => {
      //res.writeHead(302, { Location: `/page/${title}` });
      //res.end();
      res.redirect(`/page/${title}`);
    });
  });
});

app.get('/update/:pageId', (req, res) => {
  fs.readdir('./data', (error, fields) => {
    let filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', (err, desc) => {
      let title = req.params.pageId;
      let list = template.list(fields);
      let html = template.HTML(
        title,
        list,
        `<form action="/update" method="post">
          <input type="hidden" name="id" value="${title}" />
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p><textarea name="desc" placeholder="Description">${desc}</textarea></p>
          <p><input type="submit" value="update" /></p>
        </form>`,
        `<a href="/create">create</a> <a href="/update/${title}">update</a>`
      );

      res.send(html);
    });
  });
});

app.post('/update', (req, res) => {
  let body = '';
  req.on('data', data => {
    body = body + data;
  });

  req.on('end', () => {
    let post = qs.parse(body);
    let id = post.id;
    let title = post.title;
    let desc = post.desc;

    fs.rename(`data/${id}`, `data/${title}`, err => {
      fs.writeFile(`data/${title}`, desc, 'utf8', err => {
        //res.writeHead(302, { Location: `/page/${title}` });
        //res.end();
        res.redirect(`/page/${title}`);
      });
    });
  });
});

app.post('/delete', (req, res) => {
  let body = '';

  req.on('data', data => {
    body = body + data;
  });

  req.on('end', () => {
    let post = qs.parse(body);
    let id = post.id;
    let filteredId = path.parse(id).base;

    fs.unlink(`data/${filteredId}`, error => {
      //res.writeHead(302, { Location: `/` });
      //res.end();
      res.redirect('/');
    });
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000...');
});
