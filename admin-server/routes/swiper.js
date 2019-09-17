const Router = require('koa-router')
const router = new Router()
const callCloudDB = require('../utils/callCloudDB.js')
const cloudStorage = require('../utils/callCloudStorage.js')

router.get('/swiper/list', async(ctx, next) => {
    // 默认10条数据
    const query = `db.collection('swiper').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)

    // 文件下载链接
    let fileList = []
    const data = res.data

    for (let i = 0, len = data.length; i < len; i++) {
        fileList.push({
            fileid: JSON.parse(data[i]).fileID,
            max_age: 7200
        })
    }

    const dlRes = await cloudStorage.download(ctx, fileList)

    let returnData = []
    for (let i = 0, len = dlRes.file_list.length; i < len; i++) {
        returnData.push({
            download_url: dlRes.file_list[i].download_url,
            fileID: dlRes.file_list[i].fileID,
            _id: JSON.parse(data[i])._id
        })
    }
    ctx.body = {
        code: 20000,
        data: returnData
    }
})

router.post('/swiper/upload', async(ctx, next) => {
    const fileID = await cloudStorage.upload(ctx)

    // 写数据库
    const query = `
        db.collection('swiper').add({
            data: {
                fileID: '${fileID}'
            }
        })
    `
    const res = await callCloudDB(ctx, 'databaseadd', query)
    ctx.body = {
        code: 20000,
        id_list: res.id_list
    }
})

router.get('/swiper/del', async(ctx, next) => {
    const params = ctx.request.query

    // 删除云数据库中的内容
    const query = `db.collection('swiper').doc('${params._id}').remove()`
    const delDBRes = await callCloudDB(ctx, 'databasedelete', query)

    // 删除云存储中的文件
    const delStorageRes = await cloudStorage.delete(ctx, [params.fileID])

    ctx.body = {
        code: 20000,
        data: {
            delDBRes,
            delStorageRes,
        }
    }
})

module.exports = router