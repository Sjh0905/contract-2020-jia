const root = {}
root.name = 'mobileFollowTradeStrategy'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    followType:1,
    isAutomatic:false
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
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
// 点击修改跟单
root.methods.modifyDocumentary = function () {
  this.$router.push({name:'mobileDocumentary'})
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


//我的跟单
root.methods.postMyDocumentary = function () {
  // let params = {
  //   followId: this.$route.params.item.userId ,
  // }
  this.$http.send('POST_MY_USER', {
    bind: this,
    // params: params,
    callBack: this.re_postMyDocumentary,
    errorHandler: this.error_postMyDocumentary
  })
}
root.methods.re_postMyDocumentary = function (data) {
  console.log("this.res=====",data)
  typeof data === 'string' && (data = JSON.parse(data))
  console.info('data',data)
  // this.followUserList = data.dataMap.list || []
}
root.methods.error_postMyDocumentary = function (err) {
  console.log("this.err=====",err)
}
export default root
