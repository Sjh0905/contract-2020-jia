const root = {}
root.name = 'orderPosition'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve), // loading
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading:false,
    records:[],
    recordsIndex:0,
    tradinghallLimit: 10,
    parity:0
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getPositionRisk()
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 用户id，判断是否登录
root.computed.userId = function () {
  return this.$store.state.authState.userId
}

root.computed.serverTime = function () {
  return new Date().getTime();
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

/*---------------------- 开仓价格 begin ---------------------*/
root.methods.closePositionBox= function (name) {
  $("." + name).attr("style","display:none");
}
root.methods.openPositionBox = function (name) {
  $("." + name).attr("style","display:block");
}
/*---------------------- 开仓价格 end ---------------------*/


// 仓位
root.methods.getPositionRisk = function () {

  this.$http.send("GET_POSITION_RISKV", {
    bind: this,
    query: {
      timestamp: this.serverTime
    },
    callBack: this.re_getPositionRisk,
    errorHandler: this.error_getPositionRisk
  })
}
// 获取记录返回，类型为{}
root.methods.re_getPositionRisk = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data || !data.data || data.data.length == []) return
  this.records = data.data
  this.records.length = this.recordsIndex + 1
  // console.info('this.records======仓位',this.records)

}
// 获取记录出错
root.methods.error_getPositionRisk = function (err) {
  console.warn("充值获取记录出错！", err)
}
/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

export default root
