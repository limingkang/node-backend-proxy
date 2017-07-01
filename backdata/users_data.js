//  request url : /selfservice/users
module.exports={
	title:"测试接口2",
	type:"GET",
	url:"/selfservice/users",
	senddata:null,
	backdata:{
		users: "测试"
	},
	success:{
		users:"admin"
	},
	error:{
		code:500,
		message:"测试失败"
	}
}