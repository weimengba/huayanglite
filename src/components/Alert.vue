<template>
  <div class="alert-wrap">
  	<div class="layer"></div>
  	<!-- <div class="box-wrap" :style="changeTip?'height:130px;':''"> -->
			<!-- endFlower==height:150px; -->
		<div class="box-wrap" :style="styleH">
  	  <!-- <div class="close-wrap" v-if="!changeTip"> -->
  	  <div class="close-wrap">
  	  	<image @click.stop="close" class="close" :src="closeIcon" :lazy-load="lazyLoad"></image>
  	  </div>
  	  <div class="content-wrap">
  	  	<p class="content" v-if="alertShow">您今日3朵免费红花已送出，分享3次，奖励3朵红花。</p>
				<!-- <p class="content" v-if="changeTip">您今日免费花朵已送完，去购买红花打赏。</p> -->
				<p class="content" v-if="endFlower">您今日免费花朵已经送完，去购买红花打赏。</p>
  	  </div>
  	  <div class="btn-wrap">
				<!-- 转发签到 -->
				<template v-if="alertShow">
					<button class="share btn" @click.stop="share" open-type="share" hover-class="none">去转发</button>
  	  	  <!-- <button class="register btn" @click.stop="register">去签到</button> -->
				</template>
				<!-- 花瓣转花朵 -->
				<!-- <template v-if="changeTip">
					<button class="share btn" @click.stop="ok">确定</button>
  	  	  <button class="register btn btnno" @click.stop="no">取消</button>
				</template> -->
				<!-- 所有花朵送完 -->
				<template v-if="endFlower">
					<button class="share btn" @click.stop="getPetal">购买红花</button>
				</template>
  	  </div>
  	</div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
  	data() {
  	  return {
				lazyLoad: true,
				closeIcon: this.imgUrl + 'close.png'
  	  }
		},
		props: {
			alertShow: {
				type: Boolean,
				default: false
			},
			// changeTip: {
			// 	type: Boolean,
			// 	default: false
			// },
			endFlower: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			styleH() {//box-wrap的高度
			if(this.alertShow) {
					// return 'height:150px;'
					return 'height:150px;'
				}else if(this.endFlower) {
					return 'height:160px;'
				}
				// if(this.alertShow) {
				// 	return 'height:150px;'
				// }else if(this.changeTip) {
				// 	return 'height:130px;'
				// }else if(this.endFlower) {
				// 	return 'height:160px;'
				// }
			}
		},
    methods: {
      close() {
        this.$emit('hideAlert',false)
      },
      share() {
      	this.$emit('onShareAppMessage','share')
      },
      // register() {
      // 	this.$emit('goRegister',true)
			// },
			// ok() {
			// 	this.$emit('usePetal',true)
			// },
			// no() {
			// 	this.$emit('usePetal',false)
			// },
			getPetal() {
				this.$emit('getPetal',true)
			}
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .alert-wrap {
  	.layer {
  	  @layer();
  	  z-index: 99;
  	}
    .box-wrap {
      @absoCenter();
			padding: 15px;
			background: @bg-white;
			border-radius: 12px;
			width: 280px;
			height: 208px;
			z-index: 100;
			.close-wrap {
				position: relative;
				text-align: right;
				font-size: 0;
				.close {
					width: 20px;
					height: 20px;
				}
			}
			.content-wrap {
				position: relative;
				margin: 8px 0;
				.content {
					font-size: @fontsize-large;
					color: @color-text;
					line-height: 30px;
					text-align: center;
				}
			}
	    .btn-wrap {
				position: relative;
				// display: flex;
				// justify-content: space-between;
				.flex();
				.btn {
					margin-top: 5px;
					border: 0 solid #999;
					border-radius: 100px;
					width: 122px;
					height: 39px;
					font-weight: bold;
					font-size: @fontsize-large;
					line-height: 39px;
				}
        .share {
					background-color: @bg-color;
					color:  @color-white;
        }
				.btnno {
					background-color: #d3d3d3;
					color:  @color-white;
				}
	    }
    }
  }  
</style>