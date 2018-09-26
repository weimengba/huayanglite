<template>
  <div class="container">

    <div v-if="activity == 1" class="flower-wrap" @click="seeRank">
      <img class="see-flower" :src="flowerrate">
    </div> 
    <scroll-view class="list-wrap"
                enable-back-to-top
                scroll-y
                scrolltolower=150
                @scrolltolower="loadMore">
      <div class="add-this" v-if="guideShow">
        <p class="txt">放进[我的小程序]，使用更方便</p>
        <img class="hand" :src="hand" />
        <img class="close" :src="close" @click.stop="closeFun" />
      </div>

      <swiper class="ontop"
          autoplay="true"
          indicator-dots="true"
          indicator-color="rgba(0,0,0,.3)"
          indicator-active-color="#000000"
          circular="true"
          interval="3000"
          duration="500"
          >
          <swiper-item v-for="(item,index) in imgUrls" :key="index" @click="goActivity(index)">
            <image :src="item" :lazy-load="lazyLoad" class="activity" />
          </swiper-item>
      </swiper>
      <!-- <swiper class="ontop">
          <swiper-item v-for="(item,index) in imgUrls" :key="index" @click="goActivity(index)">
            <image :src="item" :lazy-load="lazyLoad" class="activity" />
          </swiper-item>
      </swiper> -->

      <div class="getpetal-wrap">
        <div class="petal-wrap">
          <image class="petal" :src="img"></image>
          <div class="inner" v-if="petal!==''">
            <text v-if="petal==0" class="tip">您还没有花瓣，点击</text>
            <image v-if="petal==0" class="petal" :src="toArrow"></image>
            <p v-if="petal*1>0" class="tip">您有<text class="redtxt">{{petal}}</text>个花瓣</p>
          </div>
          <button class="get-petal" @click="getPetal">赚花瓣</button>
        </div>
      </div>
      <listview 
            :data="list"
            :auth="auth"
            @viewDetail="viewDetail"
            @changeThumb="changeThumb"
            @shareDetail="shareDetail"
            :lazyLoad="lazyLoad"></listview>
    </scroll-view>

    <div class="refresh" @click.stop="refreshFun">
      <img :src="refresh" alt="" class="icon">
    </div>
    <guide v-if="showGuide" @guideFun="guideFun"></guide>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
