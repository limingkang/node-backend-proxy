// @type class BaseModel
// @name limingakng
// @time 2016/7/14
// @desc detal mongodb data

var read_config=require('./mongodb_config'),
    mongodb=require('mongodb'),
    db,dbClient;
module.exports=function(){
	// 单条数据查询接口
	var self=this;
	this.findOneById=function(tableName,id,callback){
		connection(function(db){
			db.collection(tableName,function(err,collection){
				var mongoId=new mongodb.ObjectID(id); 
				var cursor=collection.find({'_id':mongoId});    //这是一个超级复杂的对象,他有cursor方法
				cursor.toArray(function(err,docs){
					if (err) {
						callback(false);
					}else{
						var row={};
						if (docs) {
							row=self.filterSelfRow(docs.shift());
						}
						callback(row);
					}
				});
				cursor.rewind();      //重置其初始状态
			});
		});
	};
	//数据插入接口
	this.insert=function(tableName,rowInfo,callback){
		connection(function(db){
			db.collection(tableName,function(err,collection){
				collection.insert(rowInfo,function(err,objects){
					if (err) {
						callback(false);
					}else{
						callback(objects);
					}
				})
			})
		})
	};
	// 数据修改接口
	this.modify=function(tableName,id,rowInfo,callback){    
		connection(function(db){
			db.collection(tableName,function(err,collection){
				var mongoId=new mongodb.ObjectID(id);   //调用mongodb的方法将字符串转换为objectid,它还有很多方法来处理不同的值
				collection.update({'_id':mongoId},rowInfo,{safe:true},function(err){
					if (err) {
						callback(false);
					}else {
						callback(true);
					}
				});
			});
		});
	};
	//数据删除接口
	this.remove=function(tableName,id,callback){
		connection(function(db){
			db.collection(tableName,function(err,collection){
				var mongoId=new mongodb.ObjectID(id); 
				collection.remove({'_id':mongoId},function(err){
					if (err) {
						callback(false);
					}else {
						callback(true);
					}
				});
			});
		});
	};
	// @desc 数据条件查询接口
	// @param tableName string
	// @param whereJson json desc 格式为{'name':'limingkang','age':'12'}
	// @param orderByJson json desc 格式{'name':1}对于1则为正序而-1为倒序 
	// @param fieldsJson json desc  格式{'name':1,'author':1}表示要返回的字段1表示要返回，0表示不返回
	// @param limitJson json desc  格式{'num':10,'skip':0}   num表示要返回多少条数据，skip表示要略过前面多少条数据，不写或者写0的时候就是返回num条数据，分页的时候会用到,键只能叫这个，叫其他的话获值部分要改
	this.find=function(tableName,whereJson,orderByJson,limitJson,fieldsJson,callback){
		//判断要查找的是否有id
		if (whereJson['id']) {                   
			whereJson['_id']=new mongodb.ObjectID(whereJson['id']);
			delete whereJson['id'];
		}
		var retArr=[];
		connection(function(db){
			db.collection(tableName,function(err,collection){ 
				var cursor=collection.find(whereJson,fieldsJson);
				//是否需要排序
				if (orderByJson) {
					cursor.sort(orderByJson);
				}
				//设置返回的条数和略过的条数
				if (limitJson) {
					var skip=limitJson['skip']?limitJson['skip']:0;
					var num=limitJson['num']?limitJson['num']:0;   //0的时候则返回全部
					cursor.limit(num).skip(skip);
				}
				// 获取查询结果并转化为数组
				cursor.toArray(function(err,docs){
					if (err) {
						callback(false);
					}else{
						if (docs) {
							for (var i = 0; i < docs.length; i++) {
								retArr.push(self.filterSelfRow(docs[i]));
							}
						}
						callback(retArr);
					}
				});
				cursor.rewind();
			});
		});

	};
	//数据转化，将mongodb自带的主键objectid进行替换为id的字符串
	this.filterSelfRow=function(rowInfo){
		if (rowInfo['_id']) {
			rowInfo['id']=rowInfo['_id'];
			delete rowInfo['_id'];                      //删除key为_id的数据，只留key为id的
		}
		return rowInfo;
	};
	// 连接函数，每一个方法都要用它来获得执行的句柄
	function connection(callback){
		// 避免多次打开数据库连接,连接的时候会给db赋值一个数据库连接的句柄
		if (!db) {
			var dbconfig=read_config.db;    //获取配置文件中的配置信息
			var host=dbconfig['host'],
				port=dbconfig['port'],
				user=dbconfig['user'],
				dbName=dbconfig['dbName'],
				password=dbconfig['password'];

			// 创建mongodb的服务器对象
			var server=new mongodb.Server(host,port);

			// 创建mongodb客户端对象，连接mongodb服务器
			dbClient=new mongodb.Db(dbName,server,{safe:false});

			dbClient.open(function(err,dbObject){
				if (dbObject) {
					db=dbObject;
					callback(dbObject);
					console.log('connection success');
					// 如果要走数据验证的话就用这个方法
					// dbObject.authenticate(user,password,function(err,dbObject){
					// 	db=dbObject;
					// 	callback(dbObject);
					// 	console.log('connection success');
					// });
				}else{
					console.log('error');
				}
			})
		}else{
			callback(db);
		}
	};
}








// mongodb数据库接口设计测试
// var BaseModel=require('./mongodb/base_model.js'),
//     baseModel=new BaseModel(),
// 	tableName="lmkone",
// 	rowinfo={};
// rowinfo.name="limingkang";
// rowinfo.age=26;
// var id="578ca17748073d287c00e7b4";

// baseModel.insert(tableName,rowinfo,function(ret){
// 	console.log(ret);
// })

// baseModel.modify(tableName,id,rowinfo,function(ret){
// 	console.log(ret);
// })

// baseModel.findOneById(tableName,id,function(ret){
// 	console.log(ret);
// })

// baseModel.remove(tableName,id,function(ret){
// 	console.log(ret);
// })

//查询所需参数
// var whereJson={'name':'limingkang'};
// var fieldsJson={'age':1,'name':1};
// var orderByJson={'age':1};
// var limitJson={'skip':1};
// baseModel.find(tableName,whereJson,orderByJson,limitJson,fieldsJson,function(ret){
// 	console.log(ret);    //没查到则返回空数组
// }); 