const fs = require('fs')
const path = require('path')
const rp = require('request-promise')
const APPID = 'wxf7a589ea2be2de43'
const APPSECRET = 'd41b6b5290dbf6acfbafe1eef0c0362e'
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
const fileName = path.resolve(__dirname, './access_token.json')

const updateAccessToken = async() => {
    const resStr = await rp(URL)
    const res = JSON.parse(resStr)

    // console.log(res);
    //     { 
    //       access_token: '25_9PAe3asFw6wIKLU3MIGJInS0-dtOop-BzQrGuLqZi-jVO2c5-bZxU_SKKbdL60KvFrhdArvVsS9lk7ShfUsmxkhSe7FtcxShWBp3lm5SK71t-iC3TvIlap1l_KIAHGiADAVCB',
    //       expires_in: 7200 
    //     }

    // 将token保存到文件中
    if (res.access_token) {
        fs.writeFileSync(fileName, JSON.stringify({
            access_token: res.access_token,
            createTime: new Date()
        }))
    } else {
        await updateAccessToken()
    }
}

const getAccessToken = async() => {
    // 第一次运行没有此文件会报错
    try {
        const resStr = fs.readFileSync(fileName, 'utf-8')
        const res = JSON.parse(resStr)

        // console.log(res);
        // 如果出现服务器宕机的情况，未能及时地刷新token，那么文件中存储的是旧的token
        // 服务器恢复正常时,还需要2小时才能去更新token
        // 解决方案:
        // 获取文件中的时间与现在时间对比,是否在两小时以内,如果不在,则重新生成token

        const createTime = new Date(res.createTime).getTime()
        const nowTime = new Date()
        const twoHours = 2 * 60 * 60 * 1000
        if (nowTime - createTime > twoHours) {
            await updateAccessToken()
            await getAccessToken()
        }
        return res.access_token
    } catch (error) {
        await updateAccessToken()
        await getAccessToken()
    }
}

// 提前5分钟去获取一次
setInterval(async() => {
    await updateAccessToken()
}, (7200 - 300) * 1000)

module.exports = getAccessToken