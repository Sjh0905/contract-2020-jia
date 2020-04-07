const root = {}
root.name = 'AssembleARegiment'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    isApp:false,
    isIOS:false
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.isAppQuery()
  this.isIOSQuery()
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

root.methods.createJoin = function () {

  this.$router.push({name: 'createAGroup'})
}
root.methods.joinAGroup = function () {

  this.$router.push({name: 'joinAGroup'})
}
// 判断路由是否为app
root.methods.isAppQuery = function (query) {
  if(this.$route.query.isApp) {
    this.isApp = true
  } else {
    this.isApp = false
  }
}

// 判断是否是ios打开
root.methods.isIOSQuery = function () {
  if(this.$route.query.isIOS) {
    this.isIOS = true
  } else {
    this.isIOS = false
  }
}

export default root
