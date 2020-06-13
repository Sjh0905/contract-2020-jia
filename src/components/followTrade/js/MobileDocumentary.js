const root = {}
root.name = 'mobileDocumentary'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../vue/Loading'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    followType:1
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {

  if(this.$route.query.isApp) {
    window.postMessage(JSON.stringify({
        method: 'setTitle',
        parameters: '跟单'
      })
    );
    window.postMessage(JSON.stringify({
      method: 'setH5Back',
      parameters: {
        canGoH5Back:false
      }
    }))
  }
}

root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
root.computed.isLogin = function () {
  return this.$store.state.isLogin;
}

root.computed.userId = function () {
  return this.$store.state.authMessage.userId ? this.$store.state.authMessage.userId : 0
}

// 检验是否是APP
root.computed.isApp = function () {
  return this.$route.query.isApp ? true : false
}

// 检验ios是否登录
root.computed.iosLogin = function () {
  return this.$route.query.iosLogin
}

// 获取屏幕宽度
root.computed.windowWidth = function () {
  return window.innerWidth
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

//跳转个人策略跟单
root.methods.goToFollowTrade = function () {
  this.$router.push({'path':'/index/mobileFollowTrade'})
}

// 切换历史跟单和跟随者
root.methods.fixedType = function (type) {
  this.followType = type
}
export default root
