<template>
  <div class="container">
    <!-- 明星达人赛页面 -->
    <scroll-view class="list-wrap"
            v-if="rankList.length"
            enable-back-to-top
             scroll-y
             lower-threshold=350
             @scrolltolower="loadMore"
        >
      <div class="header">
        <div class="banner">
          <div class="banner-wrap">
            <img class="banner" :src="banner" lazy-load="lazyload" />
          </div>
        </div>
        <div class="top-tip">
          <!-- 活动结束 -->
          <template v-if="end">
            <p class="champion" v-if="rankList[0]">恭喜{{rankList[0].name}}</p>
            <p class="champion">获得第一名</p>
            <p class="champion">被选为花样年华明星达人</p>
          </template>
          <!-- 活动进行中 -->
          <template v-if="!end">
            <div class="tip-text">
              <text class="text">经过激烈角逐，数十位老师，通过舞蹈达人赛，晋级参加明星达人赛，恭喜恭喜。明星达人赛，旨在选出最亮眼的明星达人老师，冠军将直通花样年华年度魅力之星总决赛。</text>
            </div>
            <div class="tip-time">
              <text class="time-tip">倒计时</text>
              <text class="time" :class="{timeEnd: timeEnd}">{{day}}</text>
              <text class="word">天</text>
              <text class="time" :class="{timeEnd: timeEnd}">{{hour}}</text>
              <text class="word">小时</text>
              <text class="time" :class="{timeEnd: timeEnd}">{{minute}}</text>
              <text class="word">分钟</text>
              <text class="time" :class="{timeEnd: timeEnd}">{{second}}</text>
              <text class="word">秒</text>
            </div>
            <div class="tip-text2">
              <text class="text">排行榜：比赛持续10天，仅统计活动期间各位老师所得红花数，最终以红花数确定排名。</text>
            </div>
          </template>
        </div>
      </div>
      <div class="content-wrap">
        <div class="top-three" v-if="rankList.length>0">
          <div class="no-wrap" 
              :class="index===1 ? 'no2' : index===0 ? 'no1' : index===2 ? 'no3' : ''" 
              v-if="index<=2" 
              v-for="(item,index) in rankList" 
              :key="index"
              @click="viewDetail(item.id)">
            <img class="no" v-if="index===0" :src="no1" lazy-load="lazyload" >
            <img class="no" v-if="index===1" :src="no2" lazy-load="lazyload" >
            <img class="no" v-if="index===2" :src="no3" lazy-load="lazyload" >
            <div class="avatar-wrap">
              <img class="avatar" mode="aspectFill" :src="item.thumb3" lazy-load="lazyload" />
            </div>
            <div class="info-wrap">
              <p class="name">{{item.name}}</p>
              <div class="flower-wrap">
                <img class="icon" :src="flower" lazy-load="lazyload" />
                <span class="counts">{{item.like}}朵</span>
              </div>
            </div>
          </div>
        </div>
        <div class="item" v-if="rankList.length>0 && index>2" v-for="(item,index) in rankList" :key="index">
          <div class="info-wrap">
            <div class="rank">{{index+1}}</div>
            <div class="avatar-wrap">
              <img class="avatar" mode="aspectFill" :src="item.thumb3" lazy-load="lazyload" />
            </div>
            <div class="infos">
              <h5 class="title">{{item.name}}</h5>
              <div class="flower-wrap">
                <img class="icon" :src="flower" lazy-load="lazyload" />
                <span class="counts">{{item.like}}朵</span>
              </div>
            </div>
          </div>
          <button class="sendhelp" @click="viewDetail(item.id)">为她助力</button>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters,mapActions} from 'vuex'
  export default {
    data() {
      return {
        page: 1,
        hasMore: true,
        rankList: [],
        residueTime: '',
        noOne: '',
        day: '00',
        hour: '00',
        minute: '00',
        second: '00',
        lazyload: true,
        
        flower: this.imgUrl + 'F_flower@2x.png',
        banner: this.imgUrl + 'F_banner@2x.png',
        // avatar: this.imgUrl + 'N_wd@2x.png',
        no1: this.imgUrl + 'F_no1@2x.png',
        no2: this.imgUrl + 'F_no2@2x.png',
        no3: this.imgUrl + 'F_no3@2x.png',
      }
    },
    computed: {
      timeEnd() {
        return this.residueTime * 1 > 0 ? '' : 'timeEnd'
        // return ''
      },
      end() {
        return this.residueTime * 1 > 0 ? false : true
      },
      ...mapGetters([
        'isAuth',
        'auth',
        'changeInfo',
        'uid',
        'auid'
      ]),
    },
    onLoad() {
      this.page = 1
      this.hasMore = true
      this.rankList = []
      this.residueTime = ''
      // this.noOne = ''
      this._getListS()
    },
    onShow() {
      // this._getListS()
      this.changeInfos()
    },
    onHide() {
      this.setChangeInfo({
        id: '',
        count: 0
      })
    },
    onUnload() {
      this.setIndexInfo({
        id: '',
        borwser: 0,
        shared: 0,
        thumb: 0
      })
    },
    onShareAppMessage() {
      return {
        path: `/pages/star-talent/main?auid=${this.auid}`,
        imageUrl: this.imgUrl + 'share_icon.png',
        title: '【@所有人】咱老百姓自己的舞台'
      }
    },
    methods: {
      viewDetail(id) {
        wx.navigateTo({
          url: `/pages/detail/main?id=${id}`
        })
      },
      //返回上到该页面时改变列表的数据
      changeInfos() {
        if(this.changeInfo.id==="" || this.residueTime<0)
          return
        this.rankList.map(item => {
          if(item.id == this.changeInfo.id) {
            item.like = item.like*1 + this.changeInfo.count
            // item.today = item.today*1 + this.changeInfo.count
          }
        })
        let compare = function (obj1, obj2) {
            let val1 = obj1.like*1
            let val2 = obj2.like*1
            if (val1 < val2) {
                return 1
            } else if (val1 > val2) {
                return -1
            } else {
                return 0
            }            
        } 
        this.rankList.sort(compare)       
      },
      refresh(e) {
        this.page = 1
        this._getListS()
        this.scrollTop = 0
      },
      // 加载更多
      loadMore() {
        if(!this.hasMore) {
          return
        }
        this.page ++
        this._getListS()
      },
      _getListS(val) {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        this.residueTime = ''
        this.hasMore = true
        this.$fly.get(`index.php?m=minpackage&c=index&a=rank_lists`, {
          auth: this.auth,
          page: this.page,
          aid: 7,
        }).then(res => {
          wx.hideLoading()
          if(res.result == 1) {
            this.residueTime = res.residue_time
            // this.residueTime = -1
            // this.noOne = res.res
            if(this.page <= 1) {
              this.rankList = res.data
            }else {
              this.rankList = this.rankList.concat(res.data)
            }
            this._checkMore(res.data)

            if(val == -1)
              return
            this._countDown(res.residue_time)
          }
        })
      },
      _checkMore(data) {
        if(data.length<20 || !data.length) {
        // if(!data.length) {
          this.hasMore = false
        }
      },
      _countDown(time) {
        let that = this
        if(time<=0){
          this.day = '00'
          this.hour = '00'
          this.minute = '00'
          this.second = '00'
          return
        }
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          if(time<0) {
            that._getListS(-1)
            clearInterval(this.timer)
            return
          }
          this.day = this._padLeft(Math.floor(time/60/60/24))
          this.hour = this._padLeft(Math.floor(time/60/60%24))
          this.minute = this._padLeft(Math.floor(time/60%60))
          this.second = this._padLeft(Math.floor(time%60))
          time--
        },1000)
      },
      _padLeft(v) {
        return v*1<=9 ? '0'+v : v
      },
      ...mapActions([
        'setChangeInfo',
        'setIndexInfo'
      ])
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .container {
    @container();
    .list-wrap {
      @container();
    }
    .header {
      position: relative;
      margin: 30px auto;
      .banner-wrap {
        position: relative;
        margin: 30px auto;
        text-align: center;
        overflow: hidden;
        .banner {
          width: 240px;
          height: 58px;
        }
      }
      .top-tip {
        position: relative;
        margin-top: 16px;
        padding: 0 15px 30px;
        border-bottom: 5px solid #f5f5f5;
        box-sizing: border-box;
      }
      .champion {
        position: relative;
        font-size: 31px;
        color: #e02e24;
        line-height: 45px;
        text-align: center;
      }
      .tip-text {
        margin-bottom: 20px;
        text-align: justify;
      }
      .tip-text2 {
        margin-top: 20px;
        text-align: justify;
        .text {
          line-height: 30px;
        }
      }
      .text {
        font-size: 20px;
        color: #8b2a2a;
        line-height: 35px;
      }
      .redtext {
        display: inline-block;
        margin-left: -5px;
        color:  #f40009;
      }
      .twoday-wrap {
        position: relative;
        text-align: center;
        font-size: 14px;
        line-height: 14px;
        text-align: center;
        .day {
          margin-top: 10px;
          color: #333;
          .flowers {
            color: #f40009;
          }
        }
      }
      .rank-first {
        position: relative;
        margin: 20px 0;
        width: 100%;
        height: 86px;
      }
      .rank-one {
        display: block;
        width: 100%;
        height: 86px;
      }
      
      .tip-time {
        font-size: 0;
        text-align: center;
      }
      .time-tip {
        margin-right: 10px;
        font-size: 16px;
        color: #333;
        line-height: 16px;
      }
      .tip-time > text {
        display: inline-block;
        margin: 0 3px;
        vertical-align: middle;
      }
      .time {
        width: 22px;
        height: 22px;
        line-height: 22px;
        font-size: 14px;
        color: #fff;
        background: #f40009;
        border-radius: 4px;
      }
      .timeEnd {
        background: #999;
      }
      .active {
        background-color: #f40009;
      }
      .word {
        font-size: 14px;
        color: #333;
        line-height: 14px;
      }
    }
    .content-wrap {
      position: relative;
      margin-bottom: 20px;
      width: 100%;
      box-sizing: border-box;
      .top-three {
        position: relative;
        width: 100%;
        height: 159px;
        vertical-align: bottom;
        .avatar-wrap {
          position: absolute;
          background:#d8d8d8;
          border: 2px solid #ffffff;
          width: 54px;
          height: 54px;
          border-radius: 100%;
          box-sizing: border-box;
          overflow: hidden;
          .avatar {
            position: relative;
            width: 100%;
            height: 100%;
          }
        }
        .no-wrap {
          position: absolute;
          bottom: 0;
          .info-wrap {
            position: absolute;
            margin-left: 10%;
            width: 80%;
            box-sizing: border-box;
            .name {
              font-size: 18px;
              color: #333;
              text-align: center;
              .ellipsis(2);
            }
            .flower-wrap {
              position: relative;
              width: 100%;
              text-align: center;
              .icon {
                position: relative;
                diplay: inline-block;
                top: 3px;
                margin-right: 6px;
                width: 17px;
                height: 17px;
              }
              .counts {
                font-size:12px;
                color:#333;
                line-height:14px;
              }
            }
          }

        }
        .no2 {
          width: 133px;
          height: 143px;
          z-index: 10;
          .avatar-wrap {
            top: 15px;
            left: 37px;
          }
          .info-wrap {
            bottom: 13px;
            padding-right: 10px;
          }
        }
        .no1 {
          left: 105px;
          width: 163px;
          height: 159px;
          z-index: 20;
          .avatar-wrap {
            top: 13px;
            left: 52px;
          }
          .info-wrap {
            bottom: 30px;
            padding-right: 10px;
            .name {
              color:#e02e24 !important;
            }
          }
          .flower-wrap {
            .counts {
                color:#e02e24 !important;
              }
          }
        }
        .no3 {
          right: 0;
          width: 138px;
          height: 135px;
          z-index: 10;
          .avatar-wrap {
            top: 11px;
            left: 68px;
          }
          .info-wrap {
            padding-left: 15px;
            bottom: 9px;
          }
        }
        .no {
          position: relative;
          width: 100%;
          height: 100%;
        }
      }
      .item {
        position: relative;
        display: flex;
        align-items: center;
        padding: 22px 11px 18px;
        border-bottom: 1px solid #e8e8e8;
        box-sizing: border-box;
        .info-wrap {
          position: relative;
          display: flex;
          flex: 1;
          .rank {
            position: relative;
            margin-right: 5px;
            text-align: center;
            width: 50px;
            font-size: 18px;
            line-height: 54px;
            color: #333;
            font-weight: bold;
          }
          .avatar-wrap {
            position: relative;
            margin-right: 15px;
            width: 54px;
            height: 54px;
            border-radius: 100%;
            overflow: hidden;
            .avatar {
              width: 100%;
              height: 100%;
            }
          }
          .infos {
            position: relative;
            flex: 1;
            .title {
              margin: 2px 0 6px;
              font-size:18px;
              color:#333;
              display:-webkit-box;
              -webkit-line-clamp:1;
              -webkit-box-orient:vertical;
              overflow:hidden;
              text-overflow:ellipsis;
            }
            .flower-wrap {
              position: relative;
              .icon {
                position: relative;
                top: 3px;
                margin-right: 5px;
                width: 18px;
                height: 18px;
              }
              .counts {
                position: relative;
                font-size:14px;
                color:#e02e24;
                line-height:14px;
              }
            }
          }
        }
        .sendhelp {
          margin-left: 15px;
          padding: 0 11px;
          border:1px solid #e02e24;
          border-radius:6px;
          height:35px;
          line-height: 35px;
          color: #e02e24;
          font-size: 14px;
          background-color: transparent;
          box-sizing: border-box;
        }
        .sendhelp:after {
          border: none;
        }
      }
    }
  }
</style>
