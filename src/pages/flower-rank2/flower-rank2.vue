<template>
  <div class="container">
    <!-- 花朵排行二期活动 -->

    <scroll-view class="list-wrap" 
              scroll-y
              enable-back-to-top
              scrolltolower=150
              @scrolltolower="loadMore">

  	<div class="top-tip" v-show="rankList.length">
  	  <div class="tip-text">
        <text class="text">排行榜:榜单时间为倒计时7天，排行的“花数”每天更新数量，7天倒计时结束时榜单的排行为最终排名。</text>     
  	  	
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
  	<div class="ranking" v-show="rankList.length">
  	  <div class="ranking-title">
  	  	<image class="rank-img" :src="flowerbtn" :lazy-load="lazyLoad"></image>
  	  	<!-- <text class="rank-tit">花朵排行活动二期</text> -->
  	  	<text class="rank-tit" v-if="activityNum">花朵排行活动{{listNum[activityNum]}}期</text>
  	  </div>
  	  <ul class="rank-group">

        <!-- <scroll-view class="list-wrap" 
              scroll-y
              enable-back-to-top
              scrolltolower=150
              @scrolltolower="loadMore"> -->
          <li class="rank-item" v-for="(item, index) in rankList" @click="viewDetail(item.id)" :key="item.id">
            <!-- 已经结束 -->
            <template v-if="timeEnd=='timeEnd' && index<3">
              <image v-if="index==0" class="grade" :src="no1" :lazy-load="lazyLoad"></image>
              <image v-else-if="index==1" class="grade" :src="no2" :lazy-load="lazyLoad"></image>
              <image v-else-if="index==2" class="grade" :src="no3" :lazy-load="lazyLoad"></image>
            </template>
            <div v-else class="grade" style="margin-top: 0;">{{index + 1}}</div>
  	  	    <div class="right">
  	  	  	  <text class="article-tit texts">{{item.title}}</text>
              <text class="flower-count texts">{{item.like}}朵</text>
  	  	    </div>
  	  	  </li>
        <!-- </scroll-view> -->

  	  </ul>
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
        pageNum: 40,

      	rankList: [],
      	residueTime: 1,
      	noOne: '',
      	day: '00',
      	hour: '00',
      	minute: '00',
        second: '00',
        lazyLoad: true,
        activityNum: '',
        listNum: ['零','一','二','二','四','五','六','七','八','九','十'],
        
        flowerbtn: this.imgUrl + 'flowerbtn.png',
        no1: this.imgUrl + 'no1.png',
        no2: this.imgUrl + 'no2.png',
        no3: this.imgUrl + 'no3.png',
      }
    },
    computed: {
      timeEnd() {
        return this.residueTime * 1 > 0 ? '' : 'timeEnd'
      },
      ...mapGetters([
        'isAuth',
        'auth',
        'uid',
        'auid',
        'changeInfo'
      ])
    },
    onShareAppMessage() {
      return {
        path: `/pages/index/main?auid=${this.auid}`,
        imageUrl: this.imgUrl + 'share_icon.png',
        title: '【@所有人】咱老百姓自己的舞台'
      }
    },
    onLoad(query) {
      this.activityNum = query.activityNum
      this._getList()
    },
    onShow() {
      this.changeInfos2()
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
  	methods: {
      viewDetail(id) {
        wx.navigateTo({
          url: `/pages/detail/main?id=${id}`
        })
      },
      //返回上到该页面时改变列表的数据
      changeInfos2() {
        this.rankList.map(item => {
          if(item.id == this.changeInfo.id) {
            item.like = item.like*1 + this.changeInfo.count
            item.today = item.today*1 + this.changeInfo.count
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
      // 加载更多
      loadMore() {
        if(!this.hasMore) {
          return
        }
        this.page ++
        this._getList()
      },
  	  _getList(val) {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        this.hasMore = true
        // this.$fly.get(`index.php?m=minpackage&c=index&a=ranking_flower`, {
        // this.$fly.get(`index.php?m=minpackage&c=index&a=rank_old`, {
        this.$fly.get(`index.php?m=minpackage&c=index&a=rank_lists`, {
          auth: this.auth,
          page: this.page,
          aid: this.activityNum,
          num: this.pageNum,
        }).then(res => {
      	  wx.hideLoading()
          if(res.result == 1) {
            // this.rankList = res.data
            this.residueTime = res.residue_time
            this.noOne = res.res
            // if(val == -1)
            //   return
            // this._countDown(res.residue_time)

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
        if(data==undefined || data.length < this.pageNum) {
          this.hasMore = false
        }
      },
      _countDown(time) {
        let that = this
      	if(time<0){
      	  this.day = '00'
          this.hour = '00'
          this.minute = '00'
          this.second = '00'
          return
      	}
      	clearInterval(this.timer)
        this.timer = setInterval(() => {
          if(time<0) {
            that._getList(-1)
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
  	position: relative;
  }
  .list-wrap {
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
  .noOne {
  	position: absolute;
  	top: 20px;
  	left: 0;
  	right: 0;
    font-size:18px;
    font-weight: 700;
    color:#fff;
    text-align:center;
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
  .ranking {
  	padding: 0 0 20px;
  	box-sizing: border-box;
  }
  .ranking-title {
    padding: 15px 0;
    height: 32px;
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #e8e8e8;
  }
  .rank-img {
  	margin-top: -2px;
  	margin-right: 10px;
  	vertical-align: middle;
    width: 37px;
    height: 37px;
    z-index: 10;
  }
  .rank-tit {
    display: inline-block;
    vertical-align: top;
    font-size:24px;
    line-height: 32px;
	  color:#333;
  }
  .rank-group {
  	position: relative;
  }

  .rank-item {
  	position: relative;
  	display: flex;
  	padding: 16px 0 0 11px;
  	width: 100%;
  	height: 80px;
  	box-sizing: border-box;
  }
  .rank-item .grade {
    position: relative;
    margin-top: 9px;
    margin-right: 11px;
    width: 25px;
    height: 28px;
    text-align: center;
    line-height: 48px;
    box-sizing: border-box;
  	font-size:20px;
  	color:#333;
  }
  .right {
  	display: flex;
  	flex: 1;
  	justify-content: space-between;
  	max-width: calc(100% - 54px);
  	vertical-align: top;
  	padding-bottom: 16px;
  	padding-right: 16px;
  	line-height: 48px;
  	border-bottom: 1px solid #e8e8e8;
  }
  .texts {
  	font-size:20px;
  	line-height:48px;
  	box-sizing: border-box;
  }
  .right .article-tit {
  	max-width: 200px;
  	@textLimit();
  	box-sizing: border-box;
	  color:#333;
  }
  .right .flower-count {
  	box-sizing: border-box;
  	text-align: right;
	  color:#f40009;
  }
</style>