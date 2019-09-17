const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')

const playlistRouter = require('./routes/playlist')
const blogRouter = require('./routes/blog')
const swipeRouter = require('./routes/swiper')

const ENV = 'face-music-test-cor7k'

// 解决跨域问题
app.use(cors({
    origin: ['http://localhost:9528'],
    credentials: true
}))

app.use(async(ctx, next) => {
    ctx.state.env = ENV
    await next()
})

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// routes
app.use(playlistRouter.routes(), playlistRouter.allowedMethods())
app.use(blogRouter.routes(), blogRouter.allowedMethods())
app.use(swipeRouter.routes(), swipeRouter.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app