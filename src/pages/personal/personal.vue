<template>
  <div class="container">
  	<div class="info-wrap">
      <div class="myinfo">
        <div class="avatar-wrap">
          <!-- <img class="avatar" :src="avatar" > -->
          <img class="avatar" mode="aspectFill" src="http://image.kejixun.com/2018/0716/20180716063456822.jpg" >
        </div>
        <p class="username">哈哈哈</p>
      </div>
      <div class="flowers">
        <p class="flowers-all item">总花朵数:<span class="red-txt">123424朵</span></p>
        <p class="flowers-month item">月花朵数:<span class="red-txt">24323朵</span></p>
      </div>
    </div>
    <scroll-view class="list-wrap" scroll-y>
      <list-rank>
        <template slot="article"></template>
      </list-rank>
    </scroll-view>
    <!-- <scroll-view class="list-wrap" scroll-y>
      <li class="rank-item" v-for="(item, index) in rankList" @click="viewDetail(item.id)" :key="item.id">
        <div v-else class="grade">{{index + 1}}</div>
        <div class="right">
          <text class="article-tit texts">{{item.title}}</text>
          <text class="flower-count texts">{{item.like}}朵</text>
        </div>
      </li>
    </scroll-view> -->
  </div>
</template>

<script type="text/javascript">
  import ListRank from 'components/listRank'
  export default {
  	data() {
  	  return {
        avatar: this.imgUrl + 'flowers_list.png'
  	  }
    },
    components: {
      ListRank
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .container {
  	@container();
  	padding: 30px 0;
  	box-sizing: border-box;
  	.info-wrap {
      position: relative;
      padding: 0 15px;
      border-bottom: 5px solid #f5f5f5;
      box-sizing: border-box;
      .myinfo {
        position: relative;
        .avatar-wrap {
          position: relative;
          margin: 0 auto 10px;
          width: 60px;
          height: 60px;
          border-radius: 90px;
          overflow: hidden;
        }
        .avatar {
          width: 100%;
          height: 100%;
          border: none;
        }
        .username {
          position: relative;
          width: 100%;
          font-size:20px;
          line-height:20px;
          text-align: center;
          .color-text
        }
      }
      .flowers {
        position: relative;
        display: flex;
        justify-content: space-between;
        padding: 25px 0 20px;
        font-size:18px;
        .color-text
        .item {
          flex: 1;
        }
        .red-txt {
          font-weight: bold;
          .color-redtext
        }
      }
    }
  }
</style>