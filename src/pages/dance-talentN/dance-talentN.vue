<template>
  <div class="container">
    <!-- 最美舞队评选页面 -->
    <scroll-view class="list-wrap"
            v-if="rankList.length"
            enable-back-to-top
             scroll-y
             scrolltolower=280
             @scrolltolower="loadMore"
        >
      <div class="header">
        <div class="banner-wrap">
          <img class="banner" :src="banner" lazy-load="lazyload" />
        </div>
        <div class="top-tip">
          <!-- 活动结束 -->
          <template v-if="end">
            <p class="champion" v-if="rankList[0]">恭喜{{rankList[0].name}}</p>
            <p class="champion">获得第一名</p>
            <p class="champion">被选为花样年华最美舞队</p>
            <p class="end-tip">评选活动已经结束</p>
          </template>
          <!-- 活动进行中 -->
          <template v-if="!end">
            <div class="tip-text">
              <text class="text">舞队，是跳舞姐妹们一起攒起来的团体，队长很重要，但每位成员也很重要，这次花样年华举办的最美舞队评选活动，就是希望能够展现舞队风采，展示舞队里每位老师别样魅力！加油吧，各个舞队！加油吧，各位老师！</text>
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
              <text class="text">排行榜：评选活动持续14天，仅统计活动期间各舞队所得红花数，最终以红花数确定排名。</text>
            </div>
          </template>
        </div>
      </div>

      <div class="content-wrap">
        <template v-for="(item,index) in rankList">
          <div class="dt-item" :key="index" @click="viewDetail(item.id)">
            <div class="head-img" v-if="index<=2">
              <img v-if="index===0" class="top-three" :src="no1" lazy-load="lazyload" />
              <img v-if="index===1" class="top-three" :src="no2" lazy-load="lazyload" />
              <img v-if="index===2" class="top-three" :src="no3" lazy-load="lazyload" />
            </div>
            <div class="item-wrap">
              <div class="left-avatar">
                <img class="avatar" mode="widthFix" :src="item.thumb" lazy-load="lazyload" />
                <div class="corner">
                  <img class="rank" :src="rank" lazy-load="lazyload" />
                  <span class="no">{{index+1}}</span>
                </div>
                <div class="bottom">
                  <img class="flower-icon" :src="flower" lazy-load="lazyload" />
                  <span class="count">{{item.like}}朵</span>
                </div>
              </div>
              <div class="info">
                <h5 class="title">{{item.name}}</h5>
                <p class="introduce">简介：{{item.title}}</p>
              </div>
            </div>
          </div>
        </template>
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
        // noOne: '',
        day: '00',
        hour: '00',
        minute: '00',
        second: '00',
        lazyload: true,

        banner: this.imgUrl + 'N_banner@2x.png',
        no1: this.imgUrl + 'N_no1@2x.png',
        no2: this.imgUrl + 'N_no2@2x.png',
        no3: this.imgUrl + 'N_no3@2x.png',
        avatar: this.imgUrl + 'F_star@2x.png',
        rank: this.imgUrl + 'N_no_show@2x.png',
        flower: this.imgUrl + 'F_flower@2x.png',
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
      this.residueTime = 1
      // this.noOne = ''
      this._getListN()
    },
    onShow() {
      // this._getListN()
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
        path: `/pages/dance-talentN/main?auid=${this.auid}`,
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
        this._getListN()
        this.scrollTop = 0
      },
      // 加载更多
      loadMore() {
        if(!this.hasMore) {
          return
        }
        this.page ++
        this._getListN()
      },
      _getListN(val) {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        this.residueTime = ''
        this.hasMore = true
        this.$fly.get(`index.php?m=minpackage&c=index&a=rank_lists`, {
          auth: this.auth,
          page: this.page,
          aid: 8,
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
            that._getListN(-1)
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
      margin: 30px auto 0;
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
      .champion{
        position: relative;
        font-size:31px;
        color:#e02e24;
        line-height:45px;
        text-align:center;
      }
      .end-tip {
        position: relative;
        margin-top: 30px;
        font-size:20px;
        color:#8b2a2a;
        line-height:20px;
        text-align:center;
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
        font-size:20px;
        color:#8b2a2a;
        line-height:35px;
      }
      .redtext {
        display: inline-block;
        margin-left: -5px;
        color: #f40009;
      }
      .twoday-wrap {
        position: relative;
        text-align: center;
        font-size:14px;
        line-height:14px;
        text-align:center;
        .day {
          margin-top: 10px;
          color:#333;
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
      width: 100%;
      padding: 0 15px;
      box-sizing: border-box;
      .dt-item {
        position: relative;
        padding: 20px 0;
        width: 100%;
        border-bottom: 1px solid #e8e8e8;
        box-sizing: border-box;
        .head-img {
          position: relative;
          margin: 10px auto 30px;
          width: 146px;
          height: 88px;
          overflow: hidden;
          .top-three {
            position: relative;
            width: 100%;
            height: 100%;
          }
        }
        .item-wrap {
          position: relative;
          display: flex;
          justify-content: space-between;
          // align-items: center;
          .left-avatar {
            position: relative;
            margin-right: 15px;
            width: 130px;
            height: 110px;
            box-sizing: border-box;
            overflow: hidden;
            .avatar {
              position: absolute;
              left: 0;
              top: 0;
              width: 130px;
              min-height: 110px !important;
              z-index: 1;
            }
            .corner {
              .absoluteNum(0,0,30px,30px);
              z-index: 5;
              overflow: hidden;
              .rank {
                position: relative;
                width: 100%;
                height: 100%;
              }
              .no {
                position: absolute;
                display: inline-block;
                left: 0;
                padding-right: 5px;
                width: 30px;
                height: 30px;
                text-align: center;
                font-size:16px;
                color:#fff;
                box-sizing: border-box;
              }
            }
            .bottom {
              position: absolute;
              bottom: 0;
              left: 0;
              background:rgba(51,51,51,0.50);
              width: 100%;
              height:28px;
              line-height: 28px;
              z-index: 10;
              .flower-icon {
                position: relative;
                display: inline-block;
                top: 4px;
                margin: 0 5px 0 2px;
                width: 20px;
                height: 20px;
              }
              .count {
                position: relative;
                font-size:14px;
                color:#fff;
                line-height:14px;
              }
            }
          }
          .info {
            position: relative;
            flex: 1;
            color: #333;
            .title {
              margin-bottom: 8px;
              font-size:20px;
              line-height:28px;
              text-align: center;
              .ellipsis(1);
              text-align: justify;
            }
            .introduce {
              font-size:16px;
              line-height:24px;
              .ellipsis(3);
              text-align: justify;
            }
          }
        }
      }
    }
  }
</style>
