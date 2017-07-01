//标识是否含有多个接口在该文件中
module.exports.MANYDATA=true;

//  request url : /selfservice/login
module.exports.login={
	title:"用户登陆接口",
	type:"POST",
	url:"/selfservice/login",
	senddata:{
		usename:"用户名",
		password:"密码"
	},
	backdata:{
		login: "标识用户是否成功登陆，成功true错误false",
		role:  "标识用户角色"
	},
	success:{
		login:true,
		role:"admin"
	},
	error:{
		login:false,
		message:"用户登陆失败"
	}
}


//  request url : /selfservice/test
module.exports.test={
	title:"测试接口1",
	type:"GET",
	url:"/selfservice/test",
	senddata:null,
	backdata:{
		test: "标识接口测试是否成功"
	},
	success:{
		test:true,
		bigdata:{
			key1:"value1",
			key2:"value2",
			key3:"value3"
		}
	},
	error:{
		test:false,
		message:"接口测试失败"
	}
}