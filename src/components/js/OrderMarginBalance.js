const root = {}
root.name = 'OrderMarginBalance'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading:false,
    historicaList:[],
    tradinghallLimit: 10
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {}
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
  return this.$store.state.authMessage.userId
}
root.computed.historicalTransaction = function () {
  return this.historicaList = [
    {
      id: 'BTC_USDT',
      createdAt:12031238291,
      type:'BUY_LIMIT',
      filledAmount:80,
      amount:100
    }
  ]
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

// 要跳划转页面
root.methods.goToTransfer = function () {
  this.$router.push({name:''})
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
