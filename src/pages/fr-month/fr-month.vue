<template>
  <div class="container">
    <!-- 活动未开始 -->
    <no-start :status="status" :notime="notime" @activitying="activitying"></no-start>
    
    <!-- <scroll-view class="list-wrap"
            v-if="rankListFR.length"
            enable-back-to-top
             scroll-y
             scrolltolower=150
             @scrolltolower="loadMore"
        > -->
        <scroll-view class="list-wrap"
            v-if="rankListFR.length"
            enable-back-to-top
            scroll-y
            scrolltolower=150
            :style="status==2?'position:fixed !important;height:auto !important;box-sizing:border-box;overflow:hidden;':''"
        >
      <div class="banner-wrap">
        <img class="banner" :src="banner" lazy-load="lazyLoad" />
      </div>
      <activity :tip="tip" :hasTime="has_time" :status="status"></activity>
      <div v-if="rankListFR.length > 0" class="lists">
        <div v-if="rankListFR.length > 0" class="item" v-for="(item, index) in rankListFR" :key="index" @click="viewDetail(item.id)">
          <!-- <div class="rank-tit" :style="index===1 ? 'height: 76px !important;':''"> -->
          <!-- <div class="rank-tit" :style="index===1 ? 'height: 69px !important;':''"> -->
          <div class="rank-tit" :style="index===1 ? 'height: auto !important;':''">
            <div class="no1-img" v-if="index==1">
              <img class="gold-cat" :src="goldCat" />
              <img class="top-img" :src="titNo1" />
            </div>
            <img class="top-img" v-else :src="tit" />
            <span v-if="index > 1" class="rankno">第{{index + 1}}名</span>
            <span v-else-if="index === 0" class="rankno">第2名</span>
            <span v-else class="rankno">第1名</span>
          </div>
          <img class="avatar" :src="item.thumb" lazy-load="lazyLoad" alt="">
          <p class="name">{{item.name}}</p>
          <div class="infos">
            <img class="flowers" :src="flower" lazy-load="lazyLoad" />
            <p class="flower"><span class="num">{{item.like}}</span>朵</p>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
  import Activity from 'components/activity'
  import NoStart from 'components/noStart'
  import {mapGetters,mapActions} from 'vuex'
  export default {
    data() {
      return {
        page: 1,
        hasMore: true,
        rankListFR: [],
        residueTime: '',
        notime: '',
        status: '',
        has_time: {  //倒计时剩余时间
          day: '00',
          hour: '00',
          minute: '00',
          second: '00',
        },
        activityNum: '',
        tip: [
          '经过三期花朵排行比赛，很多老师都为人熟知，本次月赛，是一次拔高赛，冠军将直通名人堂，成为花样年华名人堂，首位殿堂级名师！',
          '排行榜：活动持续14天，仅统计活动期间各位老师所得红花数，最终以红花数，确定最后排名。',
          '评选活动已经结束',
          '',
        ],
        lazyLoad: true,
        banner: this.imgUrl + 'fr_month@2x.png',
        flower: this.imgUrl + 'fr_m_flower@2x.png',
        tit: this.imgUrl + 'fr_m_no@2x.png',
        titNo1: this.imgUrl + 'fr_m_no1@2x.png',
        goldCat: this.imgUrl + 'fr_M_gold@2x.png'
      }
    },
    onLoad(query) {
      this.page = 1
      this.hasMore = true
      this.rankListFR = []
      this.residueTime = 1
      this.activityNum = query.activityNum
      this._getListFR()
    },
    onShow() {
      this.changeInfos()
    },
    onHide() {
      this.setChangeInfo({
        id: '',
        count: 0
      })
      this.setIndexInfo({
        id: '',
        borwser: 0,
        shared: 0,
        thumb: 0
      })
    },
    onUnload() {
      this.setIndexInfo({
        id: '',
        borwser: 0,
        shared: 0,
        thumb: 0
      })
      this.setChangeInfo({
        id: '',
        count: 0
      })
    },
    computed: {
      ...mapGetters([
        'isAuth',
        'auth',
        'changeInfo',
        'uid',
        'auid'
      ])
    },
    methods: {
      activitying(e) {
        this.page = 1
        this.hasMore = true
        this.rankListFR = []
        this.residueTime = 1
        this._getListFR()
      },
      viewDetail(id) {
        wx.navigateTo({
          url: `/pages/detail/main?id=${id}`
        })
      },
      //返回上到该页面时改变列表的数据
      changeInfos() {
        if(this.changeInfo.id==="" || this.residueTime<0)
          return
        this.rankListFR.map((item) => {
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
        this.rankListFR.sort(compare) 
        // 第一名和第二名交换顺序   
        this.tip[3] = this.rankListFR[0]
        let tempInfo = this.deepClone(this.rankListFR)
        tempInfo[0] = ''
        tempInfo[1] = ''
        tempInfo[0] = this.rankListFR[1]
        tempInfo[1] = this.rankListFR[0]
        this.rankListFR = tempInfo
      },
      refresh(e) {
        this.page = 1
        this._getListFR()
        this.scrollTop = 0
      },
      // 加载更多
      loadMore() {
        if(!this.hasMore) {
          return
        }
        this.page ++
        this._getListFR()
      },
      _getListFR(val) {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        this.residueTime = ''
        this.hasMore = true
        this.$fly.get(`index.php?m=minpackage&c=index&a=rank_lists`, {
          auth: this.auth,
          page: this.page,
          aid: this.activityNum,
        }).then(res => {
          wx.hideLoading()
          if(res.result == 1) {
            this.status = res.status
            if(this.status==2) {  //未开始
              this.notime = res.residue_time
            }else if(this.status == 1) {  //进行中
              this.residueTime = res.residue_time
            }else if(this.status == 0) { //结束
              this.residueTime = res.residue_time
            }
            if(this.page <= 1) {
              this.tip[3] = res.data[0]
              let tempInfo = this.deepClone(res.data)
              tempInfo[0] = ''
              tempInfo[1] = ''
              tempInfo[0] = res.data[1]
              tempInfo[1] = res.data[0]
              this.rankListFR = tempInfo
            }else {
              this.rankListFR = this.rankListFR.concat(res.data)
            }
            this._checkMore(res.data)
            if(val == -1)
              return
            this._countDown(res.residue_time)
          }
        })
      },
      deepClone(obj){
        let _obj = JSON.stringify(obj);
        let objClone = JSON.parse(_obj);
          return objClone
      },
      _checkMore(data) {
        if(data.length < 20 || !data.length) {
        // if(!data.length) {
          this.hasMore = false
        }
      },
      _countDown(time) {
        let that = this
        if(time<=0){
            this.has_time.day = '00'
            this.has_time.hour = '00'
            this.minute = '00'
            this.has_time.second = '00'
          return
        }
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          if(time<0) {
            that._getListFR(-1)
            clearInterval(this.timer)
            return
          }
          this.has_time.day = this._padLeft(Math.floor(time/60/60/24))
          this.has_time.hour = this._padLeft(Math.floor(time/60/60%24))
          this.has_time.minute = this._padLeft(Math.floor(time/60%60))
          this.has_time.second = this._padLeft(Math.floor(time%60))
          time--
        },1000)
      },
      _padLeft(v) {
        return v*1<=9 ? '0'+v : v
      },
      _padStyle() {  //解决每行不够三个中间空的问题

      },
      ...mapActions([
        'setChangeInfo',
        'setIndexInfo'
      ])
    },
    components: {
      Activity,
      NoStart
    },
    onShareAppMessage() {
      return {
        path: `/pages/fr-month/main?auid=${this.auid}`,
        imageUrl: this.imgUrl + 'share_icon.png',
        title: '【@所有人】咱老百姓自己的舞台'
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .container {
    @container();
    overflow: hidden;
    .list-wrap {
      @container();
      z-index: 10;
    }
    .banner-wrap {
      position: relative;
      width: 100%;
      .banner {
        position: relative;
        display: block;
        margin: 30px auto;
        width: 200px;
        height: 157px;
      }
    }
    .lists {
      position: relative;
      padding: 0 15px;
      width: 100%;
      box-sizing: border-box;
      .item {
        position: relative;
        display: inline-block;
        margin-top: 25px;
        width: calc(100% / 3);
        text-align: center;
        border-bottom: 1px solid #e8e8e8;
        .rank-tit {
          position: relative;
          margin: 0 auto 10px;
          width: 108px;
          height: 30px;
          .no1-img {
            position: relative;
            width: 100%;
            height: 100%;
            .gold-cat {
              position: relative;
              display:block;
              margin:0 auto;
              top:1px;
              width: 59px;
              height: 39px;
            }
          }
          .top-img {
            position: relative;
            display: block;
            width: 100%;
            height: 30px;
          }
          .rankno {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            font-size: 15px;
            color: #fff;
            line-height: 30px;
            text-align: center;
          }
        }
        .avatar {
          position: relative;
          display: block;
          margin: 0 auto;
          width: 86px;
          height: 65px;
          border-radius: 2px;
        }
        .name {
          position: relative;
          margin: 10px auto 4px;
          width: 100%;
          line-height:15px;
          color:#333;
          font-size:15px;
          text-align:center;
          @textLimit();
        }
        .infos {
          position: relative;
          margin-bottom: 26px;
          width: 100%;
          text-align: center;
          .flowers {
            position: relative;
            top: 2px;
            margin-right: 5px;
            width: 16px;
            height: 16px;
          }
          .flower {
            display: inline-block;
            line-height: 12px;
            font-size: 12px;
            color: #999;
            .num {
              margin-right: 3px;
              color:#e02e24;
            }
          }
        }
      }
    }
  }
</style>

