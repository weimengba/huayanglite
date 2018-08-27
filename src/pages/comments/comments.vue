<template>
  <div class="container">
  	<scroll-view class="list-wrap" 
  			v-if="commentsList.length"
  			scroll-with-animation="true"
        @scroll="bindScroll"
  			style="height: 100%;"
            enable-back-to-top
             scroll-y
             scrolltolower=150
             @scrolltolower="loadMoreComm">
      <comment :commentsList="commentsList" :auth="auth"></comment>
    </scroll-view>
    <div class="comm-wrap">
      <to-comment :commfocus="commentfocus" :id="id" @toParent="toParent" @addCommentList="addCommentList"></to-comment>
    </div>
  </div>
</template>

<script type="text/javascript">
  import Comment from 'components/comment'
  import ToComment from 'components/toComment'
  import {mapGetters, mapActions} from 'vuex'
  export default {
  	data() {
  	  return {
  	  	id: '',
  	  	page: 1,
  	  	hasMore: true,
        commentsList: [],
        commentfocus: false,  //评论框获取焦点
        commentnum: ''
  	  }
  	},
  	computed: {
      ...mapGetters([
        'isAuth',
        'uid',
        'auth'
      ]),
    },
    onLoad(e) {
      this.id = e.id
    },
  	onShow() {
  	  this.page = 1
  	  this.hasMore = true
  	  this._getCommentL()
  	  this.commentsList = []
  	  wx.hideShareMenu()
    },
    watch: {
      commentnum() {
        wx.setNavigationBarTitle({
          title: this.commentnum+'条评论'
        })
      }
    },
    onHide() {
      this.commentfocus = false
    },
    onUnload() {
      this.commentfocus = false
    },
  	methods: {
      bindScroll(e) {
        if(this.commentfocus = true) {
          this.commentfocus = false
        }
      },
      toParent(bools) {  //子组件的评论获取焦点改变父组件的值
        this.commentfocus = true
      },
      addCommentList(commObj) {//子组件发布完评论或临时指定自己刚刚的评论
        this.commentsList.unshift(commObj)
        this.commentnum++
      },
  	  loadMoreComm() {
        if(!this.hasMore) {
          return
        }
        this.page ++
        this._getCommentL()
      },
  	  _getCommentL() {
  	  	wx.showLoading({
          title: '加载中...',
          mask: true
        })
        this.hasMore = true
  	  	this.$fly.post(`/index.php?m=minpackage&c=index&a=comment_list`, {
          auth: this.auth,
          id: this.id,
          type: 2,
          page: this.page
        })
        .then(res => {
          wx.hideLoading()
          if(res.result == 1) {
            this.commentnum = res.commentnum
            if(this.page <= 1) {
              this.commentsList = res.data
            }else {
              this.commentsList = this.commentsList.concat(res.data)
            }
            this._checkMore(res.data)
          }
        })
  	  },
  	  _checkMore(data) {
        if(!data.length) {
          this.hasMore = false
        }
      },
  	  ...mapActions([
        'setIsAuth',
      ])
  	},
  	components: {
      Comment,
      ToComment
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .container {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    .list-wrap {
      flex: 1;
      height: auto;
      padding-bottom: 50px;
      box-sizing: border-box;
    }
    .comm-wrap {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 45px;
    }
  }
</style>