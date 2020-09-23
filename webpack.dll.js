const path = require('path');
const webpack = require('webpack');
module.exports = {
 context:process.cwd(),
 resolve:{
 	extensions:['.js','.json','.jsx','.less','.css'],
 	modules:[__dirname,'node_modules']
 },
 entry:{//设置需要分离的包，把这些包大包成基础的文件
 	library:[
		'react',
		'react-dom'
	 ]
 },
output:{//指定library
 	filename:'[name].dll.js',
	path:path.resolve(__dirname,'./build/library'),
 	library:'[name]'//暴露库的名字
},
plugins:[
 new webpack.DllPlugin({ //指定包存放的位置
 	name:'[name]——[hash]',
	path: path.join(__dirname,'./build/library/[name].json')
 })
]
}