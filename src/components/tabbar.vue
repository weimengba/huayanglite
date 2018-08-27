<template>
  <div class="tabbar">
    <div class="tabbar_box">
      <a class="tabbar_nav"
         v-for="(item, index) of tabber.list"
         :key="index"
         :href="item.pagePath"
         open-type="redirect">
        <image class="tabbar_icon" :src="item.selected ? item.selectedIconPath : item.iconPath"></image>
        <text>{{item.text}}</text>
      </a>
    </div>
  </div>
</template>


<script>

export default {
  data() {
    return {
      tabbar:{
        color: "#999",
        selectedColor: "#f40009",
        backgroundColor: "#fff",
        borderStyle: "#fff",
        list: [
          {
            pagePath: "/pages/index/main",
            text: "精选",
            iconPath: "/static/image/20@3x.png",
            selectedIconPath: "/static/image/21@3x.png",
            selected: true
          },
          {
            pagePath: "/pages/mycenter/main",
            text: "我的",
            iconPath: "/static/image/22@3x.png",
            selectedIconPath: "/static/image/23@3x.png",
            selected: false
          }
        ],
        position: "bottom"
      }
    }
  },
  methods: {
    editTabBar() {
      var tabbar = this.tabbar,
          currentPages = getCurrentPages(),
          _this = currentPages[currentPages.length - 1],
          pagePath = _this.__route__;
      (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
      for(var i in tabbar.list){
        tabbar.list[i].selected = false;
        (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
      }
      _this.setData({
        tabbar: tabbar
      })
    }
  },
  onLoad() {
    console.log(this.imgUrl)
    this.editTabBar()
  }
}
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .tabbar_box{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 88px;
    border-top: 1rpx solid #fff; 
    .tabbar_nav{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      height: 100%;
    }
    .tabbar_icon{
      width: 48px;
      height: 48px;
    }
  }
</style>
