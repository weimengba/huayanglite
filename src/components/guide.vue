<template>
  <div class="guide" @click.stop="closeAlert">
    <img class="guide-img" :src="guideImg" />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        guideImg: this.imgUrl + 'H_@2.1x.gif'
      }
    },
    methods: {
      closeAlert() {
        this.$emit('guideFun')
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .guide {
    @layer();
    z-index: 999;
    .guide-img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100vh;
    }
  }
</style>
