<template>
  <!-- <div class="container"> -->
  <scroll-view class="container" scroll-y scroll-with-animation="true">
    <div class="banner-wrap">
      <div class="banner"></div>
    </div>
    <div class="avatar-wrap">
      <img class="avatar" mode="aspectFit" src="http://image.kejixun.com/2018/0508/20180508121516197.jpg" alt="">
    </div>
    <div class="info-wrap">
      <p class="name">洋葱视频</p>
      <div class="flowers">
        <img class="icon" :src="flower" />
        <span class="num">278朵</span>
      </div>
      <p class="tip">每小时更新数数量7天倒计时结束数时榜单的排行为最终每小时更新数量7天倒计最终每小束数时榜榜单榜榜单单榜</p>
      <p class="desc">说明：名人堂，系花样年华推出的名人名家风采展示活动，入选资格，需名下累计红花数超过10万朵，或者取得月赛冠军。</p>
    </div>
  <!-- </div> -->
  </scroll-view>
</template>

<script>
  export default {
    data() {
      return {
        flower: this.imgUrl + 'faouse_flower@2x.png'
      }
    },
    onShow() {
      console.log()
    },
    methods: {

    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .container {
    @container();
    .banner-wrap {
      position: relative;
      margin: 25px auto;
      width: 300px;
      height: 123px;
      .banner {
        position: relative;
        width: 100%;
        height: 100%;
        background-size: cover;
        .bg-image('famous_tit');
      }
    }
    .avatar-wrap {
      position: relative;
      .avatar {
        position: relative;
        display: block;
        width: 100%;
        min-height: 100px;
      }
    }
    .info-wrap {
      position: relative;
      padding: 30px 15px;
      box-sizing: border-box;
      .name {
        border:1px solid #f6652a;
        font-family:FZLTCHK--GBK1-0;
        font-size:24px;
        color:#f6652a;
        letter-spacing:0;
        line-height:36px;
        text-shadow:2px 2px 2px rgba(0,0,0,0.30);
        text-align:center;
      }
      .flowers {
        position: relative;
        margin: 16px auto 18px;
        text-align: center;
        .icon {
          position: relative;
          top: 3px;
          margin-right: 8px;
          width: 22px;
          height: 22px;
        }
        .num {
          font-size:18px;
          color:#333;
          line-height:18px;
        }
      }
      .tip,desc {
        color:#333;
        text-align: justify;
      }
      .tip {
        padding-bottom: 20px;
        line-height:34px;
        font-size:20px;
        border-bottom: 1px solid #e8e8e8;
      }
      .desc {
        padding-top: 20px;
        font-size: 16px;
        line-height: 28px;
      }
    }
  }
</style>

