const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const libauth = require('./lib/auth');

/* Middleware Setting ----------------------------------------------------- */
app.use(helmet());
app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
//app.use(bodyParser.json());
app.use(compression());

app.use(
  session({
    secret: 'secret-text',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
  })
);

// GET방식 호출의 모든경우에 req.list의 변수에 fields값을 셋팅한다.
app.get('*', (req, res, next) => {
  fs.readdir('./data', (error, fields) => {
    req.list = fields;
    next();
  });
});

function loginCheck(req, res, next) {
  return libauth.isLogined(req, res) ? next() : res.redirect('/auth/login');
}
/* ------------------------------------------------------------------------ */

/* Define Routers -------------------------------------------------------- */
const root = require('./routes/root');
const auth = require('./routes/auth');
const topics = require('./routes/topic');

app.use('/', root);
app.use('/auth', auth);
app.use('/topic', loginCheck, topics);
/* ------------------------------------------------------------------------ */

/* Error Handling --------------------------------------------------------- */
app.use((req, res, next) => {
  res.status(404).send('페이지를 찾을 수 없습니다.');
});

app.use((err, req, res, next) => {
  //console.log(err.stack);
  res
    .status(500)
    .send(
      `<div style="font-weight:600;">[500]Something broken!</div><div>${err}</div>`
    );
});
/* ------------------------------------------------------------------------ */

app.listen(3000, () => {
  console.log('Example app listening on port 3000...');
});
