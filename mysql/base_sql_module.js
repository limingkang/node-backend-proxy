// @type class BaseModel
// @name limingakng
// @time 2016/7/14
// @desc detal data

var read_config=require('./sql_config'),
    mysql=require('mysql'),
    dbClient;
module.exports=function(){
	__constructor();
	// 数据查询接口,只返回一条json数据，而不是一个数组，所以要将数组转化为单条数据,select返回的是一个数组，只是数组里面只有一条数据而已
	this.findOneById=function(tableName,idJson,callback){
		dbClient.query('select * from '+tableName+' where ?',idJson,function(err,results){
			if (err) {
				console.log(err.message);
				dbClient.end();
				callback(false);
			}else{
				if (results) {    //如果查询到数据则返回一条数据
					callback(results.pop());
				}else{
					callback(results);
				}
			}
		});
	};
	//数据插入接口
	this.insert=function(tableName,rowInfo,callback){
		dbClient.query('insert into '+tableName+ ' set ?',rowInfo,function(err,result){  //mysql的?字符会将rowinfo的json数据转化为key=value的形式
			if (err) throw err;
			callback(result.insertId);
		});
	};
	// 数据修改接口
	this.modify=function(tableName,idJson,rowInfo,callback){    //注意这里有两个问号，那么其对应的参数必须和数组里面一一对应，及第一问号对应数组第一个元素，一次类推
		dbClient.query('update '+tableName+' set ? where ?',[rowInfo,idJson],function(err,result){
			if (err) {
				console.log(err.message);
				callback(false);
			}else{
				callback(result);
			}
		});
	};
	//数据删除接口
	this.remove=function(tableName,idJson,callback){
		dbClient.query('delete from '+tableName+ ' where ?',idJson,function(err,results){  //mysql的?字符会将rowinfo的json数据转化为key=value的形式
			if (err) {
				console.log(err.message);
				dbClient.end();
				callback(false);
			}else{
				callback(true);
			}
		});
	};
	
	// @desc 数据条件查询接口
	// @param tableName string
	// @param whereJson json desc(and和or区别，其中的条件为key值、连接符大于小于还是等于value值)
	        // 可以这样设计whereJson={
	        // 	'and':[{'key':'book_name','opts':'=','value':'nodejs'},
	        // 	       {'key':'author','opts':'=','value':'limingakng'}],
	        // 	'or':[{'key':'id','opts':'<','value':10}]
	        // }
	// @param orderByJson json desc({'key':'time','type':'desc'}) 分别对应排序键名和排序方法有desc(降序)和asc(升序)两种
	// @param limitArr array desc(第一个元素是返回偏移量，第二个元素是返回数量，如果为空则返回全部)该参数是两个元素的数组,第一个表示需要的条数从第几条开始(0表示从第一条开始)，后一个参数表示去几条记录
	// @param fieldsArr array desc(返回哪些字段，就是你设计表的时候那些字段)
	this.find=function(tableName,whereJson,orderByJson,limitArr,fieldsArr,callback){
		var andWhere=whereJson['and'],
		    orWhere=whereJson['or'],
		    andArr=[],
		    orArr=[];
		// 将数组中的对象转换成串，就像一条语句一样
		for (var i = 0; i < andWhere.length; i++) {
			andArr.push(andWhere[i]['key']+andWhere[i]['opts']+andWhere[i]['value']);
		}
		for (var i = 0; i < orWhere.length; i++) {
			orArr.push(orWhere[i]['key']+orWhere[i]['opts']+orWhere[i]['value']);
		}
		// 判断条件是否存在，如果存在则转换为相应的添加语句
		var fieldsStr=fieldsArr.length>0?fieldsArr.join(','):'*',
		    andStr=andArr.length>0?andArr.join(' and '):'',
		    orStr=orArr.length>0?' or '+orArr.join(' or '):'',
		    limitStr=limitArr.length>0?' limit '+limitArr.join(','):'',
		    orderStr=orderByJson>0? ' order by '+orderByJson['key']+' '+orderByJson['type']:'';
		if (andStr=='' && orStr=='' && limitStr=='' && orderStr=='') {
			var sql='select '+fieldsStr+' from '+tableName
		}else{
			var sql='select '+fieldsStr+' from '+tableName+' where '+andStr+orStr+orderStr+limitStr;
		}
		console.log(sql);
		dbClient.query(sql,function(err,results){
			if (err) {
				console.log(err.message);
				dbClient.end();
				callback(false);
			}else{
				callback(results);
			}
		});
	};

	function __constructor(){
		var dbconfig=read_config.sql;    //获取配置文件中mysql的配置信息
		client={};
		client.host=dbconfig['host'];
		client.port=dbconfig['port'];
		client.user=dbconfig['user'];
		client.password=dbconfig['password'];

		// 创建mysql连接
		dbClient=mysql.createConnection(client);
		dbClient.connect();
		dbClient.query('use '+dbconfig['dbName'],function(err,results){
			if (err) {
				console.log(1111111);
				console.log(err.message);
				dbClient.end();
			}
			console.log('connect mysql success');
		});
	}
}







// 引用方法
//mysql -h localhost -u root -p
//123456
//mysql数据库接口设计
// var BaseModel=require('./mysql/base_model.js');
// var baseModel=new BaseModel();
// var tableName="lmkone";
// // var rowinfo={};
// // rowinfo.name="node.modify";
// // rowinfo.degree=23.23;
// // var idJson={'id':4};
// // baseModel.insert(tableName,rowinfo,function(ret){
// // 	console.log(ret);
// // });
// // baseModel.findOneById(tableName,idJson,function(ret){
// // 	console.log(ret);
// // });
// // baseModel.modify(tableName,idJson,rowinfo,function(ret){
// // 	console.log(ret);
// // });
// // baseModel.remove(tableName,idJson,function(ret){
// // 	console.log(ret);
// // });

// // 查询所需参数必须都写上
// var whereJson={
// 	'and':[{'key':'id','opts':'=','value':10},
// 	       {'key':'name','opts':'=','value':'"lmkfirst"'}],
// 	'or':[{'key':'id','opts':'>','value':10}]
// };
// var fieldsArr=['id','name','degree'];
// var orderByJson={'key':'id','type':'desc'};
// var limitArr=[0,10];
// baseModel.find(tableName,whereJson,orderByJson,limitArr,fieldsArr,function(ret){
// 	console.log(ret);    //没查到则返回空数组
// });