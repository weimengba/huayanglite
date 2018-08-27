<template>
  <div class="container">
  	<scroll-view v-if="collectList.length" class="collect-list" scroll-y>
      <div class="item"
              v-for="(item, index) of collectList"
              :key="index"
              @click="viewDetail(index)">
        <img :src="item.thumb" alt="" class="item-img" mode="aspectFill">
        <div class="item-right">
          <p class="title">{{item.title}}</p>
          <p class="time">发布时间：{{item.time}}</p>
          <div class="btn-group">
            <div class="btn" @click.stop="delItem(index)">删除</div>
            <button class="btn"
                :id="index"
                open-type="share"
                hover-class="none"
                @click.stop="share">分享</button>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script type="text/javascript">
import {sharedAddFlowers} from '../../utils/index.js'
import {mapGetters, mapActions} from 'vuex'
  export default {
  	data() {
  	  return {
  	  	collectList: [],
        page: 1,
        hasMore: true
  	  }
  	},
  	computed: {
	  ...mapGetters([
	    'isAuth',
	    'uid',
	    'auth'
	  ]),
	},
	onShow() {
	  wx.setNavigationBarTitle({
      title: '打赏文章'
    })
    this.page = 1
    this.hasMore = true
    this.collectList = []
    this._getReward()
  },
  onShareAppMessage(e) {
    const idx = e.target.id
    const _this = this
    return {
      title: `【@所有人】${this.collectList[idx].title}`,
      imageUrl: this.collectList[idx].thumb,
      path: `/pages/detail/main?id=${this.collectList[idx].id}&auid=${this.auth}`,
      success(result) {
        _this._shareCallBack(result,idx)
      }
    }
  },
  	methods: {
      viewDetail(index) {
        wx.navigateTo({
          url: `/pages/detail/main?id=${this.collectList[index].id}`
        })
      },
      delItem(index) {
        const _this = this
        wx.showModal({
          title: '提示',
          content: '确认要删除该打赏文章？',
          mask: true,
          success(res) {
            if(res.confirm) {
              _this._delItem(index)
              _this.collectList.splice(index, 1)
            }
          }
        })
      },
	  // 阻止分享按钮事件冒泡
	  share() {},
	  _getReward() {
	    wx.showLoading({
	      title: '加载中...',
	      mask: true
	    })
	    this.$fly.get(`/index.php?m=minpackage&c=index&a=lists_like&page=${this.page}&auth=${this.auth}`)
	      .then(res => {
	      if(res.result === 1) {
	        wx.hideLoading()
	        this.collectList = res.data
	      }
	    })
	  },
	  _shareCallBack(result,index) {
	    this.$fly.get(`/index.php?m=minpackage&c=index&a=share`, {
	      id: this.collectList[index].id,
	      auth: this.auth
	    }).then(res => {
	      sharedAddFlowers(result, res)
	    })
	  },
	  _delItem(index) {
	    this.$fly.get(`index.php?m=minpackage&c=index&a=delListLike`, {        
	      type: 2, //类型 1视频 2文章
	      auth: this.auth,
	      oid: this.collectList[index].id
	    }).then(res => {
	      if(res.result === 1) {
	        wx.showToast({
	          title: '删除成功',
	          duration: 2500,
	          mask: true
	        })
	      }
	    })
	  },
	  }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .container {
    @container();
  }
  .collect-list {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .item {
      padding: 0 15px;
      display: flex;
      align-items: center;
      &+.item {
      	margin-top: 20px;
      }
      .item-img {
        width: 130px;
        height: 113px;
        margin-right: 10px;
      }
      .item-right {
        flex: 1
      }
      .title {
        font-size: 18px;
        color: #333;
        line-height: 22px;
        .ellipsis(2);
        text-align: justify;
        margin-bottom: 10px;
      }
      .time {
        font-size: 14px;
        color: #333;
        margin-bottom: 15px;
        line-height: 1;
      }
      .btn-group {
        display: flex;
        justify-content: space-between;
        .btn {
          width: 90px;
          height: 30px;
          line-height: 29px;
          border: 1rpx solid #979797;
          text-align: center;
          font-size: 18px;
          color: #333;
          padding: 0;
          margin: 0;
          box-sizing: border-box;
          background-color: #fff;
          border-radius: 30px;
        }
      }
    }
    .item:first-child {
      margin-top: 10px;
    }
    .item:last-child {
      margin-bottom: 10px;
    }
  }
</style>