var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
   var backdata=require('../backdata/users_data');
   res.json(backdata.success);
});

router.get('/mysql', function(req, res, next) {
   var BaseModel=require('../mysql/base_sql_module');
   var baseModel=new BaseModel();
   var tableName="ae_user_role_related";
   var whereJson={
   	'and':[],
   	'or':[]
   };
   var fieldsArr=[];
   var orderByJson={};
   var limitArr=[];
   baseModel.find(tableName,whereJson,orderByJson,limitArr,fieldsArr,function(ret){
   		res.json(ret);    //没查到则返回空数组
   });
});

router.get('/mongodb', function(req, res, next) {
	var BaseModel=require('./mongodb/base_mongodb_module.js'),
	baseModel=new BaseModel();
	//查询所需参数
	var tableName="lmkone";
	var whereJson={'name':'limingkang'};
	var fieldsJson={'age':1,'name':1};
	var orderByJson={'age':1};
	var limitJson={'skip':1};
	baseModel.find(tableName,whereJson,orderByJson,limitJson,fieldsJson,function(ret){
		console.log(ret);    //没查到则返回空数组
	}); 
});

module.exports = router;
