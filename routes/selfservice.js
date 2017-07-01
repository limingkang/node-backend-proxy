var express = require('express');
var router = express.Router();

//配置selfservice下面的所有请求
router.get('/', function(req, res, next) {
  res.send('success index');
});

router.get('/test', function(req, res, next) {
	console.log(req.query);
	var backdata=require('../backdata/selfservice_data').test;
  	res.json(backdata.success);
});

router.get('/test/:id', function(req, res, next) {
	console.log(req.params.id);
  	res.send('success test');
});

router.post('/login', function(req, res, next) {
  	console.log(req.body);
  	var backdata=require('../backdata/selfservice_data').login;
  	res.json(backdata.success);
});

module.exports = router;