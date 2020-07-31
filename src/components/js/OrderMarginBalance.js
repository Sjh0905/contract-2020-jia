const root = {}
root.name = 'OrderMarginBalance'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve), // loading
  }
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading:true,
    capitalFlowListData:[],
    capitalFlowList:{},
    tradinghallLimit: 10,
    balance:[]
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getCapitalFlow()
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 所有币对精度信息
root.computed.quoteScale_list = function () {
  let quoteScale_obj = {};
  let quoteScale_list = this.$store.state.quoteConfig;
  quoteScale_list.forEach(v => {
    quoteScale_obj[v.name] = {quoteScale: v.quoteScale, baseScale: v.baseScale};
  })
  return quoteScale_obj;
}
// 用户id，判断是否登录
root.computed.userId = function () {
  return this.$store.state.authState.userId
}
// root.computed.historicalTransaction = function () {
//   return this.capitalFlowList
// }
root.computed.serverTime = function () {
  return new Date().getTime();
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

// 要跳划转页面
root.methods.goToTransfer = function () {
  this.$router.push({name:''})
}

// 账户余额
root.methods.getCapitalFlow = function () {
  this.$http.send('GET_BALAN__BIAN',{
    bind: this,
    query:{
      // symbol:'BTCUSDT'
      timestamp:this.serverTime
    },
    callBack: this.re_getCapitalFlow,
    errorHandler:this.error_getCapitalFlow
  })
}
// 账户余额正确回调
root.methods.re_getCapitalFlow = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data && !data.data)return
  this.loading = false
  console.info('data====',data.data)
  // this.capitalFlowListData = data.data.assets
  this.capitalFlowList = data.data
  this.balance = data.data.assets[0]


}
// 账户余额错误回调
root.methods.error_getCapitalFlow = function (err) {
  console.log('获取币安24小时价格变动接口',err)
}


/*---------------------- 账户余额 begin ---------------------*/
root.methods.closeShowDescriptBox= function (name) {
  $("." + name).attr("style","display:none");
}
root.methods.openShowDescriptBox = function (name) {
  $("." + name).attr("style","display:block");
}
/*---------------------- 账户余额 end ---------------------*/
//
// /*---------------------- 未实现盈亏 begin ---------------------*/
// root.methods.closeGainsAndLosses= function () {
//   $(".gains-and-losses").attr("style","display:none");
// }
// root.methods.openGainsAndLosses = function () {
//   $(".gains-and-losses").attr("style","display:block");
// }
// /*---------------------- 未实现盈亏 end ---------------------*/
//
// /*---------------------- 可用下单余额 begin ---------------------*/
// root.methods.closeOrderBalance= function () {
//   $(".order-balance").attr("style","display:none");
// }
// root.methods.openOrderBalance = function () {
//   $(".order-balance").attr("style","display:block");
// }
// /*---------------------- 可用下单余额 end ---------------------*/


/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/
export default root
