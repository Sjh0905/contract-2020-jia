const root = {}
root.name = 'mobileFollowTrade'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../vue/Loading'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {}
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {

  if(this.$route.query.isApp) {
    window.postMessage(JSON.stringify({
        method: 'setTitle',
        parameters: '策略跟单'
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
//跳转首页
root.methods.jumpToBack = function () {
  this.$router.push({'path':'/index/newH5homePage'})
}
//跳转个人策略跟单
root.methods.goToMobileFollowTradeStrategy = function () {
  this.$router.push({'path':'/index/mobileFollowTradeStrategy'})
}
export default root
