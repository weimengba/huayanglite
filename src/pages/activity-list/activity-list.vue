<template>
  <div class="container" v-if="list.length>0">
		<div class="activity-item" v-for="(item,index) in list" @click="activityList(item.id)" :key="index">
			<image class="item-img" :src="item.banner"></image>
  	  <image class="item-tip" v-if="item.status==0" :src="activityEnd"></image>
  	  <image class="item-tip" v-else-if="item.status==1" :src="activityIng"></image>
  	  <image class="item-tip" v-else :src="noActivity"></image>
  	  <p class="item-time">活动时间：{{item.time}} - {{item.duetime}}</p>
  	</div>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapActions} from 'vuex'
  export default {
		data() {
			return {
				list: '',
				noActivity: this.imgUrl + 'no_start@2x.png',
        activityEnd: this.imgUrl + 'activity_end.png',
				activityIng: this.imgUrl + 'activity_ing.png',
				surpriseEnd: this.imgUrl + 'surprise1_list@3x.png'
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.getListInfo()
		},
		computed: {
    ...mapGetters([
      'auth',
      'uid',
			'auid',
			'toList'
    ])
  },
    methods: {
			activityList(ooid) {
				let oid = ooid*1
				if(oid === 1) {//花朵排行一期
					wx.navigateTo({
						url: `/pages/flower-rank2/main?activityNum=1`
					})
				}else if(oid === 2) {//洋葱视频形象大使
					wx.navigateTo({
						url: `/pages/videoDS/main?activityNum=2`
					})
				}else if(oid === 3) {//花朵排行二期
					wx.navigateTo({
						url: `/pages/flower-rank2/main?activityNum=3`
					})
				}else if(oid === 4) {//达人争霸赛一期
					wx.navigateTo({
						url: `/pages/dance-talent/main?activityNum=4`
					})
				}else if(oid === 5) {//花朵排行三期（进行中）
					wx.navigateTo({
						url: `/pages/flower-rank3/main?activityNum=5`
					})
				}else if(oid === 6) {//达人争霸赛二期
					wx.navigateTo({
						url: `/pages/dance-talent/main?activityNum=6`
					})
				}else if(oid === 7) {//明星达人赛
					wx.navigateTo({
						url: `/pages/star-talent/main?`
					})
				}else if(oid === 8) { //最美舞队评选
					wx.navigateTo({
						url: `/pages/dance-talentN/main`
					})
				}else if(oid === 9) {
					wx.navigateTo({
						url: '/pages/fr-month/main?activityNum=9'
					})
				} else if(oid === 10) {
					wx.navigateTo({
						url: `/pages/dance-talent2/main?activityNum=10`
					})
				}else if(oid === 11) {  //该活动已经取消
					wx.navigateTo({
						url: `/pages/detail/main?id=917`
					})
				} else{
					console.log("报错！");
				}
			},
      getListInfo() {
				wx.showLoading({
          title: '加载中...',
          mask: true
				})
				let param = this.toList ? 1 : ''
        this.$fly.get(`index.php?m=minpackage&c=index&a=activity_lists`, {
					auth: this.auth,
					delete: param
				}).then(res => {
					wx.hideLoading()
          if(res.result == 1) {
            this.list = res.data
					}
					this.setToList(false)
        })
			},
			...mapActions([
				'setToList'
			])
    }
	}
</script>

<style lang="less" scoped>
  @import '~common/less/mixin.less';
  @import '~common/less/variable.less';
  .container {
  	@container();
  	padding: 30px 20px;
  	box-sizing: border-box;
  	.activity-item {
      position: relative;
      margin-bottom: 30px;
  	  width: 100%;
      height: 150px;
      box-shadow:0 2px 4px 0 rgba(156,72,72,0.50);
      border-radius:8px;
  	  box-sizing: border-box;
  	  .item-img {
  	  	position: relative;
  	  	width: 100%;
  	  	height: 100%;
			}
  	  .item-tip {
  	  	position: absolute;
  	  	right: -10px;
        top: -10px;
        width: 64px;
        height: 30px;
  	  }
  	  .item-time {
  	  	position: absolute;
        bottom: 0;
        width: 100%;
  	  	line-height: 30px;
        font-size:14px;
        color:#fff;
				text-shadow:0 2px 4px rgba(87,13,13,0.50);
				background: rgba(0,0,0,0.2);
				text-align:center;
				border-radius: 0 0 8px 8px;
  	  }
  	}
  }
</style>