<template>
    <ul class="list-ul" v-if="lists.length">

      <li class="item"
          v-for="(item, index) of lists" :key="index"
          :style="{backgroundImage: item.thumb}"
          @click="viewDetail(item, index)">
        <p class="title">{{item.title}}</p>
        <img :src="item.thumb" alt="" mode="widthFix" class="item-img" :lazy-load="lazyLoad">
        <div class="bottom">
          <p class="plays"><img :src="browerImg" class="item-icon browser" :lazy-load="lazyLoad">浏览:{{item.plays}}</p>
          <!-- <p class="share"><img :src="shareImg" class="item-icon" :lazy-load="lazyLoad">分享:{{item.share}}</p> -->
          <!-- <p class="time"><img :src="item.is_praises==1 ? onThumbI : thumbImg" class="item-icon" :lazy-load="lazyLoad" @click.stop.prevent="thumbUp(item.is_praises,item.praises,item.id)">点赞:{{item.praises}}</p> -->
          <p class="time" @click.stop.prevent="thumbUp(item.is_praises,item.praises,item.id)"><img :src="item.is_praises==1 ? onThumbI : thumbImg" class="item-icon" :lazy-load="lazyLoad">点赞:{{item.praises}}</p>
          <!-- <p class="share"><img :src="shareImg" class="item-icon" :lazy-load="lazyLoad">分享:{{item.share}}</p> -->
          <p class="share"><button class="share-btn" open-type="share" hover-class="none" @click.stop.prevent="shareDetail(item.id)" :id="item.id+'##'+item.title+'##'+item.thumb1"><img :src="shareImg" class="item-icon" :lazy-load="lazyLoad">分享:{{item.share}}</button></p>
        </div>
      </li>

    </ul>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    lazyLoad: {
      type: Boolean,
      default: false
    },
    auth: {
      type: String,
      default: ''
    }
  },
  watch: {
    data() {
      this.lists = this.data
    },
    deep: true
  },
  data() {
    return {
      lists: '',
      browerImg: this.imgUrl + 'Hbrowser_2x.png',
      shareImg: this.imgUrl + 'Hshare_2x.png',
      thumbImg: this.imgUrl + 'Hthumb_2x.png',
      onThumbI: this.imgUrl + 'Hthumb_on@2x.png'
    }
  },
  methods: {
    shareDetail(id) {
      this.$emit('shareDetail', id)
    },
    viewDetail(item, index) {
      this.$emit('viewDetail', item, index)
    },
    thumbUp(ispraises,praises,id) {  //点赞
      wx.showLoading({
        mask: true
      })
      this.$fly.get(`/index.php?m=minpackage&c=index&a=add_praises_num&id=${id}&type=2&auth=${this.auth}&ispraises=${ispraises}`)
      .then(res => {
        if(res.result == 1) {     
          let changeData = this.data.map((item) => {
            if(item.id==id) {
              item.is_praises = ispraises==0 ? 1 : 0
              item.praises = ispraises==0 ? (item.praises*1+1) : (item.praises*1-1)
            }
            return item
          })
          this.$emit('changeThumb', changeData)
          wx.hideLoading()
        }else {
          wx.hideLoading()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .list-ul {
    padding-bottom: 10px;
    background-color: @bg-white;
    overflow: hidden;
    z-index: 190;
    .item {
      position: relative;
      margin-top: 20px;
      padding: 0 10px;
      width: 100%;
      overflow: hidden;
      background-position: 50%;
      background-repeat: no-repeat;
      background-size: cover;
      border-bottom: 7px solid #f5f5f5;
      box-sizing: border-box;
      .title {
        font-family: STXihei, "华文细黑", "Microsoft YaHei", "微软雅黑";
        margin-bottom: 15px;
        font-size: @fontsize-llarge;
        color: @color-text;
        .ellipsis(2);
        line-height: 28px;
        text-align: justify;
      }
      .item-img {
        display: block;
        width: 100%;
      }
      .bottom {
        position: relative;
        @flexBetween();
        line-height: 14px;
        font-size: @fontsize-small;
        color: @color-text;
        .plays,.share,.time {
          position: relative;
          flex: 1;
          padding: 15px 0;
        }
        .share {
          text-align: right;
        }
        .time {
          text-align: center;
        }
        .item-icon {
          position: relative;
          display: inline-block;
          bottom: -3px;
          margin-right: 5px;
          width: 18px;
          height: 18px;
        }
        .browser {
          bottom: -4px;
        }
      }
    }
    .share-btn {
      display: inline-block;
      background-color: transparent;
      height: auto;
      padding: 0;
      line-height: 1;
      font-size: 14px;
    }
  }
</style>
