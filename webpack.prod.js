'use strict'
const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//CSS文件指纹
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //css压缩
const HtmlWebpackPlugin = require('html-webpack-plugin'); //
const { CleanWebpackPlugin }= require('clean-webpack-plugin');//清除构建目录
const Autoprefixer = require('autoprefixer') // 自动补全
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin");//css资源内联
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");//公共资源分离
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');//构建命令行优化
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin'); //速度分析
const smp = new SpeedMeasurePlugin();
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //体积分析
const HappyPack = require('happypack') //多进程
const TerserPlugin = require('terser-webpack-plugin'); //多进程并行压缩
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');//模块缓存
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin') //css擦除
const setMPA = ()=>{
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname,'./src/*/index.js')); //获取src目录下的所有入口文件
  console.log('=======entryFiles',entryFiles);
  Object.keys(entryFiles).map((index) => {
		const entryFile = entryFiles[index];  //src/indx/index.js   
		const match = entryFile.match(/src\/(.*)\/index\.js/);//匹配src开头, 末尾是index.js 中间的内容
    const pageName = match && match[1];  //取index. search 
    console.log('========pageName',pageName);
 		entry[pageName] = entryFile;
 		htmlWebpackPlugins.push(
			new HtmlWebpackPlugin({
				inlineSource: '.css$',
				template: path.join(__dirname,`src/${pageName}/index.html`),
				filename: `${pageName}.html`,
				chunks: ['vendors','commons', pageName],
				inject: true,
				minify: {
					html5: true,
					collapseWhitespace: true,
					preserveLineBreaks: false,
					minifyCSS: true,
					minifyJS: true,
					removeComments: false
 				}
 			})
 		);
 	});
  return {
    entry,
    htmlWebpackPlugins
  }
}
const { entry, htmlWebpackPlugins } = setMPA();
const PATHS = {
  src: path.join(__dirname, 'src')
};
module.exports = smp.wrap({
  entry: entry,
	output:{
      path:path.join(__dirname,'dist'),
  	  filename:'[name]_[hash:8].js' //文件指纹
    },
  mode:'production',//  mode:'development',production
	module:{
    rules:[
        {// js jsx解析 
            test:/.js$/,
            include:path.resolve('src'),
            use: [
              // {
              //   loader:'thread-loader',
              //   options:{
              //     workers:3                
              //   }
              // },
              // 'babel-loader',
              // 'eslint-loader'
              'happypack/loader'
            ] //babel编译es6
        },
        {//css less 解析
            test:/.css$/,
            //按照顺序写
            use:[
                //'style-loader', //将样式插入到html 和MiniCssExtractPlugin插件冲突， 需要删掉style-loader
                MiniCssExtractPlugin.loader,//生成一个独立的css文件
                'css-loader', // 链式调用 从右到左   先css再style
                'postcss-loader',
              	// {
            	// 	loader: 'px2rem-loader',    //css px---rem 转换 
            	// 	options: {
              	// 	remUnit: 75, //rem相对于px转换单位，1rem=75px，这个比较适合750的设计稿，750个像素对应着10个rem。
              	// 	remPrecision: 8 // px转成rem，后面小数点的位数。
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
            //use:'file-loader',
            use:[
              {
                loader: 'file-loader',
                options: {
                  limit:10240,//图片大小 小于10k,转为base64引入
                  name:'[name]_[hash:8].[ext]' //ext资源后缀名
                },
              },
              {
                loader:'image-webpack-loader',
	              options:{
		              mozjpeg:{
 		            		progressive:true,
 		            		quality:65
		            	},
 		              optipng:{ //针对png
 		            	  enabled:false
		              },
 		              pngquant:{
 		            	  quality:'65-90',
 		            	  speed:4
		              },
 		              gifsicle:{
 		            	  interlaced:false
		              },
 		              webp:{
 		            	  quelity:75
		              } 
                }
              },
            ],
        }
    ]
    },
	plugins:[
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  	new MiniCssExtractPlugin({
      filename:'[name]_[contenthash:8].css' //css 压缩  contenthash
    }),
    // new HTMLInlineCSSWebpackPlugin({}) // css资源内联
    new OptimizeCssAssetsPlugin({
      assetNameRegExp:/\.css$/g,
      cssProcessor: require('cssnano')
    }),
    new FriendlyErrorsWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    new HappyPack({
      loaders:[ 'babel-loader?cacheDirectory=true' ]
    }),
    function(){
      this.hooks.done.tap('done',(stats)=>{
        if(stats.compilation.errors && stats.compilation.errors.length&&process.argv.indexOf('--watch')==-1){
          console.log('builderror');
          process.exit(1);
        }
      })
    },
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://now8.gtimg.com/now/lib/16.8.6/react.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js',
          global: 'ReactDOM',
        },
      ],
    }),
    new webpack.DllReferencePlugin({
      manifest:require('./build/library/library.json')
    }),
    new HardSourceWebpackPlugin(),
    new PurgecssWebpackPlugin({ //路径需要绝对路径  把复合规则的路径全部匹配出来
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
  }),
  ].concat(htmlWebpackPlugins),
  stats:'errors-only',
  optimization: {
    splitChunks: {
      minSize:0,//抽离的公共包最小的大小，单位是字节
      cacheGroups: {
        commons: {
          //test:/(react | react-dom)/,
         // name:'vendors',
          name:'commons', //需要在HtmlWebpackPlugin的chunks中加入 新的name
          chunks:'all',
          minChunks:2  //使用的次数超过这个就提取成公共的文件
        }
      }
    },
    minimizer:[
      new TerserPlugin({
         parallel:4,
         cache:true
      })
    ]
  },
  devtool:'source map',
  resolve:{
    alias:{
      'react':path.resolve(__dirname,'./node_modules/react/umd/react.production.min.js'),
      'react-dom':path.resolve(__dirname,'./node_modules/react-dom/umd/react-dom.production.min.js'),
    },
    extensions:['.js'],
    mainFields:['main'] //主查找⼊⼝
  }
})