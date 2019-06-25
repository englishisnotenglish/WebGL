const webpack = require('webpack'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      path = require('path');

const EXAMPLES = {
  basic: {
    id: 'main',
    title: 'Main'
  },
  components: {
    id: 'rotateTriangle',
    title: 'Rotate Triangle'
  },
  drag: {
    id: 'square',
    title: 'Square'
  },
  d3: {
    id: 'threeD',
    title: '3d'
  },
};

const entry = {};

const plugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    title: 'Sigma.js - Examples',
    template: path.join(__dirname, 'templates', 'index.ejs'),
    pages: Object.keys(EXAMPLES).map(key => EXAMPLES[key]),
    chunks: []
  })
];

for (const key in EXAMPLES) {
  const example = EXAMPLES[key];

  entry[key] = `./src/${example.id}.js`;

  plugins.push(new HtmlWebpackPlugin({
    filename: `${example.id}.html`,
    title: `Sigma.js - ${example.title} Example`,
    chunks: ['commons', key],
    template: path.join(__dirname, 'templates', 'default.ejs')
  }));
}

module.exports = {
  mode: 'development',
  context: __dirname,
  entry,
  output: {
    filename: '[name].bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(?:glsl|gexf)$/,
        exclude: /node_modules/,
        loader: 'raw-loader'
      },
      { test: /\.(jpg|png|gif|bmp|jpeg)$/,//正则表达式匹配图片规则
        use: [{
        loader:'url-loader',
        options:{
            limit:8192,//限制打包图片的大小：
            //如果大于或等于8192Byte，则按照相应的文件名和路径打包图片；如果小于8192Byte，则将图片转成base64格式的字符串。
            name:'images/[name]-[hash:8].[ext]',//images:图片打包的文件夹；
            //[name].[ext]：设定图片按照本来的文件名和扩展名打包，不用进行额外编码
            //[hash:8]：一个项目中如果两个文件夹中的图片重名，打包图片就会被覆盖，加上hash值的前八位作为图片名，可以避免重名。
        }
        }]}
    ]
  },
  plugins,
  optimization: {
    splitChunks: {
      chunks: 'initial',
      minChunks: 2,
      name: 'commons'
    }
  },
  devServer: {
    port: 9000
  }
};
