const root = {}
root.name = 'mobileFollowTradeStrategy'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    followType: 1,
    godInfo:{},
    godHistorList:[],
    followUserList:[],
    isTapeList:0
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  if(this.$route.query.isApp) {
    /*window.postMessage(JSON.stringify({
        method: 'setTitle',
        parameters: this.userId
      })
    );*/
    window.postMessage(JSON.stringify({
      method: 'setH5Back',
      parameters: {
        canGoH5Back:true
      }
    }))
  }
  this.isOpenFollow()
  this.postPersonalFollowUser()
  this.postPersonalrHistory()
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 获取本人的userId
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}
// 检验是否是APP
root.computed.isApp = function () {
  return this.$route.query.isApp ? true : false
}
// 检验是否是安卓
root.computed.isAndroid = function () {
  return this.$store.state.isAndroid
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

// 切换历史跟单和跟随者
root.methods.toggleType = function (type) {
  this.followType = type
}

// 是否开启带单
root.methods.isOpenFollow = function () {
  let params = {
    followId: this.userId,
  }
  this.$http.send('POST_GOD_BY_USERID', {
    bind: this,
    params: params,
    callBack: this.re_isOpenFollow,
    errorHandler: this.error_isOpenFollow
  })
}
root.methods.re_isOpenFollow = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.info('data',data)
  this.isTapeList = data.dataMap.godInfo.followCount || 0
}
root.methods.error_isOpenFollow = function (err) {
  console.log("this.err=====",err)
}
//个人历史持仓
root.methods.postPersonalrHistory = function () {
  let params = {
    followId: this.userId,
  }
  this.$http.send('POST_BROTHER_ORDER', {
    bind: this,
    params: params,
    callBack: this.re_postPersonalrHistory,
    errorHandler: this.error_postPersonalrHistory
  })
}
root.methods.re_postPersonalrHistory = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.info('data',data)
  this.loading = false
  this.godInfo = data.dataMap.godInfo || {}
  this.godHistorList = data.dataMap.list || []
}
root.methods.error_postPersonalrHistory = function (err) {
  console.log("this.err=====",err)
}


//个人跟随者
root.methods.postPersonalFollowUser = function () {
  let params = {
    followId: this.userId ,
  }
  this.$http.send('POST_FOLLOWUSER', {
    bind: this,
    params: params,
    callBack: this.re_postPersonalFollowUser,
    errorHandler: this.error_postPersonalFollowUser
  })
}
root.methods.re_postPersonalFollowUser = function (data) {
  console.log("this.res=====",data)
  typeof data === 'string' && (data = JSON.parse(data))
  console.info('data',data)
  this.followUserList = data.dataMap.list || []
}
root.methods.error_postPersonalFollowUser = function (err) {
  console.log("this.err=====",err)
}


// 返回跟单首页
root.methods.jumpToFollowTrade = function () {
  this.$router.push({name:'mobileFollowTrade'})
}
// 个人设置
root.methods.personalSetting = function () {
  this.$router.push({name:'mobileTapeListManage'})
}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/
export default root
