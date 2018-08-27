<template>
  <div class="container">
    <scroll-view class="list-wrap"
                 enable-back-to-top
                 scroll-y
                 scrolltolower=150
                 @scrolltolower="loadMore">

      <listview 
            :data="list"
            :auth="auth"
            @viewDetail="viewDetail" 
            @shareDetail="shareDetail"
            @changeThumb="changeThumb"
            :lazyLoad="lazyLoad"
            ></listview>
    </scroll-view>
    <div class="refresh" @click.stop="refreshFun">
      <img :src="refresh" alt="" class="icon">
    </div>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
import {reLogin} from '../../utils/index.js'
import Listview from 'components/listview'
let PageNum = 10  //每页显示的数量
export default {
  data() {
    return {
      page: 1,
      hasMore: true,
      list: [],
      lazyLoad: true,
      petal: '',

      flowerrate: this.imgUrl + 'flowerrate.png',
      refresh: this.imgUrl + 'refresh_icon.png'
    }
  },
  computed: {
    ...mapGetters([
      'auth',
      'uid',
      'auid',
      'activity',
      'indexInfo'
    ])
  },
  onLoad(options) {
    var uid = options.auid
    if(uid) {  //通过转发进入
      // 重新登录
      reLogin(this,uid)
    }
    this._getList()
  },
  onShow() {
    if(this.indexInfo.id!='') {//当有需要更改的数据时，对该条数据单独修改
      this.list.map(item => {
        if(item.id==this.indexInfo.id) {
          item.plays = this.indexInfo.borwser
          item.share = this.indexInfo.shared
          item.praises = this.indexInfo.thumb
        }
      })
      wx.hideLoading()
      return
    }else { //当没有需要更改的数据时（一般从活动列表页面返回到首页时），重新加载页面
      this.page = 1
      this._getList()
    }
  },
  onHide() {
    this.setIndexInfo({
      id: '',
      borwser: 0,
      shared: 0,
      thumb: 0
    })
  },
  onUnload() {
    this.setIndexInfo({
      id: '',
      borwser: 0,
      shared: 0,
      thumb: 0
    })
  },
  methods: {
    shareDetail(id) {
      console.log("要分享的ID "+id)
    },
    changeThumb(d) {  //改变点赞
      this.list = d
    },
    viewDetail(item, index) {
      this.item = item
      wx.navigateTo({
        url: `/pages/detail/main?id=${item.id}&index=${index}`
      })
    },
    refreshFun() {
      this.page = 1
      this.list = []
      this._getList()
      this.scrollTop = 0
    },
    // 加载更多
    loadMore() {
      if(!this.hasMore) {
        return
      }
      this.page ++
      this._getList()
    },
    _getList() {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      this.hasMore = true
      this.$fly.get(`index.php?m=minpackage&c=index&a=figure_lists`, { //figure_lists
        page: this.page,
        auth: this.auth
      }).then(res => {
        if(res.timeout == 20000) {
          wx.showToast({
            title: '请求超时，请重启小程序',
            icon: 'none',
            duration: 5000
          })
          return
        }
        if(res.result === 1) {
          wx.hideLoading()
          if(this.page <= 1) {
            this.list = res.data
          }else {
            this.list = this.list.concat(res.data)
          }
          this.petal = res.petal
          this._checkMore(res.data)
        }
      })
    },
    _checkMore(data) {
      if(!data.length) {
        this.hasMore = false
      }
    },
    _shareCallBack(result) {
      let that = this
      this.$fly.get(`/index.php?m=minpackage&c=index&a=share`, {
        id: 0,
        auth: this.auth
      }).then(res => {
        
      })
    },
    ...mapActions([
      'setIndexInfo'
    ])
  },
  watch: {
    auth() {
      this._getList()
    }
  },
  components: {
    Listview
  },
  onShareAppMessage(e) {
    const _this = this
    let id = e.target.id.split('##')[0]
    let title = e.target.id.split('##')[1]
    let image = e.target.id.split('##')[2]
    if(e.from == 'button') { //首页分享详情
      return {
        path: `/pages/detail/main?id=${id}&auid=${this.auid}`,
        imageUrl: image,
        title: title,
        success(result,id) {
          _this._shareCallBack(result)
        }
      }
    }else {
      return {
        path: `/pages/persons/main?auid=${this.auid}`,
        imageUrl: this.imgUrl + 'share_product@3x.png',
        title: '加入【花样年华lite】免费拿走生活商品，传递爱与惊喜！',
        success(result) {
          _this._shareCallBack(result)
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .container {
    @container();
  }
  .list-wrap {
    box-sizing: border-box;
    height: 100%;
  }
  .refresh {
    width: 44px;
    height: 44px;
    position: fixed;
    z-index: 199;
    background-color: #fff;
    box-shadow:0 2px 4px 0 rgba(0,0,0,0.50);
    overflow: hidden;
    right: 20px;
    bottom: 40px;
    border-radius: 50%;
    .icon {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
</style>
