const path = require('path');

const webpack = require('webpack');
const webpackBaseConfig = require(path.resolve('webpack.base.js'));
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const webpackConfig = ({ name, js }) => {
  const config = Object.assign({}, webpackBaseConfig);

  config.mode = 'production'
  config.entry = js;
  config.output.filename = `${name}.min.js`;

  config.plugins.push(new HtmlWebpackPlugin({
    title: '',
    template: path.resolve('template.html'),
    filename: `${name}.php`,
    inject: false,
    minify: false,
    // custom options for template
    name: name,
    fb: {
      app_id: ''
    },
    og: {
      title: '',
      description: '',
      image: '',
      type: ''
    }
  }));

  config.plugins.push(new ScriptExtHtmlWebpackPlugin({
    defaultAttribute: 'defer'
  }));

  return config;
}

const pages = ((...pages) => pages.map(page => ({

  name: page,
  js: path.resolve('src', 'scripts', `${page}.js`)

})))('index');


build(pages);


async function build(pages, i = 0){

  console.log('Starting build...');

  for (const page of pages){
    try {
      console.log(`Building ${page.name}...`);
      await compile(webpackConfig(page));
    } catch(e){
      console.error(e);
    } finally {
      console.log(`Build of ${page.name} completed.`);
    }
  }

  console.log(`All builds completed.`);

  return pages.map(page => page.name);

}

function compile(config){
  return new Promise((res, rej) => {
    const compiler = webpack(config);
    compiler.run((err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details)
          console.error(err.details);
        return rej();
      }

      const info = stats.toJson();
    
      if (stats.hasErrors())
        for (const m of info.errors)
          console.error(m)
    
      if (stats.hasWarnings())
        for (const m of info.warnings)
          console.warn(m)

      res();
    });
  })
}
