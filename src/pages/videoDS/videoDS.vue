<template>
  <div class="container">
    <div class="ranking" v-if="rankList.length">
      <scroll-view class="list-wrap" 
            enable-back-to-top
             scroll-y
             scrolltolower=150
             @scrolltolower="loadMore"
        >
        <div class="top-tip" v-show="rankList.length">
          <div class="tip-text">
            <text class="text" v-if="residueTime*1 > 0">排行榜:榜单时间为倒计时7天，7天倒计时结束时榜单的排行为最终排名。</text>
            <p class="text" v-if="residueTime*1 < 0">洋葱视频形象大使大赛已圆满结束，恭喜<text class="redtext">{{firstData.name}}</text>以<text class="redtext">{{firstData.like}}</text>朵花的成绩获得第一名</p>
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
        </div>
        <!-- 第一名 -->
        <div class="grade1" @click="viewDetail(firstData.id)">
          <!-- <image v-if="end" class="bg-img" src="/static/image/rankFirst.png" lazy-load="lazyload"></image> -->
          <image v-if="end" class="bg-img" :src="rankFirst" lazy-load="lazyload"></image>
          <div :class="[end ? 'header-win' : 'header']">
            <text v-if="!end" class="myrank">第1名</text>
            <p v-if="end" class="myrank">第<image class="rankone" style="margin: 0 8px 0 0;" :src="rankone"></image>名</p>
            <image class="rank-icon" :src="flowerbtn"></image>
            <text class="flowers">{{firstData.like}}朵</text>
          </div>
          <div class="twoday-wrap">
            <p class="yesterday day">昨日新增：<text class="flowers" style="color: #333">{{firstData.yesterday}}朵</text></p>
            <p class="today day">今日新增：<text class="flowers" style="color: #333">{{firstData.today}}朵</text></p>
          </div>
          <div class="content">
            <div class="picture-wrap">
              <image class="picture" mode="aspectFill" lazy-load="lazyload" :src="firstData.thumb3"></image>
            </div>
            <div class="info-wrap">
              <p class="name">姓名：{{firstData.name}}</p>
              <p class="introduce">{{firstData.title}}</p>
            </div>
          </div>
        </div>
        <div class="list">
          <!-- 二名以后 -->
          <div v-for="(item,index) in rankList" v-if="index>0" class="grade-item" :key="index" @click="viewDetail(item.id)">
            <div v-if="index<3" :class="[end ? 'header-win' : 'header']">
              <text v-if="!end" class="myrank">第{{index+1}}名</text>
              <p v-if="end && index==1" class="myrank">第<image class="rankone" lazy-load="lazyload" :src="ranktwo"></image>名</p>
              <p v-if="end && index==2" class="myrank">第<image class="rankone" lazy-load="lazyload" :src="rankthree"></image>名</p>
              <image class="rank-icon" :src="flowerbtn"></image>
              <text class="flowers">{{item.like}}朵</text>
            </div>
            <div v-else class="header">
              <text class="myrank">第{{index+1}}名</text>
              <image class="rank-icon" lazy-load="lazyload" :src="flowerbtn"></image>
              <text class="flowers">{{item.like}}朵</text>
            </div>
            <div class="twoday-wrap">
              <p class="yesterday day">昨日新增:<text class="flowers">{{item.yesterday}}朵</text></p>
              <p class="today day">今日新增:<text class="flowers">{{item.today}}朵</text></p>
            </div>
            <div class="content">
              <div class="picture-wrap">
                <image class="picture" mode="aspectFill" lazy-load="lazyload" :src="item.thumb3"></image>
              </div>
              <div class="info-wrap">
                <p class="name">姓名：{{item.name}}</p>
                <p class="introduce">{{item.title}}</p>
              </div>
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
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
        residueTime: 1,
        noOne: '',
        day: '00',
        hour: '00',
        minute: '00',
        second: '00',
        lazyload: true,
        activityNum: '',
        // end: true,

        rankFirst: this.imgUrl + 'rankFirst.png',
        rankone: this.imgUrl + 'rankone.png',
        flowerbtn: this.imgUrl + 'flowerbtn.png',
        ranktwo: this.imgUrl + 'ranktwo.png',
        rankthree: this.imgUrl + 'rankthree.png',
      }
    },
    computed: {
      timeEnd() {
        return this.residueTime * 1 > 0 ? '' : 'timeEnd'
      },
      end() {
        return this.residueTime * 1 > 0 ? false : true
      },
      firstData() {
        return this.rankList[0]
      },
      ...mapGetters([
        'isAuth',
        'auth',
        'changeInfo',
        'uid',
        'auid'
      ]),
    },
    onLoad(query) {
      this.activityNum = query.activityNum
      this._getList2()
    },
    onShow() {
      this.changeInfos()
      // this.rankList = []
      // this.page = 1
      // this.hasMore = true
      // this._getList2()
    },
    onHide() {
      this.setChangeInfo({
        id: '',
        count: 0
      })
    },
    onShareAppMessage() {
      return {
        path: `/pages/rank-list2/main?auid=${this.auid}`,
        imageUrl: '/static/image/shared.png',
        title: '【@所有人】总有一些你想看的~'
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
        this.rankList.map(item => {
          if(item.id == this.changeInfo.id) {
            item.like = item.like*1 + this.changeInfo.count
            item.today = item.today*1 + this.changeInfo.count
          }
        })
      },
      refresh(e) {
        this.page = 1
        this._getList2()
        this.scrollTop = 0
      },
      // 加载更多
      loadMore() {
        if(!this.hasMore) {
          return
        }
        this.page ++
        this._getList2()
      },
      _getList2(val) {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        this.hasMore = true
        this.$fly.get(`index.php?m=minpackage&c=index&a=rank_lists`, {
          auth: this.auth,
          page: this.page,
          aid: this.activityNum,
        }).then(res => {
          wx.hideLoading()
          if(res.result == 1) {
            this.residueTime = res.residue_time
            this.noOne = res.res
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
        if(!data.length) {
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
            that._getList2(-1)
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
        'setChangeInfo'
      ])
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .container,.list-wrap {
    @container();
  }
  .top-tip {
    position: relative;
    margin-top: 16px;
    padding: 0 15px 10px;
    border-bottom: 5px solid #f5f5f5;
    box-sizing: border-box;
  }
  .tip-text {
    margin-bottom: 20px;
    text-align: justify;
  }
  .text {
    font-size:20px;
    color:#333;
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
    font-size:16px;
    color:#333;
    line-height:16px;
  }
  .tip-time > text {
    display: inline-block;
    margin: 0 3px;
    vertical-align: middle;
  }
  .time {
    width:22px;
    height:22px;
    line-height:22px;
    font-size:14px;
    color:#fff;
    background:#f40009;
    border-radius:4px;
  }
  .timeEnd {
    background: #999;
  }
  .active {
    background-color: #f40009;
  }
  .word {
    font-size:14px;
    color:#333;
    line-height:14px;
  }

  .header {
    position: relative;
    height: 32px;
    line-height: 32px;
    font-size:18px;
    text-align: center;
    .myrank {
      display: inline-block;
      color:#333;
    }
    .rank-icon {
      vertical-align: bottom;
      margin: 0 12px;
      width: 32px;
      height: 32px;
    }
    .flowers {
      color:#f40009;
    }
  }

  .header-win {
    position: relative;
    font-size:18px;
    text-align: center;
    .myrank {
      display: inline-block;
      color:#333;
      .rankone {
        vertical-align: middle;
        margin: 0 2rpx 0 -8rpx;
        width: 40px;
        height: 40px;
      }
    }
    .rank-icon {
      vertical-align: middle;
      margin: 0 12px;
      width: 32px;
      height: 32px;
    }
    .flowers {
      color:#333;
    }
  }
  .redtext {color: #f40009;}

  .ranking {
    width:100%;
    height: 100%;
    box-sizing: border-box;
    .grade1 {
      position: relative;
      padding-top: 30px;
      .bg-img {
        @absoluted();
      }
      .header {
        .rank-icon {
          margin: 0 12px;
        }
      }
      .content {
        position: relative;
        display: flex;
        align-items: center;
        padding: 20px 35px 30px;
        border-bottom: 1px solid #e8e8e8;
        font-size: 0;
        .picture-wrap {
          position: relative;
          margin-right: 15px;
          width: 140px;
          height: 187px;
          .picture {
            width: 100%;
            height: 100%;
          }
        }
        .info-wrap {
          flex: 1;
          position: relative;
          .name {
            font-size:18px;
            color:#333;
            text-align:left;
            font-weight: 700;
          }
          .introduce {
            margin-top: 15px;
            font-size:16px;
            color:#333;
            line-height:30px;
            text-align: justify;
          }
        }
      }
    }
    .list {
      position: relative;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .grade-item {
        margin-top: 30px;
        padding-bottom: 30px;
        border-bottom: 1px solid #e8e8e8;
        width: 50%;
        .header,.header-win {
          .rank-icon {
            margin: 0 6px;
          }
          .myrank {
            .rankone {
              width: 30px;
              height: 30px;
            }
          }
        }
        .content {
          position: relative;
          .picture-wrap {
            margin: 20px auto;
            width: 140px;
            height: 187px;
            .picture {
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
          }
          .info-wrap {
            position: relative;
            font-size:18px;
            color:#333;
            .name {
              margin-bottom: 15px;
              text-align:center;
              font-weight: 700;
            }
            .introduce {
              margin: 0 auto;
              width: 150px;
              line-height:30px;
              font-size: 16px;
              text-align: justify;
            }
          }
        }
      }
    }
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