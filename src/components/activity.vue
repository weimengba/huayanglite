<template>
  <div class="top-wrap">
    <div class="top-tip">
      <!-- 活动结束 -->
      <template v-if="status==0">
        <p class="champion" v-if="tip[0]">恭喜{{tip[3].name}}</p>
        <p class="champion">获得冠军</p>
        <!-- <p class="champion">被选为********</p> -->   
        <p class="end-tip">{{tip[2]}}</p>
      </template>
      <!-- 活动进行中 -->
      <template v-else>
        <div class="tip-text">
          <text class="text" v-if="tip">{{tip[0]}}</text>
        </div>
        <div class="tip-time" v-if="status != 2">
          <text class="time-tip">倒计时</text>
          <text class="time" :class="{timeEnd: timeEnd}">{{hasTime.day}}</text>
          <text class="word">天</text>
          <text class="time" :class="{timeEnd: timeEnd}">{{hasTime.hour}}</text>
          <text class="word">小时</text>
          <text class="time" :class="{timeEnd: timeEnd}">{{hasTime.minute}}</text>
          <text class="word">分钟</text>
          <text class="time" :class="{timeEnd: timeEnd}">{{hasTime.second}}</text>
          <text class="word">秒</text>
        </div>
        <div class="tip-text2">
          <text class="text">{{tip[1]}}</text>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    props: {
      tip: {
        type: Array,
        default: () => []
      },
      hasTime: {
        type: Object,
        default: () => {}
      },
      status: {
        type: String,
        default: ''
      }
    },
    watch: {
      status() {
        
      },
      tip() {
        deep: true
      }
    },
    methods: {

    }
  }
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .top-wrap {
    position: relative;
    .top-tip {
      position: relative;
      margin-top: 16px;
      padding: 0 15px 30px;
      border-bottom: 10px solid #f5f5f5;
      box-sizing: border-box;
    }
    .champion{
      position: relative;
      font-size: 31px;
      color: #e02e24;
      line-height: 45px;
      text-align: center;
    }
    .end-tip {
      margin: 25px auto 0;
      font-size: @fontsize-llarge;
      color: #8b2a2a;
      line-height: 20px;
      text-align: center;
    }
    .tip-text {
      margin-bottom: 20px;
      text-align: justify;
    }
    .tip-text2 {
      margin-top: 20px;
      text-align: justify;
      .text {
        line-height: 30px;
      }
    }
    .text {
      font-size: 20px;
      color: #8b2a2a;
      line-height: 35px;
    }
    .redtext {
      display: inline-block;
      margin-left: -5px;
      color: @color-redtext;
    }
    .twoday-wrap {
      position: relative;
      text-align: center;
      font-size: @fontsize-small;
      line-height: 14px;
      text-align: center;
      .day {
        margin-top: 10px;
        color: @color-text;
        .flowers {
          color: @color-redtext;
        }
      }
    }
    
    .tip-time {
      font-size: 0;
      text-align: center;
    }
    .time-tip {
      margin-right: 10px;
      font-size: 16px;
      color: @color-text;
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
      line-height:22px;
      font-size: @fontsize-small;
      color: @color-white;
      background: @color-redtext;
      border-radius: 4px;
    }
    .timeEnd {
      background: #999;
    }
    .active {
      background-color: @color-redtext;
    }
    .word {
      font-size: @fontsize-small;
      color: @color-text;
      line-height: 14px;
    }
  }
</style>
