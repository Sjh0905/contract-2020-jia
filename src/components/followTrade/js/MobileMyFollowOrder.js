const root = {}
root.name = 'mobileFollowTradeStrategy'
/*------------------------------ 组件 ------------------------------*/
root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
    'PopupWindow': resolve => require(['../../vue/PopupWindow'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    followType:1,
    isAutomatic:false,
    followUserList:[],
    profit:{}, // 总金额+总收益

    delFollowOpen:false
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  // 我的跟随
  this.postMyDocumentary()

}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
// 取消跟随
root.methods.delFollow = function (){
  this.delFollowOpen = true
}
// 关闭取消跟随弹窗
root.methods.delFollowClose = function () {
  this.delFollowOpen = false
}
// 点击修改跟单
root.methods.modifyDocumentary = function () {
  this.$router.push({name:'mobileDocumentary'})
}

//我的跟单
root.methods.postMyDocumentary = function () {
  this.$http.send('POST_MY_USER', {
    bind: this,
    callBack: this.re_postMyDocumentary,
    errorHandler: this.error_postMyDocumentary
  })
}
root.methods.re_postMyDocumentary = function (data) {
  console.log("this.res=====",data)
  typeof data === 'string' && (data = JSON.parse(data))
  console.info('data',data)
  this.followUserList = data.dataMap.list || []
  this.profit = data.dataMap.profit || {}
}
root.methods.error_postMyDocumentary = function (err) {
  console.log("this.err=====",err)
}

// 取消跟随
root.methods.delFollowList = function () {
  this.$http.send('POST_DEL_FOLLOWER', {
    bind: this,
    params: {},
    callBack: this.re_delFollowList,
    errorHandler: this.error_delFollowList
  })
}
// 取消跟随
root.methods.re_delFollowList = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  this.delFollowClose()
}
// 取消跟随
root.methods.error_delFollowList = function (err) {
  console.warn('点击切换自动续费', err)
}

// 点击切换自动续费
root.methods.clickToggle = function () {
  this.isAutomatic = !this.isAutomatic
  this.$http.send('', {
    bind: this,
    params: {
    },
    callBack: this.re_clickToggle,
    errorHandler: this.error_clickToggle
  })
}
// 点击切换自动续费
root.methods.re_clickToggle = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))

}
// 点击切换自动续费失败
root.methods.error_clickToggle = function (err) {
  console.warn('点击切换自动续费', err)
}

// 切换历史跟单和跟随者
root.methods.toggleType = function (type) {
  this.followType = type
}
// 返回跟单首页
root.methods.jumpToFollowTrade = function () {
  this.$router.push({name:'mobileFollowTrade'})
}
// 个人设置
root.methods.personalSetting = function () {
  console.info('personalSetting=======个人设置',)
}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/
export default root
