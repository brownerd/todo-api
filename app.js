// Include modules

const koa = require('koa')
const mongoose = require('mongoose')
const convert = require('koa-convert')
const bosyParser = require('koa-bodyparser')
const router = require('koa-simple-router')
const error = require('koa-json-error')
const logger = require('koa-logger')
const koaRes = require('koa-res')
const handlerError = require('koa-handle-error')
const task = require('./controller/task')
const app = new koa()

// Mongoose config
mongoose.Promise = require('bluebird');
mongoose
  .connect(process.env.MONGO_URL)
  .then(response => {
    console.log('mongo connection created')
  })
  .catch(err => {
    console.log('Error connetiong to Mongo')
    console.log(err)
  })

// server config
app.use(async (ctx, next) => {
  try {
    await next()
  } 
  catch (err) {
    ctx.status = err.status || 500
    ctx.body = err.message
    ctx.app.emit('error', err, ctx)
  }
})

// logging
app.use(logger())
// body parsing
app.use(bodyParser())
// format response to JSON
app.use(convert(koaRes()))
// configure router
app.use(router(_ => {
  _.get('/saysomething', async ctx => ctx.body = 'hello world'),
  _.get('/throwerror', async ctx => throw new Error('Aghh! An Error!')),
  _.get('/tasks', task.getTasks),
  _.get('/task', task.createTask),
  _.get('/task', task.updateTask),
  _.get('/task', task.deleteTask),
  _.get('/task/multi', task.createConcurrentTasks),
  _.get('/task/multi', task.deleteConcurrentTask)
}))