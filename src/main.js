import Vue from 'vue'
import App from './App'
import Store from './store'
import Fly from 'flyio/dist/npm/wx'

Vue.config.productionTip = false
App.mpType = 'app'

const fly = new Fly()
const app = new Vue(App)
app.$mount()

Vue.prototype.$fly = fly
Vue.prototype.$store = Store
Vue.prototype.imgUrl = 'http://www.5qianqian.com/statics/images/hynh/'

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  (response) => {
      //只将请求结果的data字段返回
      return response.data
  },
  (err) => {
      //发生网络错误后会走到这里
      return Promise.resolve(err.request)
  }
)

// 默认请求地址
fly.config.baseURL = 'https://www.5qianqian.com'
// fly.config.baseURL = 'http://true.ihuqu.com'
fly.config.headers['content-type'] = 'application/x-www-form-urlencoded'
fly.config.timeout = 20000

export default {
  // 这个字段走 app.json
  config: {          
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      '^pages/index/main',
      'pages/detail/main',
      'pages/my-center/main',
      'pages/persons/main',
      'pages/activity-list/main',   //活动主页
      'pages/famous/main',  //名人堂
      'pages/popularity/main',
      'pages/help-popularity/main',
      // 'pages/reward-article/main',
      // 'pages/get-petal/main',
      'pages/fr-month/main',
      'pages/petal-record/main',
      'pages/comments/main',
      'pages/flower-rank2/main',  //花朵排行二期(通过传参包含一期)
      'pages/flower-rank3/main',  //花朵排行三期
      'pages/dance-talent/main',   //舞蹈达人活动
      'pages/dance-talent2/main',   //舞蹈达人活动二期
      'pages/dance-talentN/main', //新的舞蹈达人页面
      'pages/star-talent/main',   //明星达人赛页面
      'pages/videoDS/main',  //视频形象大使页面
      'pages/petal-rank/main',
      // 'pages/personal/main',  //名人堂老师个人页面
      // 'pages/talent-rank/main'  //名人堂排行页面
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#e02e24',
      navigationBarTitleText: '花样年华',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      selectedColor: '#f40009',
      color: '#999',
      backgroundColor: '#fff',
      borderStyle: 'white',
      list: [
        {
          pagePath: 'pages/index/main',
          text: '精选',
          iconPath: '/static/image/tab_jx@3x.png',
          selectedIconPath: '/static/image/tab_jx_a@3x.png'
        },
        {
          pagePath: 'pages/persons/main',
          text: '人物',
          iconPath: '/static/image/tab_per@3x.png',
          selectedIconPath: '/static/image/tab_per_a@3x.png'
        },
        {
          pagePath: "pages/activity-list/main",
          text: "活动",
          iconPath: '/static/image/tab_act@3x.png',
          selectedIconPath: '/static/image/tab_act_a@3x.png',
          selected: false
        },
        {
          pagePath: "pages/popularity/main",
          text: "打榜",
          iconPath: '/static/image/H_DB@3x.png',
          selectedIconPath: '/static/image/H_DB_a@3x.png',
          selected: false
        },
        {
          pagePath: 'pages/my-center/main',
          text: '我的',
          iconPath: '/static/image/tab_my@3x.png',
          selectedIconPath: '/static/image/tab_my_a@3x.png'
        }
      ]
    }
  }
}
