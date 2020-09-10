'use strict'

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin= require('clean-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const HtmlWebpackPlugin= require('html-webpack-plugin')
// const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin");
module.exports ={
  entry:{
  	index:'./src/index.js',
  	search:'./src/search.js'
	},
	output:{
      path:path.join(__dirname,'dist'),
  	  filename:'[name]_[hash:8].js' //文件指纹
    },
  mode:'development',
	module:{
    rules:[
        {// js jsx解析 
            test:/.js$/,
            use:'babel-loader' //babel编译es6
        },
        {//css less 解析
            test:/.css$/,
            //按照顺序写
            use:[
                'style-loader', //将样式插入到html 和MiniCssExtractPlugin插件冲突， 需要删掉style-loader
               // MiniCssExtractPlugin.loader,//生成一个独立的css文件
                'css-loader' // 链式调用 从右到左   先css再style
                //  {
            		// 	loader: 'postcss-loader',   // css3补齐：autoprefixer和postcss-loader
            		// 	options: {
              	// 		plugins: () => {
                //       // 指定autoprefixer所需要兼容的浏览器的版本 最近两个版本 使用人数
                // 			require('autoprefixer')({ overrideBrowserslist: ["last 2 version", ">1%", "IOS 7"] })
                //     }
            		// 	}
          			//  }，
              // 	{
            	// 	loader: 'px2rem-loader',    //css px---rem 转换 
            	// 	options: {
              // 		remUnit: 75, //rem相对于px转换单位，1rem=75px，这个比较适合750的设计稿，750个像素对应着10个rem。
              // 		remPrecision: 8 // px转成rem，后面小数点的位数。
            	// 	}
          		// }
            ]
        },
        {
          test:/.less$/,
          use:[
            'style-loader',
            'css-loader',
            'less-loader'
          ]
        },
        {//图片解析
            test:/.(png|svg|jpg|gif|jpeg)$/,
            use:'file-loader',
            // use:[
            //   {
            //     loader: 'url-loader',
            //     options: {
            //       limit:10240,//图片大小 小于10k,转为base64引入
            //       name:'[name]_[hash:8].[ext]' //ext资源后缀名
            //     },
            //   },
            // ],
        }
    ]
	},
	plugins:[
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
  ],
  devServer:{
    contentBase:'./dist',
    hot:true
  }
}