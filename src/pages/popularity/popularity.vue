<template>
  <scroll-view class="container" 
            enable-back-to-top
             scroll-y
             scrolltolower=280
             @scrolltolower="loadMore"
             :class="status==2?'no-swip':'swip'"
        >
    <div class="top-wrap" v-if="myTeachers.length">
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
      <p class="tip">我支持的老师</p>
      <div class="swiper">
        <swiper class="ontop"
          next-margin = "60px"
          >
          <swiper-item v-for="(item,index) in myTeachers" class="swiper-item" :key="index">
            <div class="item">
              <div class="left">
                <div class="num">{{item.list == null ? 0 : item.list}}</div>
                <img class="avatar" :lazy-load="lazyLoad" :src="item.thumb" />
                <div class="info-wrap">
                  <p class="name dot">{{item.name}}</p>
                  <p class="value dot">{{item.flower}}朵红花</p>
                </div>
              </div>
              <button class="thumb" @click.stop.prevent="toHelp(item.id)">打榜</button>
            </div>
          </swiper-item>
        </swiper>
      </div>
    </div>
    <div class="list-wrap" v-if="teachers.length">
      <div class="top-item">
        <template v-if="index<3" v-for="(item,index) in teachers">
          <div class="itemtop" :class="index==0 ? 'item-no2': index==1 ? 'item-no1' : 'item-no3'" :key="index">
            <div class="img-wrap" v-if="item.id">
              <img :class="index!=1 ? 'cat' : 'bg-cat'" :src="index==0 ? no2: index==1 ? bgCat : no3" />
              <!-- 需要判断头像 -->
              <img class="avatar" :lazy-load="lazyLoad" :src="item.thumb" />
              <span class="rank-num">{{index==0 ? 2: index==1 ? 1 : 3}}</span>
            </div>
            <div class="info-wrap" v-if="item.id">
              <p class="name dot">{{item.name}}</p>
              <p class="value dot"><span class="num">{{item.flower}}</span>朵红花</p>
            </div>
            <button v-if="item.id" class="thumb" @click.stop.prevent="toHelp(item.id)">打榜</button>
          </div>
        </template>
 
      </div>
      <!-- 第三名以后 -->
      <div class="lists" v-if="teachers.length>3">
        <div class="items"  v-if="index>=3" v-for="(item,index) in teachers" :key="index">
          <div class="left">
            <div class="num">{{index+1}}</div>
            <img class="avatar" :lazy-load="lazyLoad" :src="item.thumb" />
            <div class="info-wrap">
              <p class="name dot">{{item.name}}</p>
              <p class="value dot">{{item.flower}}朵红花</p>
            </div>
          </div>
          <button class="thumb" @click="toHelp(item.id)">打榜</button>
        </div>
      </div>
      
    </div>
  </scroll-view>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {sharedAddFlowers,reLogin} from '../../utils/index.js'
