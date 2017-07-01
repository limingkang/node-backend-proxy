#基于vue.js重写Cnodejs.org社区的webapp
###安装

项目地址：（`git clone`）

```shell
个人地址：git clone https://github.com/limingkang/node-backend-proxy.git
```

通过`npm`安装本地服务第三方依赖模块(需要已安装[Node.js](https://nodejs.org/))

```
npm install
```
启动服务(http://localhost:3000)

```
npm start
```

###开发

###目录结构
<pre>
.
├── README.md           
├── bin               		//项目启动触发
├── routes         			// 所有需要代理的接口请求的地方
├── package.json       		// 项目配置文件
├── backdata                // 代理api请求需要返回的数据类型
│   ├── all_api_data        // 处理所有的请求返回值，生成接口文档的时候用
│   ├── selfservice_data    // 对应某个接口返回的数据格式
├── mysql          			// 需要连接mysql的时候用
└── mongodb  				// 需要连接mongodb的时候用
</pre>
