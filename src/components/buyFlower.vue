<template>
  <div class="container" v-if="show">
  	<div class="to-flowers">
      <img class="close" @click="close" :src="delImg" />
      <p class="title">您还剩余{{petal}}个花瓣</p>
      <div class="change-wrap">
        <img class="decrease img" :src="decImg" @click="decrease" />
        <input type="number" step="5" min="5" class="petals" disabled="disabled" v-model="changePetals">
        <img class="add img" :src="addToImg" @click="add" />
      </div>
      <button class="buy" @click="buyFlowers">
        <p class="txt">点击购买</p>
        <div class="wrap">
          <img class="icon" :src="flowerIcon" />
          <!-- <span class="num">{{changePetals/5}}朵</span> -->
          <span class="num">{{toflower}}朵</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const NUM = 5  //5个花瓣换一个小红花
  export default {
  	data() {
  	  return {
        lazyLoad: true,
        petal: '',
        changePetals: 5,
        
        delImg: this.imgUrl + 'M_del@2x.png',
        lessImg: this.imgUrl + 'M_less@2x.png',
        nolessImg: this.imgUrl + 'M_less_no@2x.png',
        addImg: this.imgUrl + 'M_add@2x.png',
        noaddImg: this.imgUrl + 'M_add_no@2x.png',
        flowerIcon: this.imgUrl + 'M_flower@2x.png',
        // decImg: this.lessImg,
        decImg: '',
        // addToImg: this.addImg,
        addToImg: '',
        toflower: 1,
  	  }
		},
		props: {
			show: {
				type: Boolean,
				default: false
      },
      auth: {
        type: String,
        default: ''
      },
      petals: {
        type: Number,
        default: 0
      },
      formId: {
        type: String,
        default: ''
      }
		},
		computed: {

    },
    watch: {
      show() {
        // this.petal = this.petals - NUM
        // this.changePetals = 5
        if(this.petals<5) {
          this.petal = this.petals
          this.changePetals = this.petals
        }else {
          this.petal = this.petals - NUM
          this.changePetals = 5
        }
      },
      // petals() {
      petal() {
        if(this.petal<NUM) {  //剩余总花瓣数小于5，则不能转花朵
          this.addToImg = this.noaddImg
          if(this.changePetals<NUM*2) { //不够5*2则不能减
            this.decImg = this.nolessImg
          }else {
            this.decImg = this.lessImg
          }
        }else {  //大于5个花瓣，则可以转换花朵
          this.addToImg = this.addImg
          if(this.changePetals<NUM*2) { //不够5*2则不能减
            this.decImg = this.nolessImg
          }else {
            this.decImg = this.lessImg
          }
        }

        // 计算花朵数
        if(this.changePetals <= NUM) {
          this.toflower = 1
        }else {
          this.toflower = (this.changePetals / NUM)
        }

      }
    },
    methods: {
      close() {
        this.$emit('hideAlert',false)
      },
      decrease() {
        if(this.changePetals<NUM*2)
          return
        this.petal += NUM
        this.changePetals -= NUM
      },
      add() {
        if(this.petal<NUM)
          return
        this.petal -= NUM
        this.changePetals += NUM
      },
      buyFlowers() {
        if(this.changePetals<5) {
          wx.showToast({
            icon: 'none',
            title: '您的花瓣不足5个，无法购买红花',
            duration: 2500,
            mask: true
          })
        }
        // this.$fly.post(`/index.php?m=minpackage&c=api&a=buy_flower&auth=${this.auth}&num=${this.changePetals}`)
        this.$fly.post(`/index.php?m=minpackage&c=index&a=buy_flower&auth=${this.auth}&num=${this.changePetals}&formid=${this.formId}`)
        .then(res => {
          if(res.result == 1) {
            this.$emit('boughtFlower',this.petal)
            this.petal = this.petal - this.changePetals
            this.$emit('hideAlert',false)
            wx.showToast({
              icon: 'none',
              title: '花朵购买成功',
              duration: 2500,
              mask: true
            })
          }
        })
      },
      // toflower() {
      //   if(this.changePetals <= NUM) {
      //     console.log(1)
      //     return 1
      //   }else {
      //     console.log(this.changePetals / NUM)
      //     return this.changePetals / NUM
      //   }
      // }
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .container {
    @fixedAll();
    background: rgba(0, 0, 0, .2);
    z-index: 150;
    left: 0;
    .to-flowers {
      @absoCenter();
      padding: 25px 40px;
      width: 300px;
      height: 264px;
      background: @bg-white;
      border-radius: 8px;
      z-index: 200;
      box-sizing: border-box;
      .close {
        position: absolute;
        right: -12px;
        top: -12px;
        width: 36px;
        height: 36px;
      }
      .title {
        margin-bottom: 20px;
        font-size: 20px;
        color: @color-text;
        line-height: 20px;
        text-align: center;
      }
      .change-wrap {
        position: relative;
        display: flex;
        align-items: center;
        margin: 0 auto 24px;
        width: 210px;
        height: 44px;
        background:rgba(224,46,36,0.20);
        border-radius: 100px;
        img {
          display: inline-block;
          width: 50px;
          height: 50px;
        }
        .petals {
          flex: 1;
          background: transparent;
          height: 44px;
          font-size: 32px;
          font-weight: bold;
          color: @color-text;
          line-height: 32px;
          text-align: center;
          box-sizing: border-box;
        }
      }
      .buy {
        padding: 15px 0 13px;
        background: @bg-color;
        border-radius:8px;
        height: 100px;
        box-sizing: border-box;
        .txt {
          position: relative;
          font-size: 24px;
          color: @color-white;
          line-height: 24px;
          text-align: center;
        }
        .wrap {
          position: relative;
          vertical-align: middle;
          margin-top: 5px;
          .icon {
            position: relative;
            vertical-align: middle;
            margin-right: 11px;
            width: 32px;
            height: 32px;
          }
          .num {
            position: relative;
            vertical-align: middle;
            font-size: @fontsize-large;
            color: @color-white;
          }
        }
      }
    }
  }  
</style>