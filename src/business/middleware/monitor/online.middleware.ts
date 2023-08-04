import { Context } from 'koa'
import { IonlineType } from '@/types/monitor/online'
import errors from '@/app/err.type'
import {
  getAllUserInfo,
  judgeKeyOverdue,
  queryAllKeyValue,
  removeKey,
  removeListKey
} from '@/business/utils/auth'
import dayjs from 'dayjs'
const { getListErr, delErr } = errors

// 获取列表
export const getListMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const { pageNum, pageSize, userName, ipaddr } = ctx.query as unknown as IonlineType

    const tokens = await getAllUserInfo()
    const length = tokens.length

    let onlineTokens = []
    let values = []

    if (userName) {
      const redisValues = await queryAllKeyValue(tokens)
      values = redisValues.filter((item, index) => {
        onlineTokens.push(tokens[index])
        return item.userInfo.userName === userName
      })
    } else if (ipaddr) {
      const redisValues = await queryAllKeyValue(tokens)
      values = redisValues.filter((item, index) => {
        onlineTokens.push(tokens[index])
        return item.ip === ipaddr
      })
    } else {
      async function checkOnlineUsers() {
        // 1 查询 login_tokens 所有的id，返回给前端
        const onlineTokens = tokens.splice(pageNum - 1, pageSize)

        // 2 遍历 在线用户，查看是否过期
        onlineTokens.forEach(async (item) => {
          if (!(await judgeKeyOverdue(item))) {
            await removeListKey([item])
            checkOnlineUsers()
          }
        })

        return onlineTokens
      }
      onlineTokens = await checkOnlineUsers()
    }

    // 3 用id查找用户数据
    if (!userName && !ipaddr) values = await queryAllKeyValue(onlineTokens)

    // 4 提取前端需要信息
    const newV = values.map((item, index) => {
      return {
        tokenId: onlineTokens[index],
        os: item?.os,
        loginTime: item.loginTime && dayjs(item.loginTime).format('YYYY-MM-DD HH:mm:ss'),
        loginLocation: item.address,
        deptName: item.userInfo.dept.deptName,
        ipaddr: item.ip,
        userName: item.userInfo.userName,
        browser: item.browser
      }
    })

    ctx.state.formatData = { count: length, rows: newV }
    await next()
  } catch (error) {
    console.error('查询列表失败', error)
    return ctx.app.emit('error', getListErr, ctx)
  }
}

// 删除
export const delMid = async (ctx: Context, next: () => Promise<void>) => {
  try {
    const list = ctx.request.path.split('/')
    const ids = list[list.length - 1]
    const tokens = ids.split(',')
    removeKey(tokens)
    removeListKey(tokens)
  } catch (error) {
    console.error('删除失败', error)
    return ctx.app.emit('error', delErr, ctx)
  }

  await next()
}
