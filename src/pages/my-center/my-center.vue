<template>
  <div class="container">
    <div class="my-hd" :style="!canvasHidden ? 'position:fixed;width:100%;' : ''">
    <!-- <div class="my-hd"> -->
      <div class="my-hd-top">
        <div class="left-info">
          <div class="avatar-wrap">
            <open-data type="userAvatarUrl" class="avatar"></open-data>
          </div>
          <div class="right-bd">
            <open-data type="userNickName" class="nick"></open-data>
            <p class="userid">id:{{uid}}</p>
          </div>
        </div>
        <div class="flowers">
          <p class="total-flowers">总献花数：{{flowersAll}}朵</p>
          <p class="today-flowers">今日献花：{{flowersToday}}朵</p>
        </div>
      </div>
    </div>
    <!-- 邀请好友选项卡 -->
    <!-- <div class="share-pic" @click="getFriends">邀请好友</div> -->
    <button class="share-pic" open-type="getUserInfo" @getuserinfo.stop="getFriends">邀请好友</button>
    <canvas canvas-id="shareCanvas"
            class="canvas"
            v-if="canvasShow"></canvas>
    <!-- 关闭按钮 -->
    <cover-view v-if="canvasShow" class="close"  @click="closeCard">
      <cover-image class="img" :src="closeIcon" />
    </cover-view>
    <div class="bottom-wrap" v-if="canvasShow" :style="style">
      <p class="tip">查看图片后，长按图片，即可分享好友</p>
      <div class="buttons">
        <button class="save btn" @click="saveImg"><span class="save-icon icon"></span>保存</button>
        <button class="see btn" @click="previewImage"><span class="see-icon icon"></span>查看/分享</button>
      </div>
    </div>

    <scroll-view class="my-infos" scroll-y
        :style="!canvasHidden ? 'position:fixed !important;top: 120px;height:auto !important;box-sizing:border-box;overflow:hidden;' : ''"
         scroll-with-animation="true">     
      <div class="info-wrap">
        <div class="petals-wrap wrap">
          <p class="title">花瓣</p>
          <p class="counts">{{petal ? petal : 0}}</p>
          <button class="get-record" @click="getRecord">获得记录</button>
        </div>
        <div class="flowers-wrap wrap">
          <form class="form-wrap" @submit="formSubmit" report-submit="true">
            <button class="to-flower active" open-type="getUserInfo"
                formType="submit"
                @getuserinfo.stop="buyFlower">兑换红花</button>
          </form>
          <p class="tip">5个花瓣可购买1朵红花</p>
        </div>
      </div>
      <div class="products" v-if="products.length" v-for="(item,index) in products" :key="index">
        <img class="prod-img" :src="item.img" />
        <div class="info-tip">
          <p class="petal">{{item.petal}}花瓣</p>
          <p class="product" :style="{color:item.prodtxt}">{{item.prod}}</p>
        </div>
        <button class="get-btn" open-type="getUserInfo"
          :style="{backgroundColor:item.btnbg,color:item.btncolor,boxShadow:item.shadow}"
          @getuserinfo.stop="getProducts" :id="item.id">{{item.btntxt}}</button>
      </div>
      <div class="get-petal-tips" v-if="tips.length">
        <p class="tit">赚花瓣秘诀：</p>
        <p class="tip-step" v-for="(item,index) in tips" :key="index">{{index+1}}. {{item}}</p>
      </div>
    </scroll-view>
    <!-- 买花弹窗 -->
    <buy-flower :show="show"
                :auth="auth"
                :formId="formId"
                :petals="petal" 
                @hideAlert="hideAlert" 
                @boughtFlower="boughtFlower"
                ></buy-flower>
    <!-- 确认兑换商品弹窗 -->
    <div class="alert-prod" v-if="alertConfirm">
      <div class="con-wrap">
        <!-- <p class="tit">友情提示</p> -->
        <p class="txt">{{buyProd.petal}}花瓣免费兑换{{buyProd.name}}</p>
        <div class="button-wrap">
          <button class="btn calcel" @click="cancel">取消</button>
          <button class="btn ok" open-type="contact" @click="confirm">确定</button>
        </div>
      </div>
    </div>

    <tabbar></tabbar>
  </div>
</template>

<script>
import {sharedAddFlowers,reLogin} from '../../utils/index.js'
import {mapGetters, mapActions} from 'vuex'
import buyFlower from 'components/buyFlower'

