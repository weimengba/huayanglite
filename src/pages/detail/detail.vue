<template>
  <div class="container">
    <!-- 洋葱视频形象大使大赛 -->
    <div v-if="fixedSendFlower" class="flower-fix">
      <form @submit="formSubmit" report-submit="true" style="display: block;">
        <button class="flower-btn"
              formType="submit"
              hover-class="none"
              open-type="getUserInfo"
              @getuserinfo.stop="sendFlower">
          <image class="see-flower" :src="sendFlowers" lazy-load="lazyload"></image>
        </button>
      </form>
    </div>

    <div v-show="alertShow||endFlower" class="alert">
      <alert :alertShow="alertShow"
             :endFlower="endFlower"
          @hideAlert="hideAlert" 
          @onShareAppMessage="onShareAppMessage"
          @goRegister="goRegister"
          @getPetal="getPetal"></alert>
    </div>
    
    <div v-if="sendSucess" class="success-wrap">
      <image class="send-sucess" :src="sendSuccess" lazy-load="lazyload"></image>
      <text class="tip">+1</text>
    </div>
    <scroll-view class="detail" scroll-y v-if="detail.title"
        @scroll="bindScroll"
         scroll-with-animation="true">
      <p class="title" id="top">{{detail.title}}</p>
      <div class="article-info">
        <p class="time">{{detail.time}}</p>
        <div v-if="topTip" class="tip-top">
          <p class="text">{{topTipTxt}}</p>
        </div>
        <div class="count-wrap">
          <img :src="flowerCount" alt="" class="count-icon" :lazy-load="lazyLoad">
          <text class="count">x{{detail.flower}}</text>
        </div>
      </div>

      <!-- 礼品兑换模块 -->
      <div class="gifts-wrap">
        <div class="btn-group">
          <button class="btn get-petal" @click="getPetals">去赚花瓣</button>
          <button class="btn get-product" @click="getProduct">白拿商品</button>
        </div>
        <div class="tip-wraps">
          <span class="icon"></span>
          <p class="tip">您有<span class="num">{{petal}}</span>个花瓣，可白拿商品</p>
        </div>
      </div>

      <div class="article-content">
        <div class="content-item" v-for="(item, index) of detail.data" :key="index">
          <template v-if="item.content" v-for="(it,idx) in item.content">
            <p v-if="item.content[idx]" class="item-text" :key="it">{{it}}</p>
            <!-- <p v-if="item.content[idx]" class="item-text" :key="it" v-html="it"></p> -->
          </template>
          <img v-if="item.img" :src="item.img" alt="" class="item-img" mode="widthFix" :lazy-load="lazyLoad">
        </div>
        <!-- 广告位 -->
        <div class="advert-wrap" @click="getPetals">
          <img class="advert" mode="widthFix" :src="adImg" />
        </div>
        <div class="article-info-wrap">
          <div class="avatar-wrapper">
            <image class="avatar" lazy-load="lazyLoad" mode="aspectFill" :src="detail.thumb"></image>
            <text v-if="detail.username" class="author">{{detail.username}}</text>
          </div>

          <div class="send-flower">

            <form class="send-wrap" @submit="formSubmit" report-submit="true">
              <button class="send-btn" id="send"
                      formType="submit"
                      hover-class="none"
                      open-type="getUserInfo"
                      @getuserinfo.stop="sendFlower">
                      打赏献花
                <img :src="sendFIcon" alt="" class="btn-icon">
              </button>
            </form>

            <p class="flowers-today">您今日已献出<text class="todays">{{flowersToday}}</text>朵</p>
            <div class="user-split" v-if="detail.uids.count*1>0">
            <!-- <div class="user-split"> -->
              <text class="line"></text>
              <p class="user-num">{{detail.uids.count}}人为本文献花{{detail.flower}}朵</p>
              <text class="line"></text>
            </div>
            <div class="users-avatar" v-if="userAvatar.length" 
            :style="userAvatar.length<6 ? 'justify-content: center !important;' : ''"  @click="petalRank">

              <div class="avatar-item" v-for="(item,index) in userAvatar" :key="index">
                <!-- 有头像 有边框 -->
                <image v-if="item && item !=='opentype'" class="avatar" :src="item" lazy-load="lazyload"></image>
                <open-data v-else-if="item ==='opentype'" type="userAvatarUrl" class="avatar" style="display: block;"></open-data>
                <image v-else-if="!item" style="border: none !important;" class="avatar" :src="item" lazy-load="lazyload"></image>
              </div>

            </div>
          </div>
          <div class="infos">
            <p class="view-num">{{detail.plays}}次浏览</p>
            <div class="thumbup-wrap">
              <image v-if="detail.ispraises==1" class="thumbup" @click="thumbupFun" :src="thumb" lazy-load="lazyload"></image>
              <image v-else class="thumbup" @click="thumbupFun" :src="nothumb" lazy-load="lazyload"></image>
              <span class="thumb-count">{{detail.praises}}</span>
            </div>
          </div>
          <!-- <button class="back-home" @click="goActivity">帮老师打榜</button> -->
        </div>

        <div class="advert-wrap" style="margin-bottom:0 !important;">
          <navigator target="miniProgram" open-type="navigate" app-id="wx6c3e720d15a56572" path="pages/homepage/homepage" extra-data="" version="release">
            <img class="advert" mode="widthFix" :src="dati" />
          </navigator>
        </div>

      </div>
      <div class="recommend-wrap">
        <div class="recommend-inner">
          <div class="recommend-item" v-for="(item, index) of detail.recommend" :key="index" @click="viewDetail(item, index)">
            <image class="recommend-pic" :src="item.thumb" alt="" mode="widthFix" lazy-load="lazyload"></image>
            <div class="item-info">
              <p class="title">{{item.title}}</p>
              <div class="counts-wrap">
                <text class="browsers">浏览：{{item.plays}}</text>
                <text class="counts">分享：{{item.share}}</text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="commentsList.length>0" class="comment-wrapper">
        <div class="list-tip">
          <image class="rank-base" :src="rankBase" lazy-load="lazyload"></image>
          <text class="rank-tip-txt">按热度</text>
        </div>

        <comment :commentsList="commentsList" :auth="auth"></comment>
        <div class="all-comments" @click="moreComments" v-if="commentnum>10">
          <text class="see-more">查看更多</text>
          <image class="arrow" :src="moreIcon" lazy-load="lazyload"></image>
        </div>
      </div>
      <!-- 评论组件 -->
      <div class="comment-wrap">
        <div class="comment-before" v-show="!commentfocus">
          <image class="comment-icon" :src="commentIcon" lazy-load="lazyload" @click.stop="iconClick"></image>
          <input class="comment" type="text"
              placeholder="写评论" />
          <button v-if="!commentfocus" class="submit-btn" 
              open-type="getUserInfo"
              @getuserinfo="submitComment"></button>
        </div>
        <div v-show="commentfocus" class="comment-to">
          <div class="left">
            <image class="comment-icon" :src="commentIcon" lazy-load="lazyload" @click.stop="iconClick"></image>
            <input class="commenting" type="text" 
                v-model="comments"
                :focus="commentfocus"
                @confirm="sendComment"
                @blur="blur"
                ref="input"
                placeholder="写评论" />
          </div>
          <button class="goSubmit" @click="sendComment">发送</button>
        </div>
      </div>
      
      <div class="blank-space"></div>
      <div class="layer" @click="hideLayer" v-show="commentfocus"></div>
      <div class="goComment" id="comment" :style="!commentfocus ? 'z-index: 115;':''">
        <div class="hot-wrap" @click="goHome">
          <image class="home-icon" :src="home" lazy-load="lazyload"></image>
          <text class="hot-txt">最新热门</text>
        </div>
        <button class="share-wrap" open-type="share" hover-class="none">
          <image class="share-icon" :src="share" lazy-load="lazyload"></image>
          <text class="share-txt">分享给朋友</text>
        </button>
      </div>
    </scroll-view>
    <div class="tip-share" v-show="bottomTip">
      <p class="text">{{tipShareBtn}}</p>
    </div>
  </div>
