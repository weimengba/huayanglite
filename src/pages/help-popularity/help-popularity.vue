<template>
  
  <!-- <div class="container"> -->
  <scroll-view class="container" 
            enable-back-to-top
             scroll-y
             :class="canvasHidden ? '' : 'no-scroll'">
    <canvas canvas-id="shareCanvas" 
            style="position:absolute;z-index:200;box-sizing:border-box;width:100%;height:100vh;" 
            :hidden='canvasHidden'></canvas>
    <!-- 关闭按钮 -->
    <cover-view v-if="!canvasHidden" class="close"  @click="closeCard">
      <cover-image class="img" :src="closeIcon" />
    </cover-view>
    <div v-if="!canvasHidden" class="layer"></div>
    <div class="bottom-wrap" v-if="!canvasHidden && onShow" :style="style">
    <!-- <div class="bottom-wrap" v-show="onShow" :style="style"> -->
      <p class="tip">查看图片后，长按图片，即可分享好友</p>
      <div class="buttons">
        <button class="save btn" @click="saveImg"><span class="save-icon icon"></span>保存</button>
        <button class="see btn" @click="previewImage"><span class="see-icon icon"></span>查看/分享</button>
      </div>
    </div>
    <!-- 转发弹窗 -->
    <div v-show="alertShow||endFlower" class="alert">
      <alert :alertShow="alertShow"
          :endFlower="endFlower"
          @hideAlert="hideAlert"
          @getPetal="getPetal"
          @onShareAppMessage="onShareAppMessage">
        </alert>
    </div>

    <!-- 送花动画 -->
    <div v-if="sendSucess" class="success-wrap">
      <image class="send-sucess" :src="sendSuccess" lazy-load="lazyload"></image>
      <text class="tip">+1</text>
    </div>

    <div class="fixed" @click="showCard">
      生成陪伴卡
    </div>
    <div class="top-wrap">
      <div class="avatar-wrap">
        <img v-if="allInfo.thumb" class="avatar" :lazy-load="lazyLoad" mode="aspectFill" :src="allInfo.thumb" />
      </div>
      <div class="info-wrap">
        <p v-if="allInfo.name" class="name">{{allInfo.name}}</p>
        <div class="flowers">
          <span class="icon"></span>
          <span class="num">{{allInfo.flower}}</span>朵红花
        </div>
        <p class="send-counts">今日已为TA贡献了<span class="num" style="margin-left: -3px;">{{allInfo.myDevoteNumToday}}</span>朵红花</p>
        <button class="send" open-type="getUserInfo" @getuserinfo.stop="sendFlower">献红花 涨人气</button>
        <p class="tip">红花越多，人气越旺</p>
        <button class="share" open-type="share" hover-class="none">立即分享<span class="icon"></span></button>
      </div>
    </div>

    <div class="advert-wrap">
      <navigator target="miniProgram" open-type="navigate" app-id="wx6c3e720d15a56572" path="pages/homepage/homepage" extra-data="" version="release">
        <img class="advert" mode="widthFix" :src="dati" />
      </navigator>
    </div>

    <div class="lists" v-if="allInfo.fans && allInfo.fans.length>0">
      <p class="tip">粉丝贡献榜-前100名</p>

      <div class="item" v-for="(item,index) in allInfo.fans" :key="index">
        <div class="rank-no">{{index + 1}}</div>
        <div class="avatar-wrap">
          <span v-if="index==0" class="no1"></span>
          <img class="avatar" :lazy-load="lazyLoad" mode="aspectFill" :src="item.headface" />
        </div>
        <div class="info" :style="index==0 ? 'margin-top:36px;':''">
          <p class="name">{{item.nick}}</p>
          <p class="flowers">贡献<span class="num">{{item.flower}}</span>朵红花</p>
        </div>
      </div>

    </div>
  <!-- </div> -->
  </scroll-view>
</template>

