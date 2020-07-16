const root = {}
root.name = 'HistoricalTransaction'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading:true,
    historicaList:[],
    tradinghallLimit: 10
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getHistorTrans()
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
root.computed.historicalTransaction = function () {
  return this.historicaList
}
root.computed.serverTime = function () {
  return new Date().getTime();
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
// 历史成交
root.methods.getHistorTrans = function () {
  this.$http.send('GET_CAPITAL_DEAL',{
    bind: this,
    query:{
      symbol:'BTCUSDT',
      timestamp:this.serverTime
    },
    callBack: this.re_getHistorTrans,
    errorHandler:this.error_getHistorTrans
  })
}
// 历史成交正确回调
root.methods.re_getHistorTrans = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data && !data.data)return
  this.loading = false
  console.info('data====',data.data)
  this.historicaList = data.data


}
// 历史成交错误回调
root.methods.error_getHistorTrans = function (err) {
  console.log('获取币安24小时价格变动接口',err)
}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/
export default root
