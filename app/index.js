const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const error = require('koa-json-error');
const router = new Router();
const parameter = require('koa-parameter');
const routing = require('./routes');
const mongoose = require('mongoose');
const { connectionStr} = require('./config');
const server = require('http').Server(app.callback());
const io = require('socket.io')(server);
const fs = require('fs');
const path = require('path');




//const WebSocketServer = require('./ws');


//mongodb connection
mongoose.connect(connectionStr, {useUnifiedTopology: true, useNewUrlParser: true,}).then(() => console.log('DB Connected!'));
mongoose.connection.on('error', console.error);


app.use(error({
    postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
  }));
app.use(parameter(app));
routing(app);


//app.use(router.routes());



app.listen(8080, () => {
  console.log('Application is starting on port 8080')
})