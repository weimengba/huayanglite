<template>
  <div v-if="commentsList.length" class="contain">
  	<div v-if="commentsList.length" v-for="(item,index) in commentsList" class="comment-item" :key="index">

    <div class="avatar-wrap">
      <div class="avatar" v-if="!item.headface">
        <open-data type="userAvatarUrl" class="open-data" :src="item.headface"></open-data> 
      </div>
      <image v-if="item.headface" lazy-load="lazyLoad" class="avatar" :src="item.headface"></image>
           
    </div>
    <div class="right-content">
      <div class="con-wrap">
        <div class="left-wrap">
          <p v-if="item.nick" class="name">{{item.nick}}</p>
          <open-data type="userNickName" v-if="!item.nick" class="name">{{item.nick}}</open-data>

          <p class="time">{{item.time}}</p>
        </div>
        <div @click="commentThumb(item.id,item.like,item.ispraise)" class="thump-wrap">
          <image class="thumb" v-if="item.ispraise==0" :src="noThumb" lazy-load="lazyLoad"></image>
          <image class="thumb" v-else :src="yesThumb" lazy-load="lazyLoad"></image>

          <text class="thumb-num">{{item.like}}</text>
        </div>
      </div>
      <p class="comment-desc">{{item.comment}}</p>
    </div>
  </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  data() {
  	return {
      lazyLoad: true,
      noThumb: this.imgUrl + 'no_thumb.png',
      yesThumb: this.imgUrl + 'yes_thumb.png'
  	}
  },
  props: {
    commentsList: {
      type: Array,
      default: () => []
    },
    auth: {
      type: String,
      default: ''
    }
  },
  onShow() {
  	
  },
  methods: {
    commentThumb(id,like,ispraise) {
      wx.showLoading({
        mask: true
      })
      this.$fly.get(`/index.php?m=minpackage_c&c=index&a=change_comment_like&id=${id}&type=2&auth=${this.auth}`)
      .then(res => {
      	if(res.result == 1) {
      	  this.commentsList.map(item => {
      	  	if(item.id===id) {
              if(ispraise===1) {//要取消点赞
      	  	  	item.ispraise = 0
                item.like--
              }else {  //要添加点赞
      	  	  	item.ispraise = 1
      	  	  	item.like++
      	  	  }
            }
          })
          this.setNewComments(this.commentsList.slice(0,10))  //返回前十条数据用于修改详情页面的评论
          wx.hideLoading()
      	}
      	return
      })
    },
    ...mapActions([
      'setNewComments'
    ])
  }
}
</script>

<style lang="less" scoped>
@import '~common/less/mixin.less';
@import '~common/less/variable.less';
.contain {
  position: relative;
  padding: 0 15px 0;
  overflow-x: hidden;
}
.open-data {
  width: 30px;
  height: 30px;
}
.comment-item {
  position: relative;
  display: flex;
  padding-top: 5px;
  box-sizing: border-box;
  .avatar-wrap {
    position: relative;
    margin-right: 10px;
    width: 30px;
    height: 30px;
    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  .right-content {
    position: relative;
    flex: 1;
    padding-bottom: 5px;
    border-bottom: 1px solid #e8e8e8;
    text-align:left;
    word-break: break-all;
    .con-wrap {
      position: relative;
      @flexBetween();
      .left-wrap {
        .name {
          margin-top: 5px;
          font-size: @fontsize-ssmall;
          color: @color-text;
          line-height: 12px;
        }
        .time {
          padding-top: 5px;
          font-size: @fontsize-ssmall;
          color: @color-text1;
          line-height: 12px;
        }
      }
      .thump-wrap {
        position: relative;
        padding: 5px 0;
        font-size: 0;
        box-sizing: border-box;
        .thumb {
          position: relative;
          top: 1px;
          margin-right: 5px;
          width: 16px;
          height: 14px;
        }
        .thumb-num {
          font-size: @fontsize-small;
          color: @color-text1;
          line-height: 14px;
        }
      }
    }
    .comment-desc {
      padding: 5px 0;
      font-size: @fontsize;
      color: @color-text;
      line-height: 26px;
    }
  }
}
.comment-item:last-child {
  margin-bottom: 20px;
}
</style>
