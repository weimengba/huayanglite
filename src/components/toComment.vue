<template>
  <div class="wrapper">
    <div class="layer" @click="hideLayer" v-show="commentfocus"></div>
    <div class="comment-wrap">
      <div class="comment-before" v-show="!commentfocus">
        <!-- <image class="comment-icon" src="/static/image/comment-icon.png"></image> -->
        <image class="comment-icon" :src="commentIcon" :lazy-load="lazyLoad"></image>
        <input class="comment" type="text"
            placeholder="写评论" />
        <button v-if="!commentfocus" class="submit-btn" 
            open-type="getUserInfo"
            @getuserinfo="submitComment"></button>
      </div>
      <div v-show="commentfocus" class="comment-to">
        <div class="left">
          <!-- <image class="comment-icon" src="/static/image/comment-icon.png"></image> -->
          <image class="comment-icon" :src="commentIcon" :lazy-load="lazyLoad"></image>
          <input class="commenting" type="text" 
              v-model="comments"
              :focus="commentfocus"
              @confirm="sendComment"
              placeholder="写评论" />
        </div>
        <button class="goSubmit" @click="sendComment">发送</button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapActions} from 'vuex'
  import {newFormatTime} from '../utils/index.js'
  export default {
    props: {
      commfocus: {
        type: Boolean,
        default: false
      },
      id: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        lazyLoad: true,
        commentfocus: '',
        comments: '',
        commentIcon: this.imgUrl + 'comment-icon.png'
      }
    },
    watch: {
      commfocus() {
        if(this.commfocus) {
           this.commentfocus = true
        }else {
           this.commentfocus = false
           this.comments = ''
        }
      }
    },
    computed: {
      ...mapGetters([
        'isAuth',
        'uid',
        'auth'
      ]),
    },
    methods: {
      hideLayer() {
        this.commentfocus = false
        this.comments = ''
      },
      // 文章评论功能
      sendComment() {
        let that = this
        let commObj = {
          comment: this.comments,
          headface: '',
          id: '',
          ispraise: 0,
          like: 0,
          nick: '',
          time: ''
        }

        let d = new Date()
        commObj.time = newFormatTime(d)

        this.$fly.get(`/index.php?m=minpackage_c&c=index&a=add_comment`, {
          auth: this.auth,
          oid: this.id, // 文章id
          type: 2,
          comment: that.comments
        }).then(res => {
          if(res.result === 1) {
            // 顶部显示个人评论 
            commObj.id = res.data

            this.$emit("addCommentList",commObj)

            this.commentfocus = false
            that.comments = ''
            wx.showToast({
              title: '评论成功',
              mask: true,
              duration: 2000
            })
          }else {
            this.commentfocus = false
            that.comments = ''
            // 评论失败
            wx.showToast({
              title: '评论失败',
              icon: 'none',
              mask: true,
              duration: 2000
            })
          }
        })
      },
      // 评论模块
      submitComment(e) {
        const userInfo = e.target.userInfo
        // 拒绝授权
        if(!e.target.userInfo) {
          wx.showToast({
            icon: 'none',
            title: '只有授权才可评论哦~',
            duration: 2500,
            mask: true
          })
          return
        }else {
          // this._editUserInfo(userInfo)
          if(this.isAuth == 0) {
            // 未授权，修改用户信息
            this._editUserInfo(userInfo)
          }else {
            this.commentfocus = true
            this.$emit("toParent",true)  //将父级组件的commentfocus状态改变为true
            // // 已授权，给文章评论
          }
        }
      },
      // 授权
      _editUserInfo(userInfo) {
        this.$fly.post(`/index.php?m=minpackage_c&c=api&a=editUserinfo`, {
          auth: this.auth,
          gender: userInfo.gender,
          nick: userInfo.nickName,
          headface: userInfo.avatarUrl
        })
        .then(res => {
          wx.hideLoading()
          if(res.result === 1) {
            this.setIsAuth(1)
            this.commentfocus = true 
            this.$emit("toParent",true)  //将父级组件的commentfocus状态改变为true  
          }
        })
      },
      ...mapActions([
        'setIsAuth',
      ])
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .wrapper {
    position: relative;
    width: 100%;
    height: auto;
    .layer {
      @layer();
      z-index:100;
    }
    .comment-wrap {
      position: relative;
      margin: 0 15px 0;
      width: auto;
      height: 40px;
      z-index: 101;
      .comment-before {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 105;
        .comment-icon {
          .absoluteNum(4px,6px,24px,24px);
        }
        .comment {
          padding-left: 32px;
          height: 100%;
          line-height: 32px;
          font-size: @fontsize-small;
          border: 1px solid #e8e8e8;
          border-radius: 6px;
          box-sizing: border-box;
          z-index: 105;
          background: #f5f5f5;
        }
        .submit-btn {
          @absoluted();
          margin: 0;
          padding: 0;
          background-color: transparent;
          border-radius: 0;
          z-index: 95;
        }
      }
      .comment-to {
        position: absolute;
        @flexBetween();
        width: 100%;
        height: 100%;
        z-index: 102;
        .left {
          position: relative;
          height: 100%;
          flex: 1;
          .comment-icon {
            .absoluteNum(4px,6px,24px,24px);
          }
          .commenting {
            padding-left: 32px;
            height: 100%;
            line-height: 32px;
            font-size: @fontsize-small;
            border: 1px solid #e8e8e8;
            border-radius: 6px;
            box-sizing: border-box;
            background: #f5f5f5;
          }
        }
        .goSubmit {
          position: relative;
          margin: 0 0 0 5px;
          padding: 0;
          width: 62px;
          height: 100%;
          font-size: @fontsize;
          color: @color-text;
          text-align: center;
          line-height: 40px;
          background-color: @bg-white;
        }
        .goSubmit:after {
          border: none;
        }
      }
    }
  }
</style>