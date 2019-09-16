const router = require('koa-router')()

router.get('/swipe', async(ctx, next) => {
    ctx.body = 'swipe'
})

module.exports = router