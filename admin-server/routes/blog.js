const router = require('koa-router')()

router.get('/blog', async(ctx, next) => {
    ctx.body = 'blog'
})

module.exports = router