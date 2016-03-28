var express = require('express');
var router = express.Router();

router.index = function(req, res){
  res.render('index', { title: 'Index' });
};

router.login = function(req, res){
  res.render('login', {title: '用户登录'});
};

router.doLogin = function(req, res){
  var user={
    username:'admin',
    password:'admin'
  };
  if(req.body.username===user.username && req.body.password===user.password){
    req.session.user = user;
    console.log(2);
    return res.redirect('/home');
  }else{
    req.session.error='用户名或密码不正确';
    res.redirect('/login');
  }
}

router.logout = function(req, res){
  req.session.user=null;
  res.redirect('/');
};

router.home = function(req, res){
  res.render('home', { title: 'Home'});
};

module.exports = router;
