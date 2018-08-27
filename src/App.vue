<script>
import {mapGetters,mapActions} from 'vuex'
export default {
  onLaunch(options) {
    // console.log("launch:  "+JSON.stringify(decodeURIComponent(this.$mp.appOptions.query.scene)))
    // console.log("option: "+JSON.stringify(decodeURIComponent(options.query.scene)))
    
    let codeAuid = decodeURIComponent(options.query.scene).split('##')[1]
    wx.showLoading({
      title: '登录中...',
      mask: true
    })
    this.uid = codeAuid ? codeAuid : this.$mp.appOptions.query.auid ? this.$mp.appOptions.query.auid : ''
    this.login()
  },
  watch: {
    ...mapGetters([
      'firstIn',
      'auid',
      'uid',
      'codeuid'
    ])
  },
  methods: {
    login() {
      const _this = this
      wx.login({
        success:res => {
          if(res.code) {
            _this._login(res.code, _this.uid)
          }
        },
        fail(err) {
          console.log(err)
        }
      })
    },
    _login(code, uid = '') {
      this.$fly.get(`/index.php?m=minpackage&c=api&a=mpLogin&code=${code}&uid=${uid}`)
      .then(res => {
        if(res.timeout == 20000) {
          wx.showToast({
            title: '请求超时，请重启小程序',
            icon: 'none',
            duration: 5000
          })
          return
        }
        if(res.result === 1) {
          this.setAuth(res.data.auth)
          // this.setIsAuth(res.data.isauth)
          this.setUid(res.data.uid)
          this.setActivity(res.data.activity)
          this.setSigned(res.data.signed)
          this.setSignDay(res.data.signed_day)
          this.setFlowersAll(res.data.flower_all)
          this.setFlowersToday(res.data.flower_day)
          this.setAuid(res.data.a_uid)
          this.setFirstIn(res.data.is_show_hint)
        }
      })
    },
    ...mapActions([
      'setAuth',
      // 'setIsAuth',
      'setUid',
      'setActivity',
      'setSigned',
      'setSignDay',
      'setFlowersAll',
      'setFlowersToday',
      'setAuid',
      'setFirstIn',
      // 'setCodeAuid'
    ])
  }
}
</script>

<style>
  page {
    height: 100%;
  }
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
    display: none;
  }
  button::after{
    border: none;
  }
  .container {
    height: 100%;
  }
</style>
