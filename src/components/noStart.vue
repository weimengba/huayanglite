<template>
  <div class="wrap" v-if="status == 2">
    <div class="time-wrap">
      <div class="tip-time">
        <text class="time-tip">距离活动开始</text>
        <text class="time">{{day}}</text>
        <text class="word">天</text>
        <text class="time">{{hour}}</text>
        <text class="word">小时</text>
        <text class="time">{{minute}}</text>
        <text class="word">分钟</text>
        <text class="time">{{second}}</text>
        <text class="word">秒</text>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // hasTime: '',
        day: '00',
        hour: '00',
        minute: '00',
        second: '00',
      }
    },
    props: {
      notime: {
        type: String,
        default: ''
      },
      status: {
        type: String,
        default: ''
      }
    },
    watch: {
      notime() {
        // this.hasTime = this.notime
        this._countDowns(this.notime)
      },
      status() {
        // console.log("status: "+this.status)
      }
    },
    methods: {
      _countDowns(time) {
        let that = this
        if(time<=0){
          this.day = '00'
          this.hour = '00'
          this.minute = '00'
          this.second = '00'
          return
        }
        clearInterval(this.timers)
        this.timers = setInterval(() => {
          if(time<0) {
            this.$emit("activitying")
            clearInterval(this.timers)
            return
          }
          this.day = this._padLefts(Math.floor(time/60/60/24))
          this.hour = this._padLefts(Math.floor(time/60/60%24))
          this.minute = this._padLefts(Math.floor(time/60%60))
          this.second = this._padLefts(Math.floor(time%60))
          time--
        },1000)
      },
      _padLefts(v) {
        return v*1<=9 ? '0'+v : v
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .wrap {
    @layer();
    z-index: 888;
    .time-wrap {
      @absoCenter();
      height: 24px;
      .tip-time {
        font-size: 0;
        text-align: center;
      }
      .time-tip {
        margin-right: 10px;
        font-size: @fontsize;
        color: #fadb00;
        line-height: 16px;
      }
      .tip-time > text {
        display: inline-block;
        margin: 0 3px;
        vertical-align: middle;
      }
      .time {
        width: 22px;
        height: 22px;
        line-height: 22px;
        font-size: @fontsize-small;
        color: #fff;
        background: #f40009;
        border-radius: 4px;
      }
      .active {
        background-color: #f40009;
      }
      .word {
        font-size: @fontsize-small;
        color:#fadb00;
        line-height: 14px;
      }
    }
  }
</style>
