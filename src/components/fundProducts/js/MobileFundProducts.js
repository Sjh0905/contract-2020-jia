const root = {}
root.name = 'mobileFundProducts'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    recordType: 0,// 0是拔头筹 1是群雄起 2是步步高 3是天下同
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {}
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

// 检验是否是ios
root.computed.iosQuery = function () {
  return this.$route.query.isIOS
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

// 点击切换页签
root.methods.changeTag = function (n) {
  if (parseInt(n) === this.recordType) return
  this.recordType = parseInt(n)
}
root.methods.goToPurchase = function() {
  this.$router.push({'path':'/index/mobileFundBuy'})
}

// 产品列表get
root.methods.getProductList = function () {
  this.$http.send('MARKET_PRICES', {
    bind: this,
    callBack: this.re_getProductList,
    errorHandler: this.error_getProductList
  })
}
// 产品列表get返回
root.methods.re_getProductList = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
}
// 产品列表get出错
root.methods.error_getProductList = function (err) {
  // console.warn('获取err出错', err)
}



export default root
