<template>
  <div class="container">
    <scroll-view class="wrap" 
            v-if="recordList.length"
            enable-back-to-top
            scroll-y>

      <div class="item" v-for="(item, index) in recordList" :key="index">
        <div class="left-info">
          <p class="title">{{item.note}}</p>
          <p class="time">{{item.createtime}}</p>
        </div>
        <text class="petal">{{item.mold ==2 ? '+' : '-'}}{{item.point}}花瓣</text>
      </div>

    </scroll-view>
  	<div class="page-tip">（只显示最近花朵记录）</div>
  </div>
</template>

<script type="text/ecmascript">
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        recordList: []
      }
    },
    computed: {
      ...mapGetters([
        'isAuth',
        'uid',
        'auth'
      ]),
    },
    onLoad() {

    },
    onShow() {
      this.getPetalRecord()
      wx.setNavigationBarTitle({
        title: '花瓣记录'
      })
      wx.hideShareMenu()
    },
    methods: {
      getPetalRecord() {
        this.$fly.get(`index.php?m=minpackage&c=index&a=flower_lists`, {
          auth: this.auth
        }).then(res => {
          if(res.result === 1) {
            this.recordList = res.list
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .container {
  	@container();
  	.wrap {
  	  position: relative;
      width: 100%;
      height: calc(100% - 50px);
  	  .item {
  	  	position: relative;
  	  	@flexBetween();
  	  	padding: 14px 15px 15px;
  	  	box-sizing: border-box;
  	  	border-bottom: 1px solid #e8e8e8;
  	  	.left-info {
  	  	  position: relative;
  	  	  .title {
  	  		  margin-bottom: 10px;
      			font-size:16px;
      			line-height: 16px;
      			color:#333;
  	  	  }
  	  	  .time {
      			font-size:13px;
      			line-height: 13px;
      			color:#999;
  	  	  }
  	  	}
  	  	.petal {
  	  	  position: relative;
          line-height: 40px;
    		  font-size:16px;
    		  color:#333;
  	  	}
  	  }
  	}
  	.page-tip {
  	  position: absolute;
  	  bottom: 0;
      width: 100%;
      height: 50px;
      line-height: 50px;
	    font-size:13px;
	    color:#999;
	    text-align: center;
      box-sizing: border-box;
  	}
  }
</style>