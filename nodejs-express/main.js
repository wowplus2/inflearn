const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');

/* Middleware Setting ----------------------------------------------------- */
app.use(helmet());
app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
//app.use(bodyParser.json());
app.use(compression());

// GET방식 호출의 모든경우에 req.list의 변수에 fields값을 셋팅한다.
app.get('*', (req, res, next) => {
  fs.readdir('./data', (error, fields) => {
    req.list = fields;
    next();
  });
});
/* ------------------------------------------------------------------------ */

/* Define Routers -------------------------------------------------------- */
const root = require('./routes/root');
const topics = require('./routes/topic');

app.use('/', root);
app.use('/topic', topics);
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
