const Router = require('koa-router')
const router = new Router()
const callCloudDB = require('../utils/callCloudDB.js')
const cloudStorage = require('../utils/callCloudStorage.js')

router.get('/swiper/list', async(ctx, next) => {
    // 读取数据库
    const query = `db.collection('swiper').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)

    // 构造调用接口的数据格式
    let fileList = []
    const data = res.data
    for (let i = 0, len = data.length; i < len; i++) {
        fileList.push({
            fileid: JSON.parse(data[i]).fileID,
            max_age: 7200 //2hours
        })
    }


    // 构造指定格式返回给前端
    const dlRes = await cloudStorage.download(ctx, fileList)

    let returnData = []
    for (let i = 0, len = dlRes.file_list.length; i < len; i++) {
        returnData.push({
            download_url: dlRes.file_list[i].download_url,
            fileid: dlRes.file_list[i].fileid,
            _id: JSON.parse(data[i])._id
        })
    }

    ctx.body = {
        code: 20000,
        data: returnData
    }
})

router.post('/swiper/upload', async(ctx, next) => {

})

router.get('/swiper/del', async(ctx, next) => {

})

module.exports = router