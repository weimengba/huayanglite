function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function newFormatTime(d) {
  let year = d.getFullYear()
  let month = d.getMonth() + 1
  let date = d.getDate()
  let hours = d.getHours()
  let minute = d.getMinutes()
  let second = d.getSeconds()
  // return `${year}-${month}-${date} ${formatNumber(hours)}:${formatNumber(minute):${formatNumber(second)}`
  return year+'-'+formatNumber(month)+'-'+formatNumber(date)+' '+formatNumber(hours)+':'+formatNumber(minute)
}


/**
  *分享获取赠送小红花机会功能
  **/
export function sharedAddFlowers(result,res) {
  if(res.flower_add==0) {
    return
  }
  //getSystemInfo是为了获取当前设备信息，判断是android还是ios，如果是android
  //还需要调用wx.getShareInfo()，只有当成功回调才是转发群，ios就只需判断shareTickets
  wx.getSystemInfo({
    success: function (d) {
      wx.showToast({
        icon: 'none',
        title: "您已分享成功,获得一朵小花",
        duration: 2000
      });
      setTimeout(() => {
        return
      }, 2000);
      
      if (d.platform == 'android' && result.hasOwnProperty('shareTickets')) {
        if(result.shareTickets.length <= 0)
          return
        wx.getShareInfo({
          shareTicket: result.shareTickets,
          success: function () {
            // wx.showToast({
            //   icon: 'none',
            //   title: "您已分享成功,获得一朵小花",
            //   duration: 2000
            // });
          },
          fail: function () {
            wx.showToast({
              title: "转发群失败",
              duration: 2000
            });
          }
        })
      }
      if (d.platform == 'ios' && result.hasOwnProperty('shareTickets')) {
        if(result.shareTickets.length <= 0)
          return
        // wx.showToast({
        //   icon: 'none',
        //   title: "您已分享成功,获得一朵小花",
        //   duration: 2000
        // });
      }
    },
    fail: function (result) {
      wx.showToast({
        title: "转发失败",
        duration: 2000
      });
    }
  })
}

export function _editUserInfo(userInfo,myType,that) {//0:送花功能，1:评论功能  1:签到功能
  this.$fly.post(`/index.php?m=minpackage&c=api&a=editUserinfo`, {
    auth: this.auth,
    gender: userInfo.gender,
    nick: userInfo.nickName,
    headface: userInfo.avatarUrl
  })
  .then(res => {
    if(res.result === 1) {
      this.setIsAuth(1)
      if(myType == 0) {
        this._sendFlower()
      }else if(myType == 1) {
        this._sendComment()
      }else{
        console.log("警告：暂无此功能！")
      }
    }
  })
}

// 分享和扫码进入页面时强制登录
export function reLogin(_this,uid) {
  wx.login({
    success:res => {
      if(res.code) {
        _this.$fly.get(`/index.php?m=minpackage&c=api&a=mpLogin&code=${res.code}&uid=${uid}`)
        .then(res => {
          // console.log(res)
          if(res.timeout == 20000) {
            wx.showToast({
              title: '请求超时，请重启小程序',
              icon: 'none',
              duration: 5000
            })
            return
          }
          if(res.result === 1) {
            console.log("都成功了"+ res.data.auth)

          }
        })
      }
    },
    fail(err) {
      console.log("失败")
      console.log(err)
    }
  })
}

export default {
  formatNumber,
  formatTime
}
