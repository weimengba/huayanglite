<template>
  <div class="container">
    <scroll-view class="wrap"
            enable-back-to-top
            scrolltolower=150
            @scrolltolower="loadMore"
            scroll-y>
      <div class="banner-wrap">
        <img class="banner" :src="banner" />
      </div>
      <div class="item-top" 
            v-if="lists.length && index<=2"  
            v-for="(item, index) in lists" 
            :key="index" 
            :style="index===2?'border-bottom: 1px solid #e8e8e8;':''">
        <div class="no" :class="rankNo[index]">NO.{{index + 1}}</div>
        <div class="item-wrap" :style="index===0 ? 'height: 145px;' : ''">
          <img class="top-avatar" :class="index===0 ?'top1-avatar':''" mode="aspectFill" :src="item.headface" />
          <img class="no-top" v-if="index==0" :class="index == 0 ? 'top1' : ''" :src="no1" />
          <img class="no-top" v-if="index==1" :class="index == 0 ? 'top1' : ''" :src="no2" />
          <img class="no-top" v-if="index==2" :class="index == 0 ? 'top1' : ''" :src="no3" />
          <img v-if="index === 0" class="king" :src="king" />
        </div>
        <p class="person">{{item.nick}}</p>
        <p class="flowers">献花<span class="red-txt">{{item.num}}</span>朵</p>
      </div>

      <div class="item"
            v-if="lists.length && index>2"
            v-for="(item, index) in lists" :key="index">
        <p class="no-num">{{index + 1}}</p>
        <div class="avatar-wrap">
          <img class="avatar" mode="widthFix" :src="item.headface" />
        </div>
        <div class="info-wrap">
          <p class="name">{{item.nick}}</p>
          <p class="flowers">献花<span class="red-txt">{{item.num}}</span>朵</p>
        </div>
      </div>

    </scroll-view>
  </div>
</template>

<script type="text/ecmascript">
  import {mapGetters} from 'vuex'
import index from '../../utils';
  export default {
    data() {
      return {
        page: 1,
        hasMore: true,
        lists: [],
        id: '',
        lazyLoad: true,
        rankNo: ['no1','no2','no3'],
        banner: this.imgUrl + 'sendF_tit@2x.png',
        no1: this.imgUrl + 'SendF_no1@2x.png',
        no2: this.imgUrl + 'SendF_no2@2x.png',
        no3: this.imgUrl + 'SendF_no3@2x.png',
        king: this.imgUrl + 'kinghat@2x.png',
      }
    },
    computed: {
      ...mapGetters([
        'isAuth',
        'uid',
        'auth'
      ]),
    },
    onLoad(query) {
      this.id = query.id
    },
    onShow() {
      this.page = 1
      this.hasMore = true
      this.lists = []
      this._rankList()
    },
    methods: {
      avatarRound(index) {
        if(index === 0) {
          return this.imgUrl + 'SendF_no1@2x.png'
        }else if(index === 1) {
          return this.imgUrl + 'SendF_no2@2x.png'
        }else if(index === 2) {
          return this.imgUrl + 'SendF_no3@2x.png'
        }else {}
      },
      // 加载更多
      loadMore() {
        if(!this.hasMore) {
          return
        }
        this.page ++
        this._rankList()
      },
      _rankList() {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        this.hasMore = true
        this.$fly.get(`index.php?m=minpackage&c=index&a=flower_ranking`, {
          page: this.page,
          auth: this.auth,
          id: this.id
        }).then(res => {
          if(res.result === 1) {
            wx.hideLoading()
            if(this.page <= 1) {
              this.lists = res.data
            }else {
              this.lists = this.lists.concat(res.data)
            }
            this._checkMore(res.data)
          }
        })
      },
      _checkMore(data) {
        if(!data.length) {
          this.hasMore = false
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .container {
    position: relative;
    padding: 0 15px;
    box-sizing: border-box;
  	.wrap {
      position: relative;
      width: 100%;
      height: 100vh;
      padding-bottom: 10px;
      box-sizing: border-box;
      .banner-wrap {
        position: relative;
        margin: 30px auto;
        .banner {
          position: relative;
          display: block;
          margin: 0 auto;
          width: 283px;
          height: 69px;
        }
      }
      .item-top {
        position: relative;
        width: 100%;
        border: 1px solid #e8e8e8;
        border-right: none;
        border-bottom: 1px solid transparent;
        box-sizing: border-box;
        &:last-child {
          border-bottom: 1px solid #e8e8e8 !important;
        }
        .no {
          position: absolute;
          left: -1px;
          top: 15px;
          min-width: 60px;
          height: 30px;
          text-align: center;
          color: #fff;
          font-size:17px;
          line-height:30px;
          border-radius: 0 30px 30px 0;
        }
        .no1 {
          background-color: #fb574e;
        }
        .no2 {
          background-color: #ffc433;
        }
        .no3 {
          background-color: #85dc84;
        }
        .item-wrap {
          position: relative;
          margin: 38px auto 30px;
          width: 180px;
          height: 110px;
          text-align: center;
          .top-avatar {
            position: absolute;
            left: 0;
            right: 0;
            margin: 0 auto;
            width: 86px;
            height: 86px;
            border: 1px solid #f2f2f2;
            box-sizing: border-box;
            border-radius: 100%;
          }
          .top1-avatar {
            top: 35px;
          }
          .no-top {
            display: block;
            position: absolute;
            bottom: 0;
            margin: 0 auto;
            width: 180px;
            height: 94px;
          }
          .king {
            position: relative;
            width: 59px;
            height: 39px;
          }
        }
        .person,.flowers {
          width: 100%;
          font-size:20px;
          color:#333;
          line-height:30px;
          text-align:center;
        }
        .flowers {
          margin-bottom: 30px;
        }
      }
      .item {
        position: relative;
        @flexBetween();
        padding: 20px 0;
        width: 100%;
        border-bottom: 1px solid #e8e8e8;
        box-sizing: border-box;
        .no-num {
          margin-right: 10px;
          min-width: 20px;
          box-sizing: border-box;
        }
        .avatar-wrap {
          position: relative;
          margin-right: 15px;
          width: 86px;
          height: 86px;
          border-radius: 100%;
          overflow: hidden;
          .avatar {
            display: block;
            width: 100%;
          }
        }
        .info-wrap {
          position: relative;
          @flexBetween();
          flex-direction: column;
          font-size:20px;
          color:#333;
          width: 180px;
          line-height:20px;
          text-align:left;
          .name {
            margin-bottom: 10px;
            @textLimit();
            width: 100%;
          }
          .flowers {
            width: 100%;
          }
        }
      }
      .red-txt {
        display: inline-block;
        margin-right: 5px;
        color: #f40009;
      }
    }
  }
</style>