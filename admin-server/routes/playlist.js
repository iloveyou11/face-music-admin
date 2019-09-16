const router = require('koa-router')()
const rp = require('request-promise')
const getAccessToken = require('../utils/getAccessToken')
const ENV = 'face-music-test-cor7k'

router.get('/playlist', async(ctx, next) => {
    const ACCESS_TOKEN = await getAccessToken()
    const fnName = 'music'
    const URL = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${ENV}&name=${fnName}`
    const options = {
        method: 'post',
        url: URL,
        json: true,
        body: {
            $url: 'playlist',
            start: 0,
            count: 50
        }
    }

    await rp(options).then(res => {
        ctx.body = JSON.parse(res.resp_data).data
    }).catch(err => {
        throw err
    })

})

module.exports = router