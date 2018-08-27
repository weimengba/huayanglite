<template>
  <div class="rank-wrap">
    
    <!-- 内容分发文章类型的列表 -->
    <slot name="article">
      <div class="rank-article item">
        <div class="rankNo redNo">1</div>
        <div class="right-info">
          <div class="article-name">文章名称文章名称文章名称文章名称文章名称文章名称</div>
          <div class="flowers">999999朵</div>
        </div>
      </div>
    </slot>
    <!-- 内容分发头像类型的列表 -->
    <slot name="avatar">
      <div class="rank-avatar item">
        <div class="rankNo redNo">2</div>
        <div class="right-info">
          <div class="user-info">
            <div class="avatar">
              <img class="myavatar" mode="aspectFill" src="http://image.kejixun.com/2018/0716/20180716063456822.jpg" lazy-load="lazyLoad">
            </div>
            <p class="name">哈哈哈</p>
          </div>
          <div class="flowers">999999朵</div>
        </div>
      </div>
    </slot>
    

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        lazyLoad: true
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .rank-wrap {
    position: relative;
    width: 100%;
    .item {
      position: relative;
      @flexBetween();
      width: 100%;
      box-sizing: border-box;
    }
    .rank-article {
      .rankNo {
        width: 50px;
        padding: 20px 0 20px 10px;
        font-size: @fontsize-llarge;
        font-weight: bold;
        box-sizing: border-box;
        text-align: center;
      }
      .redNo {
        color: @color-redtext;
      }
      .right-info {
        position: relative;
        @flexBetween();
        flex: 1;
        padding: 20px 10px 20px 0;
        max-width: calc(100% - 50px);
        border-bottom: 1px solid #e8e8e8;
        font-size: @fontsize-llarge;
        .article-name {
          position: relative;
          width: calc(100% - 100px);
          @textLimit();
        }
        .flowers {
          line-height:20px;
          width: 90px;
          font-size: @fontsize-large;
          font-weight: bold;
          box-sizing: border-box;
          color: @color-redtext;
        }
      }
    }
    .rank-avatar {
      .rankNo {
        width: 64px;
        padding: 15px 0;
        font-size: @fontsize-llarge;
        font-weight: bold;
        box-sizing: border-box;
        text-align: center;
      }
      .redNo {
        color: @color-redtext;
      }
      .right-info {
        position: relative;
        @flexBetween();
        flex: 1;
        padding: 15px 10px 15px 0;
        max-width: calc(100% - 64px);
        border-bottom: 1px solid #e8e8e8;
        font-size: @fontsize-llarge;
        .user-info {
          position: relative;
          width: calc(100% - 100px);
          .avatar {
            position: relative;
            display: inline-block;
            margin-right: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            .myavatar {
              width: 100%;
              height: 100%;
            }
          }
          .name {
            position: relative;
            display: inline-block;
            width: calc(100% - 50px);
            @textLimit();
            font-size: @fontsize-llarge;
            line-height: 40px;
            color: @color-text;
          }
        }
        .flowers {
          line-height: 20px;
          width: 90px;
          font-size: @fontsize-large;
          font-weight: bold;
          box-sizing: border-box;
          color: @color-redtext;
        }
      }
    }
  }
</style>
