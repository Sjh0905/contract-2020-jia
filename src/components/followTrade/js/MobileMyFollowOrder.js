const root = {}
root.name = 'mobileFollowTradeStrategy'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {

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
