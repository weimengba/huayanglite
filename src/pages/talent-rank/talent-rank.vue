<template>
  <div class="container">
  	<div class="top-wrap">
      <p class="tip">全网最有影响力的达人，全都汇聚在这里，花样年华诚邀各位老师入驻</p> 
      <div class="img-wrap">
        <!-- <image class="img" src="/static/image/"></image> -->
      </div>
    </div>
    <div class="title-wrap">
      <h5 class="title">红花总数排行榜</h5>
      <p class="tit-tip">（实时更新花朵数目）</p>
    </div>
    <div class="rank-wrap">
      <div class="item">
        <!-- <div class="rank"></div>
        <div class="info-wrap">
          <div class="user-wrap">
            <image class="avatar" src="http://image.kejixun.com/2018/0716/20180716063456822.jpg"></image>
            <p class="username">哈哈哈</p>
          </div>
        </div>
        <p class="flowers">13423424朵</p> -->
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    data() {
      return {

      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .container {
  	@container();
  	padding: 30px 20px;
  	box-sizing: border-box;
  	.top-wrap {
      position: relative;
    }
  }
</style>