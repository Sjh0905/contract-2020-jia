const root = {}
root.name = 'orderPosition'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading:false,
    historicaList:[],
    tradinghallLimit: 10,
    parity:0
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
      id: '现在是仓位',
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

/*---------------------- 开仓价格 begin ---------------------*/
root.methods.closePositionBox= function () {
  $(".open-position-box").attr("style","display:none");
}
root.methods.openPositionBox = function () {
  $(".open-position-box").attr("style","display:block");
}
/*---------------------- 开仓价格 end ---------------------*/
/*---------------------- 标记价格 begin ---------------------*/
root.methods.closeMarkedPriceBox= function () {
  $(".open-marked-price-box").attr("style","display:none");
}
root.methods.openMarkedPriceBox = function () {
  $(".open-marked-price-box").attr("style","display:block");
}
/*---------------------- 标记价格 end ---------------------*/
/*---------------------- 强平价格 begin ---------------------*/
root.methods.closeFlatPriceBox= function () {
  $(".open-flat-price-box").attr("style","display:none");
}
root.methods.openFlatPriceBox = function () {
  $(".open-flat-price-box").attr("style","display:block");
}
/*---------------------- 强平价格 end ---------------------*/
/*---------------------- 保证金比率 begin ---------------------*/
root.methods.closePriceBox= function () {
  $(".open-price-box").attr("style","display:none");
}
root.methods.openPriceBox = function () {
  $(".open-price-box").attr("style","display:block");
}
/*---------------------- 保证金比率 end ---------------------*/
/*---------------------- 保证金 begin ---------------------*/
root.methods.closeSecurityepositBox= function () {
  $(".open-security-deposit-box").attr("style","display:none");
}
root.methods.openSecurityepositBox = function () {
  $(".open-security-deposit-box").attr("style","display:block");
}
/*---------------------- 保证金 end ---------------------*/
/*---------------------- 回报率 begin ---------------------*/
root.methods.closeReturRateBox= function () {
  $(".open-return-rate-box").attr("style","display:none");
}
root.methods.openReturRateBox = function () {
  $(".open-return-rate-box").attr("style","display:block");
}
/*---------------------- 回报率 end ---------------------*/
/*---------------------- 自动减仓 begin ---------------------*/
root.methods.closeEducePositionsBox= function () {
  $(".open-educe-positions-box").attr("style","display:none");
}
root.methods.openEducePositionsBox = function () {
  $(".open-educe-positions-box").attr("style","display:block");
}
/*---------------------- 自动减仓 end ---------------------*/
/*---------------------- 平仓 begin ---------------------*/
root.methods.closeLiquidationBox= function () {
  $(".open-liquidation-box").attr("style","display:none");
}
root.methods.openLiquidationBox = function () {
  $(".open-liquidation-box").attr("style","display:block");
}
/*---------------------- 平仓 end ---------------------*/

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

export default root