<script>
  import {sharedAddFlowers,reLogin} from '../../utils/index.js'
  import {mapGetters, mapActions} from 'vuex'
  import Alert from 'components/Alert.vue'
  export default {
    data() {
      return {
        id: '',
        // auth: '',
        allInfo: '',
        codeData: '',
        lazyLoad: true,
        screenWidth: 0,
        style: '',
        unit: 1,
        btnSendFlower: true, //控制按钮是否可以送花
         endFlower: false,  //所有花朵用完弹窗
        sendSucess: false,
        context: '',
        pixelRatio: 2,
        alertShow: false,
        closeIcon: this.imgUrl + 'P_close@2x.png',
        sendFlowers: this.imgUrl + 'sendFlowers.png',
        sendSuccess: this.imgUrl + 'send_succes1@3x.png',
        dati: this.imgUrl + 'question@2x.png',

        shareImgPath: '',
        imgSign: this.imgUrl + 'P_sign_tip@2x.png',
        month: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        day: ['一日','二日','三日','四日','五日','六日','七日','八日','九日','十日','十一日','十二日','十三日','十四日','十五日',
              '十六日','十七日','十八日','十九日','二十日','二十一日','二十二日','二十三日','二十四日','二十五日','二十六日','二十七日','二十八日','二十九日','三十日','三十一日'],
        canvasHidden: true,     //设置画板的显示与隐藏，画板不隐藏会影响页面正常显示
        onShow: false,
      }
    },
    computed: {
      ...mapGetters([
        'isAuth',
        'uid',
        'auid',
        'auth',
        'flowersAll',
        'flowersToday',
        // 'codeAuid'
      ]),
    },
    onLoad(options) {
      console.log("所有参数")
      console.log(this.$mp)
      console.log(decodeURIComponent(this.$mp.appOptions.query.scene))
      let path = this.$mp.appOptions.path
      console.log("id:"+options.id)
      let id = options.id;  //正常跳转的id获取
      
      var shareId = decodeURIComponent(options.scene).split('##')[0]
      if(shareId!=='undefined' || options.auid) {  //通过转发或扫二维码进入
        let uid = options.auid ? options.auid : decodeURIComponent(options.scene).split('##')[1]
        // 重新登录
        reLogin(this,uid)
      }
      this.id = options.id ? options.id : shareId
      wx.getSystemInfo({
        success: res => {
          this.screenWidth = res.screenWidth
          this.pixelRatio = this.pixelRatio
        }
      })
    },
    onShow() {
      this.alertShow = false
      this.endFlower = false
      this.canvasHidden = true
      wx.setNavigationBarTitle({
        title: '帮老师打榜'
      })
      this.getDetails()
    },
    watch: {
      auth() {
        this.getDetails()
      }
    },
    methods: {
      hideAlert(e) {
        this.alertShow = false
        this.endFlower = false
      },
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
          if(this.isAuth == 0) {
            // 未授权，修改用户信息
            this._editUserInfo(userInfo,0)//0表示送花功能
          }else {
            // 已授权，给文章送花
            this._sendFlower()
          }
        }
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
            }else{
              console.log("警告：暂无此功能！")
            }
          }
        })
      },
      // 送花接口
      _sendFlower() {
        // this.yuanbao = false
        let id = this.id
        this.$fly.get(`/index.php?m=minpackage&c=index&a=vote&tid=${this.id}`, {
          auth: this.auth,
        }).then(res => {
          // wx.hideLoading()
          if(res.result === 1) {
            this.sendSucess = true
            let that = this
            setTimeout(function() {
              that.btnSendFlower = true
              that.sendSucess = false
              that.setFlowersAll(that.flowersAll*1+1)
              that.setFlowersToday(that.flowersToday*1+1)
              wx.hideLoading()
            },1500)
            this.getDetails()
          }else {    //转发后才可以继续送花哟
            this.btnSendFlower = true
            wx.hideLoading()
            // if(res.errorNo == '3002') {  //6朵未送完，提示去分享转发
            //   this.alertShow = true
            // }
            if(res.errorNo==3001) {//全部送完，提示分享转发
              this.endFlower = true  // 全部送完了，提示跳转到打赏页面
            }else if(res.errorNo==3002) {//6朵未送完，提示去分享转发
              this.alertShow = true
            }else {}
          }
        })
      },
      getPetal() {
        this.endFlower = false
        wx.switchTab({
          url: '/pages/my-center/main'
        })
      },
      showCard() {
        wx.showLoading({
          mask: true
        })
        let that = this
        setTimeout(function(){
          that.onShow = true
        },500)
        this.$fly.get(`/index.php?m=minpackage&c=index&a=getShareQcode&tid=${this.id}`, {
          auth: this.auth
        }).then(res => {
          if(res.result === 1) {
            this.codeData = res.data
            if(this.codeData) {
              this.loadCard()
            }
          }else {
            wx.hideLoading()
            wx.showToast({
              icon: 'none',
              title: '您今天还没给Ta献花，无法生成陪伴卡！',
              duration: 2000,
              mask: true
            })
          }
        })
      },
      closeCard() {
        this.canvasHidden = true
      },
      saveImg() {
        let context = this.context
        let unit = this.unit
        // context.draw(false, function () {
        wx.canvasToTempFilePath({
          x: 25 * unit - 2,
          y: 25 * unit - 2,
          width: 325 * unit + 4,
          height: 448 * unit + 4,
          destWidth: (325 * unit + 4) * this.pixelRatio,
          destHeight: (448 * unit + 4) * this.pixelRatio,

          canvasId: 'shareCanvas',
          success: function (res) {
            this.shareImgPath = res.tempFilePath
            if (!res.tempFilePath) {
              wx.showModal({
                title: '提示',
                content: '图片绘制中，请稍后重试',
                showCancel: false
              })
            }
            //画板路径保存成功后，调用方法吧图片保存到用户相册
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              //保存成功失败之后，都要隐藏画板，否则影响界面显示。
              success: (res) => {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2500
                })
                wx.hideLoading()
                // this.canvasHidden = true
              },
              fail: (err) => {
                wx.showToast({
                  title: '保存失败',
                  icon: 'none',
                  duration: 2500
                })
                console.log(err)
                wx.hideLoading()
                // this.canvasHidden = true
              }
            })
          },
          fail: (err) => {
            console.log(err)
          }
        })
        // });
      },
      previewImage() {  //查看图片
        let unit = this.unit
        wx.canvasToTempFilePath({
          x: 25 * unit - 2,
          y: 25 * unit - 2,
          width: 325 * unit + 4,
          height: 448 * unit + 4,
          destWidth: (325 * unit + 4) * this.pixelRatio,
          destHeight: (448 * unit + 4) * this.pixelRatio,
          canvasId: 'shareCanvas',
          success: function (res) {
            var tempFilePath = res.tempFilePath;
            wx.previewImage({
              current: tempFilePath, // 当前显示图片的http链接  
              urls: [tempFilePath] // 需要预览的图片http链接列表  
            })
          },
          fail: function (res) {
            console.log(res);
          }
        });
      },
      downloadImage() {
        let context = this.context
        let unit = this.unit

        let url1 = this.allInfo.thumb
        var that = this;
        wx.downloadFile({
          url: url1,
          success: function (res) {
            // 下载成功后拿到图片的路径，然后开始绘制
            var path = res.tempFilePath;
            
            context.beginPath()
            context.arc(306 * unit, 90 * unit, 33 * unit, 0, 2*Math.PI);
            context.setLineWidth(4)
            context.strokeStyle="rgba(192,80,77,1)"//红色
            context.stroke()
            // context.restore() // 还原状态
            
            context.clip(); //裁剪上面的圆形
            context.drawImage(path, 273 * unit, 57 * unit, 66 * unit, 66 * unit); // 在刚刚裁剪的园上画图
            context.restore() // 还原状态   //downloadImage
            context.draw()
            that.canvasHidden = false   //显示卡片
            wx.hideLoading()
            return ;
          }, fail: function (res) {
            console.log(res)
            that.canvasHidden = false   //显示卡片
            wx.hideLoading()
          }
        });
      },
      getDetails() {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        this.$fly.get(`/index.php?m=minpackage&c=index&a=teacherDetail&tid=${this.id}`, {
          auth: this.auth,
          // page: this.page,
        }).then(res => {
          wx.hideLoading()
          if(res.result === 1) {
            this.allInfo = res.data
          }
          
        })
      },
      loadCard() {
        //定义的保存图片方法
        var that = this;
        // //设置画板显示，才能开始绘图
        let unit = this.screenWidth / 375  //325*448
        this.unit = unit
        this.style = 'top:'+(unit*448+30)+'px'

        var context = wx.createCanvasContext('shareCanvas')  //wx.createContext()
        this.context = context

        //画大框
        context.setLineWidth(4)
        context.setStrokeStyle('#e02e24')  //#FF8E0F
        context.strokeRect(25 * unit, 25 * unit, 325 * unit, 448 * unit)

        //颜色填充
        context.setFillStyle('#fff')
        context.fillRect(27 * unit, 27 * unit, 321 * unit, 444 * unit)
        // 画分割线
        context.beginPath()
        context.setLineWidth(2)
        context.moveTo(70 * unit, 25 * unit)
        context.lineTo(70 * unit, 472 * unit)  //448
        context.stroke()

        context.beginPath()
        context.moveTo(264 * unit,25 * unit)
        context.lineTo(264 * unit,472 * unit)
        context.stroke()

        // context.restore(); // 还原状态
        context.closePath()

        //右下角签到图片提示
        context.drawImage('/static/image/P_sign_tip@3x.png', 36 * unit, 370 * unit, 24 * unit, 82 * unit)

        context.setFontSize(16)
        context.setFillStyle("#333")
        let d = new Date()
        let timeStr = ''
        if(d.getFullYear()==2018) {
          timeStr = '二零一八年'
        }else if(d.getFullYear()==2019) {
          timeStr = '二零一九年'
        }else {}
        timeStr += this.month[d.getMonth()]
        timeStr += this.day[(d.getDate() - 1)]
        let t = timeStr.split('')
        for(let i=0;i<t.length;i++) {
          let Hcoor = (70 + i*20) * unit
          context.fillText(t[i], 39 * unit, Hcoor)  //34
        }

        context.font = 'normal bold 20px sans-serif'
        let supportStr = '支持偶像，忠心不移'
        let s = supportStr.split('')
        for(let i=0;i<s.length;i++) {
          let Hcoor = (165 + i*26) * unit
          context.fillText(s[i], 295 * unit, Hcoor)  //34
        }
        // 中间部分内容
        context.font = 'normal normal 14px sans-serif'
        let line1 = '今日，我为你增加了'
        let l1 = line1.split('')
        for(let i = 0;i<l1.length;i++) {
          let Hcoor = (70 + i*20) * unit
          context.fillText(l1[i], 220 * unit, Hcoor)
        }

        let l2 = '这是我守护你的第'
        for(let i = 0;i<l2.length;i++) {
          let Hcoor = (70 + i*20) * unit
          context.fillText(l2[i], 180 * unit, Hcoor)
        }

        let l3 = '你的路上，一直会有我'
        for(let i = 0;i<l3.length;i++) {
          let Hcoor = (70 + i*20) * unit
          context.fillText(l3[i], 140 * unit, Hcoor)
        }

        let l4 = '永远爱你，永远支持你'
        for(let i = 0;i<l4.length;i++) {
          let Hcoor = (70 + i*20) * unit
          context.fillText(l4[i], 100 * unit, Hcoor)
        }

        let l11 = '朵红花'
        for(let i = 0;i<l11.length;i++) {
          let Hcoor = (286 + i*20) * unit
          context.fillText(l11[i], 220 * unit, Hcoor)
        }
        context.fillText('天', 180 * unit, 260 * unit)
        context.setFillStyle('#FF8E0F')
        context.font = 'normal bold 18px sans-serif'

        // 送花朵数量
        if(this.codeData.today*1 < 10) {
          context.fillText(this.codeData.today, 222 * unit, 260 * unit)  //一位数
        }else {//送花两位数
          context.fillText(this.codeData.today, 215 * unit, 260 * unit)
        }
        // 守护天数
        if(this.codeData.serialDay*1 < 10) {
          context.fillText(this.codeData.serialDay, 180 * unit, 236 * unit)  //一位数
        }else {
          context.fillText(this.codeData.serialDay, 176 * unit, 236 * unit)  //两位数
        }
        context.closePath()
        context.save()

        //加载二维码图片
        if(this.codeData.Qcode) {
          let url = this.codeData.Qcode
          var that1 = this
          wx.downloadFile({
            url: url,
            success: function (res) {
              // 下载成功后拿到图片的路径，然后开始绘制
              var path = res.tempFilePath;
              context.beginPath()
              context.drawImage(path, 128 * unit, 370 * unit, 74 * unit, 74 * unit)
              context.restore() // 还原状态   //downloadImage
              context.save()
              that1.downloadImage()  //画头像
            }, fail: function (res) {
              console.log(res)
            }
          });
        }
        // return
      },
      // 分享到微信群送花(每天最多两次)
      _shareCallBack(result) {
        let that = this
        this.$fly.get(`/index.php?m=minpackage&c=index&a=share`, {
          id: this.id,
          auth: this.auth
        }).then(res => {
          sharedAddFlowers(result, res)
        })
      },
      ...mapActions([
        'setIsAuth',
        'setUid',
        'setAuid',
        'setFlowersAll',
        'setFlowersToday',

        // 'setFirstIn',
        // 'setActivity',

      ])
    },
    components: {
      Alert
    },
    onShareAppMessage() {
      this.canvasHidden = true
      this.btnSendFlower = true
      const _this = this
      return {
        // path: `/pages/help-popularity/main?auid=${this.auid}`,
        path: `/pages/help-popularity/main?auid=${this.auid}&id=${this.id}`,
        // imageUrl: this.imgUrl + 'share_icon.png',
        title: '【@所有人】帮喜欢的老师投花，助力人气总榜登顶',
        success(result) {
          console.log(`/pages/help-popularity/main?auid=${_this.auid}&id=${_this.id}`)
          _this._shareCallBack(result)
        },
        fail(err) {
          console.log("转发失败！")
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .no-scroll {
    position:fixed !important;
    height:auto !important;
    box-sizing: border-box;
    overflow:hidden;
  }
  .advert-wrap {
    position: relative;
    top: -30px;
    width: 100%;
    height: auto;
    .advert {
      position: relative;
      display: block;
      width: 100%;
    }
  }
  // 送花模块
  .success-wrap {
    position: absolute;
    top: 260px;
    left: calc(50% - 35px);
    @flexBetween();
    opacity: 0;
    animation:anims 1.4s linear 1;
    z-index: 200;
    .send-sucess {
      position: relative;
      margin-right: 8px;
      width: 45px;
      height: 45px;
      z-index: 200;
    }
    .tip {
      flex: 1;
      color: #fff;
      font-size: 24px;
      font-weight: bold;
      z-index: 200;
    }
  }
  .success-wrap{
    width: 90px;
    height: 45px;
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

  .container {
    position: relative;
    width: 100%;
    height: 100vh;
    background-color: #e02e24;
    .fixed {
      position: absolute;
      right: 0;
      top: 60px;
      z-index: 100;
      padding: 6px 9px;
      color: @color-redtext;
      font-size: @fontsize-small;
      border-radius: 50px 0 0 50px;
      background-color: @bg-white;
      letter-spacing: 0.3px;
      text-align: center;
      box-shadow: 3px 3px 3px #930E07;
    }
    .layer {
      @layer();
      z-index: 190;
    }
    .bottom-wrap {
      position: absolute;
      width: 100%;
      z-index: 200;
      text-align: center;
      .tip {
        margin: 15px auto;
        line-height: 16px;
        color: @color-yeltxt;
        font-size: @fontsize;
      }
      .buttons {
        position: relative;
        width: 100%;
        .btn {
          position: relative;
          display: inline-block;
          margin: 0 20px;
          width: 138px;
          color: @color-text;
          font-size: @fontsize-large;
          background-color: @bg-yellow;
          border-radius: 50px;
          text-align: center;
          &::after {
            border: none;
          }
          .icon {
            position: relative;
            display: inline-block;
            top: 3px;
            margin-right: 5px;
            width: 21px;
            height: 20px;
            background-size: cover;
          }
          .save-icon {
            .bg-image('P_download');
          }
          .see-icon {
            .bg-image('P_share_icon');
          }
        }
      }
    }

    .close {
      .absoluteNum(342px,15px,18px,18px);
      display: inline-block;
      z-index: 210;
      overflow: hidden;
      .img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .top-wrap {
      position: relative;
      width: 100%;
      .avatar-wrap {
        position: relative;
        width: 100%;
        height: 160px;
        background-repeat: no-repeat;
        background-size: cover;
        text-align: center;
        .bg-image('Slice');
        .avatar {
          position: relative;
          display: inline-flex;
          margin-top: 36px;
          background:#d8d8d8;
          border:2px solid #ffffff;
          width:70px;
          height:70px;
          border-radius:100%;
        }
      }
      .info-wrap {
        position: relative;
        top: -30px;
        color: @color-white;
        text-align: center;
        .name {
          line-height: 30px;
          font-size: @fontsize-large;
        }
        .flowers {
          position: relative;
          line-height: 28px;
          font-size: @fontsize;
          .icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            background-size: cover;
            .bg-image('P_icon');
          }
        }
        .num {
          margin: 0 5px;
          color: @color-yeltxt;
        }
        .send-counts {
          position: relative;
          line-height: 28px;
          font-size: @fontsize;
        }
        .send {
          position: relative;
          display: inline-block;
          margin: 14px auto 12px;
          padding: 12px 60px;
          line-height: 18px;
          color: #e02e24;
          background-color: @bg-yellow;
          border-radius: 100px;
        }
        .tip {
          position: relative;
          opacity: 0.8;
          font-size: @fontsize-small;
        }
        .share {
          position: relative;
          display: inline-block;
          margin: 25px auto;
          padding: 12px 68px;
          line-height: 18px;
          font-size: @fontsize-large;
          color: @color-white;
          border: 1px solid #fff;
          border-radius: 100px;
          background-color: transparent;
          .icon {
            position: relative;
            display: inline-block;
            top: 3px;
            margin-right: 3px;
            width: 18px;
            height: 18px;
            background-size: cover;
            .bg-image('P_share');
          }
        }
      }
      
    }
    .lists {
      position: relative;
      margin: 0 10px 10px;
      padding: 25px 6px;
      background-color: @color-white;
      border-radius: 12px;
      box-sizing: border-box;
      .tip {
        margin-left: 15px;
        line-height:18px;
        font-size: @fontsize-large;
        color: @color-text;
      }
      .item {
        position: relative;
        @flexBetween();
        padding: 20px 0;
        width: 100%;
        border-bottom: 1px solid #e8e8e8;
        .rank-no {
          flex: 1;
          max-width: 50px;
          font-size: @fontsize-large;
          color: @color-text;
          text-align: center;
        }
        .avatar-wrap {
          position: relative;
          margin: 0 15px 0 8px;
          width: 54px;
          overflow: hidden;
          .avatar {
            position: relative;
            display: block;
            z-index: 8;
            width: 100%;
            height: 54px;
            border-radius: 100%;
          }
        }
        .no1 {
          position: relative;
          display: block;
          top: 8px;
          z-index: 2;
          width: 100%;
          height: 36px;
          background-size: cover;
          .bg-image('P_gold_cat');
        }
        .info {
          flex-grow: 1;
          width: 0;
          .name {
            margin-bottom: 8px;
            line-height:18px;
            font-size: @fontsize-large;
            color: @color-text;
            .no-wrap
          }
          .flowers {
            line-height:14px;
            font-size: @fontsize-small;
            color: @color-text1;
            .no-wrap
          }
        }
      }
    }
  }
</style>