import {sharedAddFlowers,reLogin} from '../../utils/index.js'
import Listview from 'components/listview'
import Guide from 'components/guide'
let PageNum = 10  //每页显示的数量
export default {
  data() {
    return {
      page: 1,
      hasMore: true,
      list: [],
      lazyLoad: true,
      petal: '',
      shareId: '',  //获取分享的ID
      guideShow: false,  //苹果手机添加关注小程序
      showGuide: false,
      imgUrls: [
        this.imgUrl + 'getGifts@3x.png',
        this.imgUrl + 'H_question@2x.png'
      ],
      flowerrate: this.imgUrl + 'flowerrate.png',
      img: this.imgUrl + 'home-icon.png',  //赚花瓣左侧图标
      toArrow: this.imgUrl + 'to_arrow.png',
      refresh: this.imgUrl + 'refresh_icon.png',
      close: this.imgUrl + 'H_close0@2x.png',
      hand: this.imgUrl + 'H_finger@2x.png'
    }
  },
  computed: {
    ...mapGetters([
      'auth',
      'uid',
      'auid',
      'activity',
      'indexInfo',
      'firstIn',
    ])
  },
  onLoad(options) {
    let uid = options.id 
    var shareId = decodeURIComponent(options.scene).split('##')[0]
    let codeAuid = decodeURIComponent(options.scene).split('##')[1]
    // if(shareId!=='undefined' || options.auid) {  //通过转发或扫二维码进入
    if(options.auid) {  //通过转发
      let uid = options.auid
      // 重新登录
      reLogin(this,uid)
    }


    this._judgeDevice()
    this._getList()
  },
  onShow() {
    if(this.auth) {//进入或返回到该页面时，刷新花瓣数量
      this._getPetalNums()
    }
    if(this.indexInfo.id!='') {//当有需要更改的数据时，对该条数据单独修改
      this.list.map(item => {
        if(item.id==this.indexInfo.id) {
          item.plays = this.indexInfo.borwser
          item.share = this.indexInfo.shared
          item.praises = this.indexInfo.thumb
        }
      })
      wx.hideLoading()
      return
    }else { //当没有需要更改的数据时（一般从活动列表页面返回到首页时），重新加载页面
      this.page = 1
      this._getList()
    }
  },
  onHide() {
    this.showGuide = false
    this.setIndexInfo({
      id: '',
      borwser: 0,
      shared: 0,
      thumb: 0
    })
  },
  onUnload() {
    this.showGuide = false
    this.setIndexInfo({
      id: '',
      borwser: 0,
      shared: 0,
      thumb: 0
    })
  },
  methods: {
    shareDetail(id) {
      console.log("要分享的ID "+id)
    },
    changeThumb(d) {  //首页改变点赞
      this.list = d
    },
    goActivity(index) {
      if(index === 0) {
        wx.switchTab({
          url: `/pages/my-center/main`
        })
      }else if(index === 1) {
        wx.navigateToMiniProgram({
          appId: 'wx6c3e720d15a56572', // 要跳转的小程序的appid
          path: 'pages/homepage/homepage', // 跳转的目标页面
          // extarData: {
          //   open: 'auth'
          // },
          success(res) {
            console.log("成功打开！") 
          }
        })
      }
    },
    closeFun() { //引导条的关闭
      this.guideShow = false
    },
    guideFun() {
      this.showGuide = false
    },
    // 原来的排行
    seeRank() {
      wx.navigateTo({
        url: '/pages/rank-list/main'
      })
    },
    viewDetail(item, index) {
      this.item = item
      wx.navigateTo({
        url: `/pages/detail/main?id=${item.id}&index=${index}`
      })
    },
    getPetal() {
      wx.switchTab({
        url: '/pages/my-center/main'
      })
    },
    refreshFun() {
      this.page = 1
      this.list = []
      this._getList()
      this.scrollTop = 0
    },
    // 加载更多
    loadMore() {
      if(!this.hasMore) {
        return
      }
      this.page ++
      this._getList()
    },
    // 最新排行榜
    toRank() {
      wx.navigateTo({
        url: '/pages/rank-list2/main'
      })
    },
    _getList() {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      this.hasMore = true
      this.$fly.get(`index.php?m=minpackage&c=index&a=lists`, {
        page: this.page,
        auth: this.auth
      }).then(res => {
        if(res.timeout == 20000) {
          wx.showToast({
            title: '请求超时，请重启小程序',
            icon: 'none',
            duration: 5000
          })
          return
        }
        if(res.result === 1) {
          wx.hideLoading()

          if(this.page <= 1) {
            this.list = res.data
          }else {
            this.list = this.list.concat(res.data)
          }
          this.petal = res.petal
          this._checkMore(res.data)
        }
      })
    },
    _judgeDevice() {
      let that = this
      wx.getSystemInfo({
        success: function(res) {
          if(res.platform == 'ios') {
          // if(res.platform == 'devtools') {
          // if(res.platform == 'android') {
            that.guideShow = true
          }else {
            that.guideShow = false
          }
        }
      })

    },
    _getPetalNums() {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      this.$fly.get(`/index.php?m=minpackage&c=index&a=petal_now`, {
        auth: this.auth
      }).then(res => {
        if(res.result === 1) {
          this.petal = res.data
          wx.hideLoading()
        }
      })
    },
    _checkMore(data) {
      if(!data.length) {
        this.hasMore = false
      }
    },
    _shareCallBack(result) {
      let that = this
      this.$fly.get(`/index.php?m=minpackage&c=index&a=share`, {
        id: 0,
        auth: this.auth
      }).then(res => {
        
      })
    },
    ...mapActions([
      'setIndexInfo',
      // 'setFirstIn'
    ])
  },
  watch: {
    auth() {
      this._getList()
    },
    firstIn() {
      if(this.firstIn==0 && this.guideShow) {  //初次
      this.showGuide = true
      // this.setFirstIn(0)
      }
    }
  },
  components: {
    Listview,
    Guide
  },
  onShareAppMessage(e) {
    const _this = this
    let id = e.target.id.split('##')[0]
    let title = e.target.id.split('##')[1]
    let image = e.target.id.split('##')[2]
    if(e.from == 'button') { //首页分享详情
      return {
        path: `/pages/detail/main?id=${id}&auid=${this.auid}`,
        imageUrl: image,
        title: title,
        success(result,id) {
          _this._shareCallBack(result)
        }
      }
    } else {
      return {
        path: `/pages/index/main?auid=${this.auid}`,
        imageUrl: this.imgUrl + 'share_product@3x.png',
        // title: '加入【花样年华lite】免费拿走生活商品，传递爱与惊喜！',
        title: '加入【花样年华lite】免费拿走生活商品，传递爱与惊喜！',
        success(result,id) {
          _this._shareCallBack(result)
        }
      }
    }
    
  }
}
</script>