export default {
  data() {
    return {
      page: 1,
      hasMore: true,
      myTeachers: '',
      teachers: '',
      no1: this.imgUrl + "P_gold_cat@3x.png",
      bgCat: this.imgUrl + "P_no1@3x.png",
      no2: this.imgUrl + "P_silver_cat@3x.png",
      no3: this.imgUrl + "P_bronze_cat@3x.png",
      lazyLoad: true,
      imgUrls: [
        this.imgUrl + 'getGifts@3x.png',
        this.imgUrl + 'H_question@2x.png'
      ]
    };
  },
  computed: {
    ...mapGetters([
      'isAuth',
      'uid',
      'auid',
      'auth'
    ])
  },
  watch: {
    auth() {
      this._getLists()
    }
  },
  onLoad(options) {
    var uid = options.auid
    if(uid) {  //通过转发进入
      // 重新登录
      reLogin(this,uid)
    }
  },
  onShow() {
    wx.setNavigationBarTitle({
      title: '人气总榜'
    })
    this._getLists()
  },
  methods: {
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
    toHelp(id) {
      wx.navigateTo({
        url: `/pages/help-popularity/main?id=${id}`
      })
    },
    _getLists() {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      this.$fly.get(`/index.php?m=minpackage&c=index&a=teacherList`, {
        auth: this.auth,
        page: this.page,
      }).then(res => {
        if(res.result === 1) {
          this.myTeachers = res.data.myTeachers
          if(this.page <= 1) {
            // this.teachers = res.data.teachers
            let tempInfo = this._deepClone(res.data.teachers)
            if(res.data.teachers.length===0) {  //老师的长度为0
              this.teachers = []
            }else if(res.data.teachers.length===1) {  //只有第一名
              res.data.teachers.unshift({})
              res.data.teachers.push({})
              this.teachers = res.data.teachers
            }else {
              tempInfo[0] = ''
              tempInfo[1] = ''
              tempInfo[0] = res.data.teachers[1]
              tempInfo[1] = res.data.teachers[0]
              this.teachers = tempInfo
              if(res.data.teachers.length===2) {  //只有前两名
                this.teachers.push({})
              }
            }
          }else {
            if(res.data.teachers.length>0)
              this.teachers = this.teachers.concat(res.data.teachers)
          }
          wx.hideLoading()
          this._checkMore(res.data.teachers)
        }
      })
    },
    _deepClone(obj){
      let _obj = JSON.stringify(obj);
      let objClone = JSON.parse(_obj);
        return objClone
    },
    _checkMore(data) {
      if(data.length < 10 || !data.length) {
      // if(!data.length) {
        this.hasMore = false
      }
    },
    // 分享到微信群送花(每天最多两次)
    // _shareCallBack(result) {
    //   let that = this
    //   this.$fly.get(`/index.php?m=minpackage&c=index&a=share`, {
    //     id: this.id,
    //     auth: this.auth
    //   }).then(res => {
    //     sharedAddFlowers(result, res)
    //   })
    // },
    ...mapActions([
      'setIsAuth'
    ])
  },
  onShareAppMessage() {
    const _this = this
    return {
      path: `/pages/popularity/main?auid=${this.auid}`,
      // imageUrl: this.imgUrl + 'share_icon.png',
      title: '【@所有人】帮喜欢的老师投花，助力人气总榜登顶',
      success(result) {
        // _this._shareCallBack(result)
      }
    }
  }
};
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
.container {
  @container();
  padding-bottom: 10px;
  background: #e02e24;
  box-sizing: border-box;
  .ontop {
    position: relative;
    width: 100%;
    height: 135px;
    box-sizing: border-box;
    z-index: 190;
    .activity {
      width: 100%;
      height: 100%;
    }
  }
  .dot {
    @textLimit();
  }
  .item,.items {
    position: relative;
    @flexBetween();
    background: #fff;
    border-radius: 8px;
    box-sizing: border-box;
    .left {
      position: relative;
      @flexBetween();
      flex: 1;
      .num {
        position: relative;
        font-size: 20px;
        font-weight: bold;
        color: #333;
      }
      .avatar {
        display: inline-block;
        margin: 0 10px;
        width: 54px;
        height: 54px;
        border-radius: 50%;
      }
      .info-wrap {
        position: relative;
        flex-grow: 1;
        margin-right: 8px;
        width: 0;
        .name {
          position: relative;
          margin-bottom: 8px;
          width: 100%;
          color: #333;
          font-size: 18px;
        }
        .value {
          position: relative;
          font-size: 14px;
          width: 100%;
          color: #999;
        }
      }
    }
    .thumb {
      position: relative;
      border: 1px solid #e02e24;
      border-radius: 6px;
      font-size: 16px;
      color: #e02e24;
      padding: 6px 10px;
      line-height: 18px;
    }
  }
  .top-wrap {
    position: relative;
    width: 100%;
    .tip {
      position: relative;
      padding: 15px;
      font-size: 20px;
      color: #fff;
      line-height: 20px;
      box-sizing: border-box;
    }
    .swiper {
      position: relative;
      padding-left: 10px;
      width: 100%;
      box-sizing: border-box;
      .ontop {
        position: relative;
        width: 100%;
        .swiper-item {
          position: relative;
          width: calc(100% - 90px);
        }
        .item {
          padding: 8px;
          width: 289px;
          height: 94px;
        }
      }
    }
  }
  .list-wrap {
    position: relative;
    margin: 40px 10px 0;
    background-color: #fff;
    border-radius: 4px;
    .top-item {
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 0 10px;
      width: 100%;
      box-sizing: border-box;
      .itemtop {
        position: relative;
        text-align: center;
        .img-wrap {
          position: relative;
          width: 100%;
          .cat {
            position: relative;
            display: block;
            top: 7px;
            z-index: 2;
            margin: 0 auto;
            width: 55px;
            height: 36px;
          }
          .avatar {
            position: relative;
            display: block;
            margin: 0 auto;
            z-index: 6;
            border-radius: 100%;
          }
          .rank-num {
            position: relative;
            display: block;
            top: -11px;
            margin: 0 auto;
            width: 22px;
            height: 22px;
            color: #333;
            font-size: 16px;
            line-height: 22px;
            text-align: center;
            border-radius: 50%;
            z-index: 10;
          }
        }
        .info-wrap {
          position: relative;
          margin: 15px auto;
          width: 100%;
          text-align: center;
          .name {
            margin-bottom: 8px;
            font-size: 18px;
            color: #333;
            line-height: 18px;
          }
          .value {
            font-size: 14px;
            color: #999;
            line-height: 14px;
            .num {
              color: #e02e24;
            }
          }
        }
        .thumb {
          position: relative;
          display: inline-block;
          margin: 0 auto 20px;
          padding: 6px 10px;
          font-size: 16px;
          line-height: 18px;
          color: #e02e24;
          border: 1px solid #e02e24;
          border-radius: 6px;
        }
      }
      .item-no1 {
        flex: 1;
        .bg-cat {
          display: block;
          .absoluteNum(0,-55px,135px,118px);
          right: 0;
          margin: 0 auto;
        }
        .avatar {
          position: relative;
          margin-top: 40px !important;
          width: 108px;
          height: 108px;
          border: 2px solid #fadb00;
          box-sizing: border-box;
        }
        .rank-num {
          background-color: #fadb00;
        }
      }
      .item-no2,
      .item-no3 {
        padding: 0 2px;
        width: 90px;
        box-sizing: border-box;
        .avatar {
          width: 82px;
          height: 82px;
          box-sizing: border-box;
        }
      }
      .item-no2 {
        .avatar {
          border: 2px solid #cdcdcd;
        }
        .rank-num {
          background-color: #cdcdcd;
        }
      }
      .item-no3 {
        .avatar {
          border: 2px solid #fda956;
        }
        .rank-num {
          background-color: #fda956;
        }
      }
    }
    .lists {
      position: relative;
      padding: 10px 0;
      width: 100%;
      box-sizing: border-box;
      .items {
        padding: 20px 10px;
        width: 100%;
        .left {
          .num {
            width: 42px;
            text-align: center;
          }
        }
        .thumb {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
