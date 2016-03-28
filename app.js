var express = require('express');
var routes = require('./routes/index');
var users = require('./routes/users');
var movie = require('./routes/movie');
var path = require('path');
var ejs = require('ejs');
var connect = require('connect');
var SessionStore = require("session-mongoose")(connect);

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var cookieSession = require('cookie-session');
var session = require('express-session');

var app = express();

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var store = new SessionStore({
  url: "mongodb://localhost/session",
  interval: 120000
});

app.engine('.html', ejs.__express);
app.set('view engine', 'html');// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// 配置cookie,必须放到路由配置之前
app.use(cookieSession({secret : 'fens.me'}));
app.use(session({
  secret: 'fens.me',
  store: store, // connect-mongo session store
  proxy: true,
  resave: true,
  saveUninitialized: true
}));

app.use(function(req, res, next){
  res.locals.user = req.session.user;
  next();
});


// 错误信息
app.use(function(req, res, next){
  res.locals.user = req.session.user;
  var err = req.session.error;
  delete req.session.error;
  res.locals.message = '';
  if (err) res.locals.message = '<div class="alert alert-error">' + err + '</div>';
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// 路由配置
app.get('/', routes.index);
app.all('/login', notAuthentication);
app.get('/login', routes.login);
app.post('/login', urlencodedParser, routes.doLogin);
app.get('/logout', authentication);
app.get('/logout', routes.logout);
app.get('/home', authentication);
app.get('/home', routes.home);

app.get('/movie/add',movie.movieAdd);//增加
app.post('/movie/add', movie.doMovieAdd);//提交
app.post('/movie/edit', movie.doMovieEdit);//编辑
app.get('/movie/search/',movie.search);//查询
app.post('/movie/search/',movie.search);//查询
app.get('/movie/:name',movie.movieAdd);//编辑查询
app.get('/movie/json/:name',movie.movieJSON);//JSON数据

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log('************************')
  console.log(err)
  console.log('************************')
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// 验证已登录
function authentication(req, res, next) {
  if(!req.session.user){
    req.session.error = '请先登录';
    return res.redirect('/login');
  }
  next();
}

// 验证未登录
function notAuthentication(req, res, next) {
  if(req.session.user){
    req.session.error = '已登录';
    return res.redirect('/home');
  }
  next();
}

module.exports = app;
