// 存放所有数据导出
var alldata=[];

// 初始化所有需要的接口数据引入
var templatedata=[
	require('./selfservice_data'),
	require('./users_data')
]

// 处理数组返回成需要的格式
for (var i = 0; i < templatedata.length; i++) {
	if(templatedata[i].MANYDATA){
		for (var key in templatedata[i]) {
			if (key=="MANYDATA") continue;
			alldata.push(templatedata[i][key]);
		}
	}else{
		alldata.push(templatedata[i]);
	}
}

// 导出所需要的格式的数组
module.exports=alldata;