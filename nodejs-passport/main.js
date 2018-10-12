const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');
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
// flash message
app.use(flash());
app.get('/flash', (req, res) => {
  req.flash('info', 'Flash is back!');
  //return res.redirect('/');
  return res.send('flash');
});

app.get('/flash-display', (req, res) => {
  let fmsg = req.flash();
  console.log('fmsg: ', fmsg);
  res.send(fmsg);
});

let authData = {
  email: 'wowplus2@gmail.com',
  password: '1111',
  nickname: 'wowplus'
};

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log('passport.serializeUser: ', user);
  return done(null, user.email);
});

passport.deserializeUser(function(id, done) {
  console.log('passport.deserializeUser: ', id);
  return done(null, authData);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'passwd'
    },
    (username, password, done) => {
      //console.log('LocalStrategy:', username, password);
      if (username === authData.email) {
        if (password === authData.password) {
          done(null, authData);
        } else {
          done(null, false, { message: 'Incorrect password.' });
        }
      } else {
        done(null, false, { message: 'Incorrect username.' });
      }
    }
  )
);

app.post(
  '/auth/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
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
  return libauth.isLogined(req, res)
    ? next()
    : res.redirect('/auth/login').end();
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
  return res.status(404).send('페이지를 찾을 수 없습니다.');
});

app.use((err, req, res, next) => {
  //console.log(err.stack);
  return res
    .status(500)
    .send(
      `<div style="font-weight:600;">[500]Something broken!</div><div>${err}</div>`
    );
});
/* ------------------------------------------------------------------------ */

app.listen(3000, () => {
  console.log('Example app listening on port 3000...');
});