const NUM = 5 //五个花瓣可以转换一个花朵

export default {
  data() {
    return {
      collect: [],
      buyProd: '',  //要买的商品信息
      registerStatus: '',
      registerTxt: '',
      lazyLoad: true,
      formId: '',
      products: '',
      tips: '',
      alertConfirm: false,
      canvasShow: false,
      canvasHidden: true,  //
      screenWidth: '',
      screenHeight: '',
      pixelRatio: '',
      unit: '',
      style: '',
      canvasStyle: '',
      context: '',
      avatarUrl: '',
      random: '',

      // petalDetail: '',
      petal: '',
      show: false,  //转换花朵的弹窗
      closeIcon: this.imgUrl + 'P_close@2x.png',
    }
  },
  computed: {
    ...mapGetters([
      'isAuth',
      'uid',
      'auid',
      'auth',
      'flowersAll',
      'flowersToday'
    ]),
  },
  watch: {
    auth() {
      this.getPetalList()
      this.getProduct()
    },
    canvasShow() {
      if(this.canvasShow==false) {
        this.canvasHidden = true
      }
    }
  },
  methods: {
    // 邀请好友(选项卡图片)
    getFriends(e) {
      const userInfo = e.target.userInfo
      // 拒绝授权
      if(!e.target.userInfo) {
        wx.showToast({
          icon: 'none',
          title: '只有授权才邀请哦~',
          duration: 2000,
          mask: true
        })
        return
      }else {
        wx.showLoading({
          mask: true
        })
        if(this.isAuth == 0) {
          // 未授权，修改用户信息
          this._editUserInfo(userInfo,2)//1表示兑换商品功能
        }else {
          // 已授权，打开选项卡邀请
          this.canvasShow = true
          this.loadCard()
        }
      }
    },
    closeCard() {
      this.canvasShow = false
    },
    loadCard() {
      // this.random = Math.random() > 0.5 ? 1 : 0
      // 加载卡片信息
      this.$fly.get(`/index.php?m=minpackage&c=index&a=user_card`, {
        auth: this.auth,
        // memberid: this.uid
      }).then(res => {
        if(res.result==1) {
          this.avatarUrl = res.data.headface
          //加载二维码模块
          let url1 = res.data.share_img
          wx.downloadFile({
            url: url1,
            success: function (res) {
              // 下载成功后拿到图片的路径，然后开始绘制
              var path = res.tempFilePath;
              context.setFillStyle('#fff')
              context.fillRect(233 * unit, 373 * unit, 68 * unit, 68 * unit)
              context.beginPath()
              context.drawImage(path, 237 * unit, 377 * unit, 60 * unit, 60 * unit); //  画二维码
              context.restore() // 还原状态   //downloadImage
              context.save()
              context.draw()
              wx.hideLoading()

              return ;
            }, fail: function (res) {
              wx.hideLoading()
            }
          });

        }else {
          console.log("用户信息加载失败！")
        }
      })

      //定义的保存图片方法
      let that = this
      // //设置画板显示，才能开始绘图
      let unit = this.screenWidth / 375  //327 * 524
      this.unit = unit
      this.style = 'top:'+unit*453+'px'

      let context = wx.createCanvasContext('shareCanvas')  //wx.createContext()
      this.context = context

      //画背景图
      context.drawImage('/static/image/my_shareCanvas@3x.png', 54.5 * unit, 21 * unit, 266 * unit,432 * unit)  
      // 画人物
      // let drawPath = this.random===0 ? '/static/image/clothes1@2x.png' : '/static/image/oil@2x.png'
      context.drawImage('/static/image/clothes1@2x.png', 98 * unit, 151 * unit, 182 * unit, 176 * unit)  //画商品
      context.font = 'normal bold 12px sans-serif'
      context.setFillStyle("#333")
      // let drawTxt = this.random===0 ? '精品舞服，短袖连衣裙' : '金龙鱼玉米油，4L大包装'
      let drawTxt = '精品舞服，短袖连衣裙'
      context.fillText(drawTxt, 98 * unit, 350 * unit)  //高度加了10像素
    },
    // 保存图片
    saveImg() {
      let context = this.context
      let unit = this.unit
        // 54.5 * unit, 21 * unit, 266 * unit,432 * unit
      wx.canvasToTempFilePath({
        x: 54.5 * unit - 2,
        y: 21 * unit - 2,
        width: 266 * unit + 4,
        height: 432 * unit + 4,
        destWidth: (266 * unit + 4) * this.pixelRatio,
        destHeight: (432 * unit + 4) * this.pixelRatio,

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
            },
            fail: (err) => {
              wx.showToast({
                title: '保存失败',
                icon: 'none',
                duration: 2500
              })
              console.log("图片保存失败！")
              // wx.hideLoading()
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
        x: 54.5 * unit - 2,
        y: 21 * unit - 2,
        width: 266 * unit + 4,
        height: 432 * unit + 4,
        destWidth: (266 * unit + 4) * this.pixelRatio,
        destHeight: (432 * unit + 4) * this.pixelRatio,
        canvasId: 'shareCanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          wx.previewImage({
            current: tempFilePath, // 当前显示图片的http链接  
            urls: [tempFilePath] // 需要预览的图片http链接列表  
          })
        },
        fail: function (res) {
          console.log(res)
        }
      });
    },

   //自定义弹窗模块
    cancel() {
      this.alertConfirm = false
      return
    },
    confirm() {
      this.alertConfirm = false
      this.petal = this.petal - this.buyProd.petal
      this.$fly.get(`/index.php?m=minpackage&c=index&a=buy_goods`, {
        auth: this.auth,
        goods_id: this.buyProd.id,
        // memberid: this.uid
      }).then(res => {
        if(res.data==1) {

        }else {
          
        }
      })
    },
    //获取商品信息
    getProduct() {
      this.$fly.get(`/index.php?m=minpackage&c=index&a=get_goods`, {
          auth: this.auth
      }).then(res => {
        if(res.result === 1) {
          this.products = res.data
          this.tips = res.tips
        }else {
          wx.showToast({
            title: '商品信息读取有误！',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    _getProducts() {
      wx.hideLoading()
      if(this.petal*1 - this.buyProd.petal*1 < 0) {
        wx.showToast({
          title: '您的花瓣不满'+this.buyProd.petal+'个，无法购买哦！',
          icon: 'none',
          duration: 2000
        })
        return
      }
      this.alertConfirm = true
    },


    boughtFlower(num) {  //购买完红花后改变花瓣数量
      // this.petalDetail.petal = num
      this.petal = num
    },
    getProducts(e) {
      this.buyProd = this.products[e.target.id-1]
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
        wx.showLoading({
          mask: true
        })
        if(this.isAuth == 0) {
          // 未授权，修改用户信息
          this._editUserInfo(userInfo,1)//1表示兑换商品功能
        }else {
          // 已授权，开始兑换商品
          this._getProducts()
        }
      }
    },
    formSubmit: function (e) {
      this.formId = e.mp.detail.formId
    },
    buyFlower(e) {
      const userInfo = e.target.userInfo
      // 拒绝授权
      if(!e.target.userInfo) {
        wx.showToast({
          icon: 'none',
          title: '只有授权才可购买花朵哦~',
          duration: 2500,
          mask: true
        })
        return
      }else {
        if(this.isAuth == 0) {
          let that = this
          // 未授权，修改用户信息
          this._editUserInfo(userInfo,3)//1表示兑换商品功能  3表示购买花朵
        }else {
          // this.setIsAuth(1)
          // 已授权，可以购买花朵了
          this.show = true
        }
      }
      
    },
    hideAlert(bool) {
      this.show = bool
    },
    getPetal() {
      wx.navigateTo({
        url: '/pages/get-petal/main'
      })
    },
    
    // 送花修改用户信息
    _editUserInfo(userInfo,myType) {//0:送花功能，1:评论功能 2：打开选项卡邀请好友 3:购买花朵
      this.$fly.post(`/index.php?m=minpackage&c=api&a=editUserinfo`, {
        auth: this.auth,
        gender: userInfo.gender,
        nick: userInfo.nickName,
        headface: userInfo.avatarUrl
      })
      .then(res => {
        if(res.result == 1) {
          this.setIsAuth(1)
          if(myType == 1) {
            this._getProducts()
          }else if(myType == 3) {  //购买花朵
            this.show = true
          }else if(myType == 2) {
            this.canvasShow = true
            this.loadCard()
          }
        }
      })
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
  	  // 获得记录
  	  getRecord() {
  	  	wx.navigateTo({
					url: '/pages/petal-record/main'
				})
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
      'setIsAuth'
    ])
  },
  onLoad(options) {
    var uid = options.auid
    if(uid) {  //通过转发进入
      // 重新登录
      reLogin(this,uid)
    }

    wx.getSystemInfo({
      success: res => {
        this.screenWidth = res.screenWidth
        this.screenHeight = res.screenHeight
        this.pixelRatio = res.pixelRatio
      }
    })
  },
  onShow() {
    this.show = false
    this.canvasShow = false
    this.getPetalList()
    this.getProduct()
    //这里是为了分享群可以获取群信息，比如shareTickets
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onHide() {
    this.show = false
  },
  onUnload() {
    this.show = false
  },
  components: {
    buyFlower
  },
  onShareAppMessage() {
    const _this = this
    return {
      path: `/pages/my-center/main?auid=${this.auid}`,
      imageUrl: this.imgUrl + 'share_product@3x.png',
      title: '加入【花样年华lite】免费拿走生活商品，传递爱与惊喜！',
      success(result) {
        // _this._shareCallBack(result)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .container {
    height: 100vh;
  }
  // 邀请好友
  .share-pic {
    position: fixed;
    right: 0;
    z-index: 180;
    top: 98px;
    padding: 0;
    width: 104px;
    height: 44px;
    line-height: 44px;
    font-size: @fontsize-large;
    font-weight: bold;
    color: @bg-color;
    letter-spacing: 1px;
    background: @bg-white;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
    border-radius: 100px 0 0 100px;
    text-align: center;
    &::after {
      border: none;
    }
  }
  .canvas {
    @layer();
    z-index: 200;
    box-sizing: border-box;
  }

  // 兑换商品弹窗
  .alert-prod {
    position: fixed;
    z-index: 333;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    .con-wrap {
      @absoCenter();
      width: 280px;
      height: 100px;
      background: #fff;
      border-radius: 5px;
      overflow: hidden;
      text-align: center;
      .txt {
        margin-top: 17px;
        line-height: 25px;
        font-size: 16px;
        letter-spacing: 0.5px;
      }
      .button-wrap {
        position: absolute;
        display: flex;
        bottom: 0;
        width: 100%;
        border-top: 1px solid #f3f3f3;
        .btn {
          flex: 1;
          text-align: center;
          background-color: #f9f9f9;
          &::after {
            border: none;
          }
        }
        .ok {
          color: @color-redtext;
          border-left: 1px solid #f3f3f3;
        }
      }
    }
  }

  .products {
    position: relative;
    @flexBetween();
    padding: 8px 33px;
    border-bottom: 10px solid #f5f5f5;
    box-sizing: border-box;
    .prod-img {
      position: relative;
      display: inline-block;
      height: 150px;
      width: 65px;
    }
    .info-tip {
      position: relative;
      text-align: center;
      .petal {
        position: relative;
        font-size:16px;
        color: @color-text;
        line-height:22px;
      }
      .product {
        font-size: @fontsize-llarge;
        line-height:26px;
      }
    }
    .get-btn {
      margin: 0;
      padding: 10px 20px;
      line-height:20px;
      font-size: @fontsize-llarge;
      border-radius:8px;
    }
  }
  .get-petal-tips {
    position: relative;
    padding: 20px 15px;
    box-sizing: border-box;
    font-size: @fontsize;
    color: @color-text;
    line-height:30px;
    text-align: justify;
  }
  .info-wrap {
    position: relative;
    display: flex;
    align-items: center;
    padding: 20px 10px;
    border-bottom: 10px solid #f5f5f5;
    box-sizing: border-box;
    .wrap {
      position: relative;
      width: 50%;
      text-align: center;
      box-sizing: border-box;
    }
    .flowers-wrap {
      padding-right: 23px;
      box-sizing: border-box;
      text-align: right;
      .form-wrap {
        position: relative;
        display: block;
      }
    }
    .wrap:first-child {
      border-right: 1px solid #d3d3d3;
    }
    .title {
      margin-bottom: 20px;
      font-size:14px;
      color:#999;
      line-height:14px;
      text-align: center;
    }
    .counts {
      padding-bottom: 20px;
      line-height:28px;
      font-size:28px;
      color:#e02e24;
      text-align: center;
    }
    .to-flower {
      display: inline-block;
      margin-bottom: 15px;
      margin: 0;
      padding: 10px 20px;
      line-height: 20px;
      font-size: 20px;
      border-radius:8px;
    }
    .active {
      color: #fff;
      background:#e02e24;
      box-shadow:0 3px 0 0 #be0000;
    }
    .no-active {
      background:#dedede;
      box-shadow:0 3px 0 0 #b4b2b5;
      color: #999;
    }
    .tip {
      margin-top: 15px;
      padding-right: 10px;
      font-size:12px;
      color:#333;
      line-height:12px;
    }
    .get-record {
      display: inline-block;
      padding: 0 14px;
      line-height:26px;
      font-size: 14px;
      color: #e02e24;
      border:1px solid #e02e24;
      border-radius:86px;
    }
  }
  .my-hd {
    height: 120px;
    background-color: #e02e24;
    .my-hd-top {
      @flexBetween();
      padding: 15px 20px 25px;
    }
    .left-info {
      .avatar-wrap {
        display: inline-block;
        vertical-align: middle;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 15px;
        .avatar {
          display: block;
          height: 100%;
        }
      }
      .right-bd {
        display:inline-block;
        vertical-align: middle;
        line-height: 1;
        color: #fff;
        .nick {
          font-size: 20px;
          margin-bottom: 16px;
          display: block;
        }
        .userid {
          font-size: 16px;
        }
      }
    }
    .flowers {
      font-size:16px;
      line-height:32px;
      color:#fff;
      .total-flowers,.today-flowers {
        text-align:left;
      }
    }
  }
  .register-wrap {
    position: relative;
    width: 100%;
  }
  .sign-week {
    position: relative;
    display: flex;
    padding: 25px 15px 0;
    box-sizing: border-box;
    width: 100%;  
    .day2 {
      flex: 1;
      width: 56px;
      box-sizing: border-box;
      .add-flowers {
        position: relative;
        left: 7px;
        margin-bottom: 10px;
        width: 100%;
        text-align: right;
        font-size:16px;
        color:#e02e24;
      }
      .line-wrap {
        position: relative;
        .line {
          position: relative;
          display: block;
          width: 100%;
          height: 3px;
          background:#d3d3d3;
        }
        .dot {
          position: absolute;
          right: 0;
          top: -3px;
          width: 10px;
          height: 10px;
          background: #d3d3d3;
          border-radius: 50%;
        }
      }
      &:first-child .line-wrap .line {
          width: 28px;
        }
      .days {
        position: relative;
        left: 7px;
        margin-top: 10px;
        font-size:14px;
        width: 100%;
        text-align: right;
        color:#333;
      }
      .active {
        background:#e02e24 !important;
      }
      &:last-child {
        flex: 0;
        width: 15px;
        font-size: 0;
        .add-flowers {
          left: 0;
          text-align: left;
          color: transparent;
        }
        .line-wrap {
          .line {
            display: block;
            width: 15px;
          }
          .dot {
            position: absolute;
            top: -3px;
            background: transparent;
          }
        }
      }
    }
    .day2:first-child {
      width: 32px !important;
      box-sizing: border-box;
      flex: 0;
    }
  }
  .register {
    position: relative;
    @flexBetween();
    padding: 20px;
    border-bottom: 10px solid #f5f5f5;
    box-sizing: border-box;
    .signed-tip {
      font-size:14px;
      color:#333;
    }
    .register-btn {
      display: inline-block;
      margin: 0;
      padding: 0;
      letter-space: 2px;
      font-size:20px;
      border-radius:8px;
      width:120px;
      height:41px;
      line-height: 41px;
    }
    .register-no {
      color:#e02e24;
      background:#ffc512;
      box-shadow:0 3px 0 0 #ff8900;
    }
    .register-yes {
      background:#dedede;
      box-shadow:0 3px 0 0 #b4b2b5;
      color: #999;
    }
  }
  .close {
    // .absoluteNum(341px,29px,18px,18px);
    .absoluteNum(310px,12px,18px,18px);
    display: inline-block;
    z-index: 310;
    overflow: hidden;
    .img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .my-infos {
    position: relative;
    height: calc(100% - 120px);
    box-sizing: border-box;
    z-index: 99;
  }
  // canvas下部分的功能按钮
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
</style>
