
const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')();
const originRequest = require("request");

const cache = require('./cache');

router.get('/api/data/:id', async ctx => { ctx.body = 'api/data'; });
app.use(cache());
// 路由实例输出父中间件 router.routes()
app.use(router.routes());

app.listen(3001);



// 开始模拟请求
const request = (url, method, callback) => {
  const options = {
    url: url,
    encoding: null,
    method: method
  };
  originRequest(url, options, callback);
};


console.log('----------------start--------------');
setInterval(() => {
  const url = `http://127.0.0.1:3001/api/data/${Number.parseInt(Math.random()*10)}`;
  request(url, 'GET')
}, 800);