<style scoped lang="less">
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .container {
    @container();
    z-index: 100;
  }
  .ontop {
    position: relative;
    width: 100%;
    height: 135px;
    border-top: 10px solid #fff;
    box-sizing: border-box;
    z-index: 190;
    .activity {
      width: 100%;
      height: 125px;
    }
  }
  .add-this {
    position: relative;
    @flexBetween();
    padding: 0 15px;
    width: 100%;
    height: 50px;
    background:#f0c731;
    box-sizing: border-box;
    .txt {
      font-size:16px;
      color:#333;
    }
    .close {
      position: relative;
      width: 20px;
      height: 20px;
    }
    .hand {
      position: absolute;
      display: inline-block;
      right: 54px;
      bottom: 5px;
      width: 31px;
      height: 34px;
      animation:movehand 1s linear infinite;
    }
  }

  @keyframes movehand {
    0% {bottom: 5px;}
    50% {bottom: 16px;}
    100% {bottom: 5px;}
  }

  .flower-wrap {
    .absoluteNum(0,152px,auto,auto);
    z-index: 190;
  }
  .see-flower {
    display: inline-block;
    position: relative;
    width: 83px;
    height: 60px;
  }

    .getpetal-wrap {
      position: relative;
      padding: 15px 13px;
      width: 100%;
      background:#f5f5f5;
      box-sizing: border-box;
      z-index: 191;
      .petal-wrap {
        @flexBetween();
        padding: 10px 15px;
        width: 100%;
        background:#fff;
        border-radius:100px;
        box-sizing: border-box;
        .petal {
          width: 27px;
          height: 17px;
        }
        .inner {
          position: relative;
          display: flex;
          .tip {
            flex: 1;
            font-size:18px;
            color:#333;
            line-height:18px;
            .redtxt {
              display: inline-block;
              margin-right: 5px;
              color: #e02e24;
            }
          }
          .petal {
            margin: 5px 0 0 5px;
            width: 14px;
            height: 12px;
          }
        }
        .get-petal {
          position: relative;
          margin: 0;
          padding: 0;
          width:78px;
          height:30px;
          font-size: 16px;
          line-height: 30px;
          background:#e02e24;
          border-radius:100px;
          text-align: center;
          color: #fff;
        }
      }
    }

  .list-wrap {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    z-index: 198;
  }
  .refresh {
    width: 44px;
    height: 44px;
    position: fixed;
    z-index: 199;
    background-color: #fff;
    box-shadow:0 2px 4px 0 rgba(0,0,0,0.50);
    overflow: hidden;
    right: 20px;
    bottom: 40px;
    border-radius: 50%;
    .icon {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
</style>