</template>

<script>
import {sharedAddFlowers,newFormatTime,reLogin} from '../../utils/index.js'
import {mapGetters, mapActions} from 'vuex'
import Comment from 'components/comment'
import Alert from 'components/Alert'
export default {
  data() {
    return {
      id: '',
      username: '',
      detail: {},
      lazyLoad: true,
      topTip: true,  //头部气泡
      bottomTip: false, //底部按钮气泡
      btnTop: 1000,
      tipShow: false, //分享气泡是否显示
      comments: '',  //评论框中的文字
      commentsList: [],
      commentnum: 0, //评论的总长度
      userAvatar: [],
      petal: 0,
      topTipTxt: '您每天有6朵红花，红花打赏是一种优良习惯',//标题下部的气泡提示

      tipShareBtn: '点击分享给好友，让精彩与更多朋友一起欣赏',  //分享按钮提示
      commentfocus: false,  //评论框获取焦点
      btnSendFlower: true, //控制按钮是否可以送花
      commentbtn: true,  //是否需要获取授权
      fixedSendFlower: false,
      sendFlowerCount: 0,
      sendSucess: false,
      alertShow: false,  //转发签到弹窗提示
      endFlower: false,  //所有花朵用完弹窗
      shareNum: '',
      formId: '', //form表单提交是返回的formid，返回给后台
      // yuanbao: false,

      flowerrate: this.imgUrl + 'flowerrate.png',
      sendFlowers: this.imgUrl + 'sendFlowers.png',
      sendSuccess: this.imgUrl + 'send_success.png',
      sendYB: this.imgUrl + 'shoe_shaped@2x.png',
      flowerCount: this.imgUrl + 'flower-count.png',
      sendFIcon: this.imgUrl + 'sendF-icon.png',
      thumb: this.imgUrl + 'thumb.png',
      nothumb: this.imgUrl + 'nothumb.png',
      rankBase: this.imgUrl + 'rank_base.png',
      moreIcon: this.imgUrl + 'more_icon.png',
      commentIcon: this.imgUrl + 'comment-icon.png',
      home: this.imgUrl + 'home.png',
      // share: this.imgUrl + 'share.png',
      share: this.imgUrl + 'D_share1@2x.png',
      adImg: this.imgUrl + 'share_gifts@2x.png',
      bgAdImg: this.imgUrl + 'ad_bqb@2x.png',
      active: this.imgUrl + 'bqb.gif',
      dati: this.imgUrl + 'question@2x.png'
    }
  },
  computed: {
    ...mapGetters([
      'isAuth',
      'auth',
      'uid',
      'auid',
      'activity',
      'flowersAll',
      'flowersToday',
      'indexInfo',
      'newCommentList',
      'toList'
    ])
  },
  watch: {
    auth() {
      this._getDetail()
      this.getPetalList()
    },
    userAvatar() {
      if(this.userAvatar.length >= 6) {
        if(this.userAvatar.length%6===1) {
          this.userAvatar.push('','','','','')
        }else if(this.userAvatar.length%6===2) {
          this.userAvatar.push('','','','')
        }else if(this.userAvatar.length%6===3) {
          this.userAvatar.push('','','')
        }else if(this.userAvatar.length%6===4) {
          this.userAvatar.push('','')
        }else if(this.userAvatar.length%6===5) {
          this.userAvatar.push('')
        }else {}
      }
      deep: true
    },
    commentfocus() {
      if(this.commentfocus===false) {
        this.comments = ''
      }
    }
  },
  onLoad(options) {
    console.log(options)
    var uid = options.auid
    if(uid) {  //通过转发进入
      // 重新登录
      reLogin(this,uid)
    }

    this.id = this.$mp.query.id
    console.log("id: "+this.id+"  ,  "+uid)
    this._getDetail()
    this._shareTip()
    this.commentsList = []
    // this.commentfocus = false
  },
  onShow() {
    //这里是为了分享群可以获取群信息，比如shareTickets
    this.btnSendFlower = true
    this.alertShow = false
    this.endFlower = false
    this.fixedSendFlower = false
    this.sendFlowerCount = 0
    this.sendFlowerShow()
    this.bottomTips()
    this.getPetalList()
    this.sendSucess = false
    //查看评论后返回详情则会刷新详情中的评论
    if(this.newCommentList) {
      this.commentsList = this.newCommentList
    }
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onHide() {
    
  },
  onUnload() {
    //保存返回到首页要更改的数据
    this.setIndexInfo({
      id: this.id,
      borwser: this.detail.plays,
      shared: this.shareNum,   //share
      thumb: this.detail.praises
    })
  },
  
  methods: {
    getPetals() {
      wx.switchTab({
        url: `/pages/index/main`
      })
    },
    getProduct() {
      wx.switchTab({
        url: `/pages/my-center/main`
      })
    },
    hideLayer() {
      this.commentfocus = false
    },
    blur() {
      this.commentfocus = false
    },
    iconClick() {
      if(!this.commentfocus) {
        this.commentfocus = true
        this.$refs.input.focus = true
      }else {
        this.commentfocus = false
        this.$refs.input.focus = false
      }
    },
    formSubmit: function (e) {
      this.formId = e.mp.detail.formId
    },
    petalRank() {
      if(this.id==866 || this.id==865)
        return
      wx.navigateTo({
        url: `/pages/petal-rank/main?id=${this.id}`
      })
    },
    bottomTips() {
      const _this = this
      this.mySaredTip = setTimeout(function() {
        _this.bottomTip = true
        setTimeout(function() {
          clearInterval(_this.mySaredTip)
          _this.bottomTip = false
        },4000)
      },2500)
    },
    hideAlert(e) {
      this.btnSendFlower = true
      this.alertShow = false
      this.endFlower = false
    },
    goRegister(e) {
      this.alertShow = false
      wx.switchTab({
        url: '/pages/my-center/main'
      })
    },
    getPetal() {
      this.endFlower = false
      wx.switchTab({
        url: '/pages/my-center/main'
      })
    },
    seeRank: function() {
      wx.redirectTo({
        url: '/pages/rank-list/main'
      })
    },
    topTipFun() {
      let that = this
      setTimeout(function() {
        that.topTip = false
      },4000)
    },
    // 最新热门
    goHome() {
      wx.reLaunch({
        url: '/pages/index/main'
      })
    },
    // 更多活动
    goActivity() {
      wx.switchTab({
        url: '/pages/popularity/main'
      })
    },
    sendFlowerShow() {
      let that = this
      setTimeout(function() {
        that.fixedSendFlower = true
      },2000)
    },
    // 获得花瓣页面数据
    getPetalList() {
      this.$fly.get(`/index.php?m=minpackage&c=index&a=get_petal`, {
        auth: this.auth
      }).then(res => {
        if(res.result === 1) {
          // this.petalDetail = res.data
          this.petal = res.data.petal
        }else {
          if(!this.auth)
            return
          wx.showToast({
            title: '信息读取有误！',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    // 送花按钮
    sendFlower(e) {
      if(!this.btnSendFlower) {
        return
      }
      const userInfo = e.target.userInfo
      // 拒绝授权
      if(!e.target.userInfo) {
        wx.showToast({
          icon: 'none',
          title: '只有授权才可以送花哦~',
          duration: 2500,
          mask: true
        })
        return
      }else {
        this.btnSendFlower = false
        wx.showLoading({
          mask: true
        })
        // this._editUserInfo(userInfo,0)//0表示送花功能
        if(this.isAuth == 0) {
          // 未授权，修改用户信息
          this._editUserInfo(userInfo,0)//0表示送花功能
        }else {
          // 已授权，给文章送花
          this._sendFlower()
        }
      }
    },
    // 查看详情
    viewDetail(item) {
      this.id = item.id
      this.detail = {}
      this._getDetail()
      this._shareTip()
    },
    thumbupFun () {
      wx.showLoading({
        mask: true
      })
      this.$fly.get(`/index.php?m=minpackage&c=index&a=add_praises_num&id=${this.id}&type=2&auth=${this.auth}&ispraises=${this.detail.ispraises}`)
      .then(res => {
        if(res.result == 1) {         
          this.detail.praises = this.detail.ispraises==0 ? this.detail.praises*1+1 : this.detail.praises*1-1
          this.detail.ispraises = this.detail.ispraises==0 ? 1 : 0
          wx.hideLoading()
        }else {
          wx.hideLoading()
        }
      })
    },
    /**
     *  评论模块
     */
     // 更多页面
     moreComments() {
      wx.navigateTo({
        url: `/pages/comments/main?id=${this.id}`
      })
     },
    // 评论模块
    submitComment(e) {
      const userInfo = e.target.userInfo
      // 拒绝授权
      if(!e.target.userInfo) {
        wx.showToast({
          icon: 'none',
          title: '只有授权才可评论哦~',
          duration: 2500,
          mask: true
        })
        return
      }else {
        // this._editUserInfo(userInfo,1)//1表示评论功能
        if(this.isAuth == 0) {
          // 未授权，修改用户信息
          this._editUserInfo(userInfo,1)//1表示评论功能
        }else {
          this.commentfocus = true
          // // 已授权，给文章评论
        }
      }
    },
    // 获取详情数据
    _getDetail() {
      if(this.id==='')
        return
      // // 数据初始化
      this.detail = {}
      // this.detailContent = []
      this.topTip = true
      this.bottomTip = false
      this.bottom = true
      this.btnTop = 1000
      this.tipShow = false
      this.commentnum = 0
      this.commentfocus = false
      this.comments = ''
      this.topTipFun()
      this.$fly.get(`/index.php?m=minpackage&c=index&a=detail&id=${this.id}&type=2&auth=${this.auth}`)
      .then(res => {
        if(res.result === 1) {
          wx.hideLoading()
          res.data.plays*1 + res.data.plays_num
          this.commentsList = res.data.comment  //评论列表
          this.commentnum = res.data.commentnum
          this.detail = res.data
          this.username = res.data.username

          this.userAvatar = res.data.uids.h_list
          this.shareNum = res.data.share

        }
      })
    },
    // 送花修改用户信息
    _editUserInfo(userInfo,myType) {//0:送花功能，1:评论功能
      this.$fly.post(`/index.php?m=minpackage&c=api&a=editUserinfo`, {
        auth: this.auth,
        gender: userInfo.gender,
        nick: userInfo.nickName,
        headface: userInfo.avatarUrl
      })
      .then(res => {
        this.btnSendFlower = true
        // wx.hideLoading()
        if(res.result === 1) {
          this.setIsAuth(1)
          if(myType == 0) {
            this._sendFlower()
          }else if(myType == 1) {
            wx.hideLoading()
            this.commentfocus = true
          }else{
            console.log("警告：暂无此功能！")
          }
        }
      })
    },
    // 送花接口
    _sendFlower(bool) {
      // this.yuanbao = false
      let id = this.id
      this.$fly.get(`/index.php?m=minpackage&c=index&a=send_flower`, {
        auth: this.auth,
        id: this.id, // 文章id
        type: 2,
        formid: this.formId
      }).then(res => {
        // wx.hideLoading()
        if(res.result === 1) {
          this.sendSucess = true
          let that = this
          setTimeout(function() {
            that.btnSendFlower = true
            that.sendSucess = false
            wx.hideLoading()
          },1500)
          this.setFlowersAll(this.flowersAll*1+1)
          this.setFlowersToday(this.flowersToday*1+1)
          if(res.data == 1) {
            // 送花人数增加
            if(this.detail.uids.count <= 5) { //不满一行需要添加头像
              this.userAvatar.push('opentype')  //添加自己的头像
            }else if(5 < this.detail.uids.count && this.detail.uids.count < 18) { //不满三行需要添加自己的头像
              this.userAvatar.splice(this.detail.uids.count)
              this.userAvatar.push('opentype')
            }else{
              console.log('not use to add avatar!')
            }
            this.detail.uids.count ++
            this.detail.flower ++
          }else {
            this.detail.flower ++
          }
          this.sendFlowerCount++
          let that1 = this
          this.setChangeInfo({
            id: id,
            count: that1.sendFlowerCount
          })
          // wx.hideLoading()
        }else {
          if(bool)
            return
          if(res.errorNo==3001) {//全部送完，提示分享转发
            this.endFlower = true  // 全部送完了，提示跳转到打赏页面
          }else if(res.errorNo==3002) {//6朵未送完，提示去分享转发
            this.alertShow = true
          }else {}
          this.btnSendFlower = true
          wx.hideLoading()
        }
      })
    },
    // 文章评论功能
    sendComment() {
      wx.showLoading({
        mask: true
      })
      let that = this
      let commObj = {
        comment: this.comments,
        headface: '',
        id: '',
        ispraise: 0,
        like: 0,
        nick: '',
        time: ''
      }
      let d = new Date()
      commObj.time = newFormatTime(d)

      this.$fly.get(`/index.php?m=minpackage&c=index&a=add_comment`, {
        auth: this.auth,
        oid: this.id, // 文章id
        type: 2,
        comment: that.comments
      }).then(res => {
        if(res.result === 1) {
          that.comments = ''
          // 顶部显示个人评论 
          commObj.id = res.data
          this.commentsList.unshift(commObj)
          this.commentnum++

          this.commentfocus = false
          
          wx.hideLoading()
          wx.showToast({
            title: '评论成功',
            mask: true,
            duration: 2000
          })
        }else {
          this.commentfocus = false
          wx.hideLoading()
          // 评论失败
          wx.showToast({
            title: '评论失败',
            icon: 'none',
            mask: true,
            duration: 2000
          })
        }
      })
    },
    // 分享到微信群送花(每天最多两次)
    _shareCallBack(result) {
      let that = this
      this.$fly.get(`/index.php?m=minpackage&c=index&a=share`, {
        id: this.id,
        auth: this.auth
      }).then(res => {
        console.log("分享后："+this.shareNum)
        this.shareNum++
        
        sharedAddFlowers(result, res)
      })
    },
    _shareTip() { //分享的气泡提示
      const _this = this
      this.mySaredTip = setTimeout(function() {
        _this.tipShow = true
        setTimeout(function() {
          clearInterval(_this.mySaredTip)
          _this.tipShow = false
        },3000)
      },6600)
    },
    _queryMultipleNodes(){
      let that = this
      var query = wx.createSelectorQuery()
      query.select('#send').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function(res){
        that.btnTop = res[0].top
        return
      })
      return
    },
    ...mapActions([
      'setIsAuth',
      'setFlowersAll',
      'setFlowersToday',
      'setChangeInfo',
      'setIndexInfo',
      'setToList'
      // 'setNewCommentList'
    ])
  },
  components: {
    Alert,
    Comment
  },
  onShareAppMessage(qq) {
    this.alertShow = false
    this.btnSendFlower = true
    const _this = this
    return {
      // title: `【@所有人】为${this.username}投红花涨人气，快来支持吧`,
      title: `【@所有人】${this.detail.title}`,
      imageUrl: this.detail.data[0].img,
      path: `/pages/detail/main?id=${this.id}&auid=${this.auid}`,
      success(result) {
        _this._shareCallBack(result)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .container {
    @container();
  }
  // .detail {
  //   height: 100%;
  // }
  .layer {
    @layer();
    z-index:110;
  }
  
  .success-wrap {
    position: absolute;
    top: 260px;
    left: calc(50% - 35px);
    @flexBetween();
    width: 90px;
    height: 45px;
    opacity: 0;
    animation:anims 1.4s linear 1;
    z-index: 200;
    .send-sucess {
      position: relative;
      margin-right: 8px;
      width: 45px;
      height: 100%;
      z-index: 200;
    }
    .tip {
      flex: 1;
      color: #E02E24;
      font-size: 24px;
      font-weight: bold;
      z-index: 200;
    }
  }
  @keyframes anims {
    0% {
      top: 270px;
      opacity: 1;
    }
    99% {
      top: 200px;
      opacity: 0;
    }
  }

  .flower-fix {
    position: absolute;
    top:  230px;
    right: 0;
    border-radius: 30px 0 0 30px;
    z-index: 89;
    .flower-btn {
      padding: 0;
      background-color: transparent;
    }
    .flower-btn:after {
      border: none;
    }
    .see-flower {
      position: relative;
      display: block;
      width: 90px;
      height: 55px;
    }
  }
  
  .goComment {
    position: fixed;
    @flexBetween();
    bottom: 0;
    padding: 6px;
    width: 100%;
    height: 50px;
    font-size:0;
    color: @color-text;
    background-color: #fafafa;
    z-index: 101;
    box-sizing: border-box;
    .hot-wrap, .share-wrap {
      position: relative;
      width: 50%;
      text-align: center;
      box-sizing: border-box;
    }
    .hot-wrap {
      border-right: 1px solid #999;
    }
    .share-wrap {
      height: 28px;
      line-height: 28px;
    }
    .share-wrap:after {
      border: none;
    }
    .home-icon,.share-icon {
      position: relative;
      display: inline-block;
      top: 3px;
      margin-right: 10px;
    }
    .home-icon {
      width: 23px;
      height: 23px;
    }
    .share-icon {
      width: 22px;
      height: 22px;
    }
    .hot-txt {
      font-size:18px;
    }
    .share-txt {
      font-size: 20px;
      color: #e02e24;
    }
  }
  .comment-submit {
    z-index: 110;
    .input-wrap {
      position: relative;
      flex: 1;
      height: 36px;
      .comment-icon {
        .absoluteNum(4px,6px,24px,24px);
      }
      .comment {
        padding-left: 32px;
        height: 100%;
        line-height: 32px;
        font-size: @fontsize-small;
        border: 1px solid #e8e8e8;
        box-sizing: border-box;
        z-index: 110;
      }
    }
    .publish-btn {
      padding: 0 10px;
      height: 36px;
      font-size:16px;
      color: @color-text;
      line-height:36px;
    }
    .publish-btn:after {
      border: none;
    }
  }
  .detail {
    height: 100%;
    .title {
      font-size: 24px;
      color: @color-text;
      line-height: 32px;
      text-align: justify;
      padding: 10px 15px 0;
      margin-bottom: 20px;
    }
    .article-info {
      @flexBetween();
      font-size: @fontsize-small;
      padding: 0 15px;
      line-height: 1;
      .time {
        color: @color-text;
      }
      .count-wrap {
        display: inline-flex;
        align-items: center;
        .count-icon {
          display: inline-block;
          margin-right: 10px;
          width: 23px;
          height: 22px;
        }
      }
    }
    .gifts-wrap {
      position: relative;
      margin: 25px 10px 5px;
      padding: 16px;
      border: 4px solid #e02e24;
      border-radius: 100px;
      box-sizing: border-box;
      .btn-group {
        position: relative;
        display: flex;
        justify-content: space-around;
        .btn {
          padding: 11px 15px;
          line-height: 18px;
          font-size: @fontsize;
          box-shadow: 0 2px 4px 0 rgba(0,0,0,0.40);
          border-radius: 100px;
        }
        .get-petal {
          color: @color-redtext;
          background: @bg-yellow;
        }
        .get-product {
          color: @color-white;
          background: @bg-color;
        }
      }
      .tip-wraps {
        position: relative;
        margin-top: 10px;
        width: 100%;
        text-align: center;
        .icon {
          position: relative;
          display: inline-block;
          margin-right: 10px;
          width: 27px;
          height: 18px;
          .bg-image('flower_tip');
        }
        .tip {
          display: inline-block;
          line-height: 15px;
          color: @color-text;
          font-size: 15px;
          .num {
            color: @color-redtext;
          }
        }
      }
    }
    .article-content {
      overflow: hidden;
      padding-bottom: 30px;
      background-color: #fff;
      .content-item {
        overflow: hidden;
        padding: 10px 15px;
        .item-text {
          font-size: @fontsize-large;
          color: @color-text;
          text-align: justify;
          line-height: 32px;
        }
        .item-img {
          width: 100%;
          display: block;
        }
        .item-img,
        .item-text {
          margin-top: 10px;
        }
      }
      .advert-wrap {
        position: relative;
        margin: 20px 0 40px;
        width: 100%;
        height: auto;
        .advert {
          position: relative;
          display: block;
          width: 100%;
        }
      }
      .article-info-wrap {
        position: relative;
        width: 100%;
        padding: 0 15px;
        box-sizing: border-box;
        .avatar-wrapper {
          position: relative;
          margin: 10px 0 20px;
          width: 100%;
          text-align: center;
          box-sizing: border-box;
          .avatar {
            display: block;
            margin: 0 auto;
            width: 65px;
            height: 65px;
            border-radius: 50%;
          }
          .author {
            display: block;
            margin: 10px 0 15px;
            line-height: 17px;
            font-size: 17px;
            color: @color-text;
            text-align: center;
          }
        }
        .send-flower {
          position: relative;
          .send-wrap {
            position: relative;
            display: block;
            margin: 0 auto;
            width: 126px;
            .send-btn {
              border-radius: 10px;
              padding: 0 10px;
              color: #E02E24;
              width: 100%;
              text-align: center;
              font-size: 17px;
              border: 1px solid #E02E24;
              background-color: transparent;
              .btn-icon {
                position: relative;
                display: inline-block;
                vertical-align: middle;
                margin: 0 0 3px 3px;
                width: 20px;
                height: 20px;
              }
            }
          }
          send-btn:after {
            border: none;
          }
          .flowers-today {
            margin-top: 18px;
            font-size: @fontsize-small;
            color: #999;
            text-align: center;
            .todays {
              display: inline-block;
              margin-right: 5px;
            }
          }
          .user-split {
            position: relative;
            display: flex;
            padding-top: 28px;
            width: 100%;
            line-height: 17px;
            font-size: 17px;
            .line {
              flex: 1;
              padding-top: 8px;
              height: 0;
              border-bottom: 1px solid #e8e8e8;
              box-sizing: border-box;
            }
            .user-num {
              color: @color-text;
              margin: 0 8px 0;
              text-align: center;
            }
          }
          .users-avatar {
            position: relative;
            display: flex;
            flex-wrap: wrap;
            margin: 15px auto 30px;
            justify-content: space-between;
            width: 236px;
            .avatar-item {
              position: relative;
              margin: 3px 2px;
              width: 35px;
              height: 35px;
              border-radius: 6px;
              overflow: hidden;
              box-sizing: border-box;
              .avatar {
                width: 100%;
                height: 100%;
                border: 1px solid #f2f2f2;
                box-sizing: border-box;
              }
            }
          }
        }
        .infos {
          @flexBetween();
          margin-top: 30px;
          box-sizing: border-box;
          .view-num {
            font-size: @fontsize-small;
            color: #999;
          }
          .thumbup-wrap {
            position: relative;
            .thumbup {
              vertical-align: bottom;
              margin-right: 8px;
              height: 26px;
              width: 26px;
            }
            .thumb-count {
              font-size:18px;
              color:#999;
            }
          }
        }
        // .back-home {
        //   display: block;
        //   position: relative;
        //   margin: 30px 6px 0;
        //   line-height: 44px;
        //   background: #f40009;
        //   border-radius: 8px;
        //   font-size:20px;
        //   color:#fff;
        //   text-align:center;
        // }
      }
    }
    .recommend-wrap {
      padding-top: 5px;
      background-color: #f5f5f5;
      .recommend-inner {
        background-color: #fff;
        padding: 10px 15px;
        .recommend-item {
          position: relative;
          display: flex;
          margin-bottom: 20px;
          width: 100%;
          .recommend-pic {
            margin-right: 10px;
            width: 130px;
            height: 84px;
            min-height: 78px !important;
            max-height: 84px !important;
            overflow: hidden;
          }
          .item-info {
            flex: 1;
            .title {
              .ellipsis(2);
              text-align: justify;
              margin: 0;
              padding: 0;
              line-height:28px;
              font-size:20px;
              color: @color-text;
            }
            .counts-wrap {
              display: flex;
              margin-top: 5px;
              font-size: @fontsize-small;
              color: @color-text;
              line-height:21px;
              .browsers {
                flex: 1;
                margin-right: 20px;
              }
              .counts {
                flex: 1;
              }
            }
          }
        }
      }
    }
  }
  .comment-wrapper {
    padding: 2px 0 0;
    border-top: 4px solid #f5f5f5;
    box-sizing: border-box;
    .list-tip {
      position: relative;
      margin: 15px 0 10px;
      padding: 0 15px;
      box-sizing: border-box;
      text-align: right;
      font-size:0;
      color:#999;
      .rank-base {
        position: relative;
        top: 2px;
        width: 17px;
        height: 17px;
      }
      .rank-tip-txt {
        display: inline-block;
        margin-left: 3px;
        font-size: 17px;
      }
    }
    .all-comments {
      position: relative;
      margin: 30px 0;
      padding: 10px 0;
      width: 100%;
      font-size: 0;
      text-align: center;
      .see-more {
        margin-right: 5px;
        font-size:16px;
        color: @color-text;
        line-height:16px;
      }
      .arrow {
        width:5px;
        height:11px;
      }
    }
  }
  .comment-wrap {
    position: relative;
    margin: 0 15px 0;
    width: auto;
    height:40px;
    z-index: 111;
    .comment-before {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 113;
      .comment-icon {
        .absoluteNum(4px,6px,24px,24px);
      }
      .comment {
        padding-left: 32px;
        height: 100%;
        line-height: 32px;
        font-size: @fontsize-small;
        border: 1px solid #e8e8e8;
        border-radius:6px;
        box-sizing: border-box;
        z-index: 113;
        background:#f5f5f5;
      }
      .submit-btn {
        @absoluted();
        margin: 0;
        padding: 0;
        background-color: transparent;
        border-radius: 0;
        z-index: 113;
      }
    }
    .comment-to {
      position: absolute;
      @flexBetween();
      width: 100%;
      height: 100%;
      z-index: 111;
      .left {
        position: relative;
        height: 100%;
        flex: 1;
        .comment-icon {
          .absoluteNum(4px,6px,24px,24px);
        }
        .commenting {
          padding-left: 32px;
          height: 100%;
          line-height: 32px;
          font-size: @fontsize-small;
          border: 1px solid #e8e8e8;
          border-radius:6px;
          box-sizing: border-box;
          z-index: 111;
          background:#f5f5f5;
        }
      }
      .goSubmit {
        position: relative;
        margin: 0 0 0 5px;
        padding: 0;
        width: 62px;
        height: 100%;
        font-size:16px;
        color: @color-text;
        text-align:center;
        line-height: 40px;
        background-color: #fff;
        z-index: 113;
      }
      .goSubmit:after {
        border: none;
      }
    }
  }
  .blank-space {
    width: 100%;
    height: 90px;
  }
  .tip-wrap {
    padding: 5px 7px;
    max-width: 116px;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, .5);
    color: #fff;
    line-height: 19px;
    position: absolute;
    top: -58px;
    right: calc(50% - 28px);
    animation:movebtn 1s linear infinite;
    &:after {
      content: '';
      display: block;
      border-top: 6px solid rgba(0, 0, 0, .5);
      border-bottom: 6px solid transparent;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      position: absolute;
      right: 20px;
      bottom: 0;
      transform: translate3d(0, 100%, 0);
    }
    .text {
      font-size: @fontsize-small;
      text-align: center;
    }
  }
  @keyframes movebtn {
    0% {top: -58px;}
    50% {top: -62px;}
    100% {top: -58px;}
  }
  .tip-top {
    right: 96px;
    padding: 5px 7px;
    max-width: 140px;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, .5);
    color: #fff;
    line-height: 18px;
    position: absolute;
    animation:mymove 1s linear 4;
    &:after {
      content: '';
      display: block;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-left: 6px solid rgba(0, 0, 0, .5);
      border-right: 6px solid transparent;
      position: absolute;
      right: 0;
      bottom: 50%;
      transform: translate3d(100%, 50%, 0);
    }
    .text {
      font-size: @fontsize-small;
      text-align: center;
    }
  }
  @keyframes mymove {
    0% {right: 96px;}
    50% {right: 100px;}
    100% {right: 96px;}
  }
  .tip-share {
    position:absolute;
    padding: 5px 7px;
    max-width: 142px;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, .5);
    color: #fff;
    line-height: 19px;
    bottom:55px;
    right: 17px;
    z-index: 111;
    animation:sharebtn 1s linear infinite;
    &:after {
      content: '';
      display: block;
      border-top: 6px solid rgba(0, 0, 0, .5);
      border-bottom: 6px solid transparent;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      position: absolute;
      right: 70px;
      bottom: 0;
      transform: translate3d(0, 100%, 0);
    }
    .text {
      font-size: @fontsize-small;
      text-align: center;
    }
  }
  @keyframes sharebtn {
    0% {bottom: 55px;}
    50% {bottom: 59px;}
    100% {bottom: 55px;}
  }
</style>
