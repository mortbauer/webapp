const http = require('http');
const express = require('express');
const httpProxy = require('http-proxy');

const webpack = require('webpack');
const webpackConfig = require('./webpack/dev.config');

const compiler = webpack(webpackConfig);

var proxy = httpProxy.createProxyServer({});

var app = express();

app.use(require('morgan')('short'));

app.use(function(req,res,next){
  res.setHeader("Content-Security-Policy", "connect-src 'self'");
  next();
});

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: false, publicPath: webpackConfig.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000,
}));

app.use(express.static(__dirname + '/'));


app.all(/^\/api\/(.*)/, function api(req, res) {
    proxy.web(req, res, { target: 'http://localhost:5000' });
});

app.get(/.*/, function root(req, res) {
  res.sendFile(__dirname + '/index.html');
});


const server = http.createServer(app);
server.listen(process.env.PORT || 3000, function onListen() {
  const address = server.address();
  console.log('Listening on: %j', address);
  console.log(' -> that probably means: http://localhost:%d', address.port);
});
