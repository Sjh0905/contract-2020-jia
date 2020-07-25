const root = {}
root.name = 'CapitalFlow'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading:true,
    capitalFlowList:[],
    tradinghallLimit: 10
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getCapitalFlow()
  this.bianBalance()
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
root.computed.capitalFlowComputed = function () {
  return this.capitalFlowList
}
root.computed.serverTime = function () {
  return new Date().getTime();
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

// 资金流水
root.methods.getCapitalFlow = function () {
  this.$http.send('GET_CAPITAL_FLOW',{
    bind: this,
    query:{
      // symbol:'BTCUSDT'
      timestamp:this.serverTime
    },
    callBack: this.re_getCapitalFlow,
    errorHandler:this.error_getCapitalFlow
  })
}
// 资金流水正确回调
root.methods.re_getCapitalFlow = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data && !data.data)return
  this.loading = false
  console.info('data====',data.data)
  this.capitalFlowList = data.data


}
// 资金流水错误回调
root.methods.error_getCapitalFlow = function (err) {
  console.log('获取币安24小时价格变动接口',err)
}
// 资产
root.methods.bianBalance = function (item) {
  // console.log(item.id)
  this.$http.send("GET_BALAN_ACCOUNT", {
    bind: this,
    query: {
      timestamp: this.serverTime
    },
    callBack: this.re_bianBalance,
    errorHandler: this.error_bianBalance
  })
}

root.methods.re_bianBalance = function ( data ) {
  typeof (data) === 'string' && (data = JSON.parse(data))

  // this.balance = data.data[0]
  // console.info('币安接口账户余额',this.balance)
  console.info('币安接口账户余额',data)
  this.totalWalletBalance = data.data.totalWalletBalance
  this.totalUnrealizedProfit = data.data.totalUnrealizedProfit
  this.totalMarginBalance = data.data.totalMarginBalance
}
root.methods.error_bianBalance = function ( err ) {
  console.log(err)
}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/
export default root
