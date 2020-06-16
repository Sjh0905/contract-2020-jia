const root = {}
root.name = 'mobileFollowTrade'
/*------------------------------ 组件 ------------------------------*/
root.components = {
 'Loading': resolve => require(['../../vue/Loading'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading:true,
    listGod:[]
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {

  this.getBigBrotherList()

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
// 跳转我的跟单
root.methods.goToDocumentary = function (userId,fee) {
  // this.$router.push({name:'mobileDocumentary',params: {item:item}})
  this.$router.push({name:'mobileDocumentaryGod',query:{userId:userId,fee:fee}})
}
// 去大神页面
root.methods.goToDocumentaryGod = function () {
  this.$router.push({name: 'mobileDocumentaryGod'})
}
// 返回我的跟单，正在跟随
root.methods.goToMobileMyFollowOrder = function () {
  this.$router.push({name:'mobileMyFollowOrder'})
}


// 大佬列表
root.methods.getBigBrotherList = function () {
  this.$http.send('BIG_BROTHER_LIST', {
    bind: this,
    // query:{},
    callBack: this.re_getBigBrotherList,
    errorHandler:this.error_getBigBrotherList
  })
}
root.methods.re_getBigBrotherList = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data)return
  this.loading = false
  this.listGod = data.dataMap.list


}
root.methods.error_getBigBrotherList = function (err) {
  console.log('err=====',err)
}

export default root
