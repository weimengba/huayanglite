const state = {
  auth: '',
  isAuth: 0,
  uid: 0,
  // activity: 1,
  activity: 0,
  signed: -1,
  signDay: -1,  //连续签到的天数
  flowersAll: 0,
  flowersToday: 0,
  changeInfo: {  //给指定用户添加花朵（详情页送完花朵到列表页数量添加）
  	id: '',
  	count: 0
  },
  auid: '',  //加密后的个人id
  indexInfo: {  //详情页返回到首页时 浏览、分享、点赞 数量的添加
    id: '',
    borwser: 0,
    shared: 0,
    thumb: 0
  },
  newCommentList: '', //在评论的更多页面点赞等修改用户数据后，返回到详情页刷新数据
  firstIn: 1,  //是否是第一次进入小程序(IOS端是否添加小程序提示 0:提示 1:不提示)
  toList: false,  //是否是从详情页跳转到活动列表页
  // codeAuid: '',  //分享二维码图片产生的auid
}

export default state