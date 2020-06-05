const root = {}
root.name = 'HeatList'
/*------------------------------ 组件 ------------------------------*/
root.components = {
 'Loading': resolve => require(['../vue/Loading'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    heatList:[]
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getHeatList()
  console.info('this.getHeatList',)
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 获取userId
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

root.methods.getHeatList = function () {
  this.$http.send('GET_HEAT_LIST', {
    bind: this,
    urlFragment: this.userId,
    // query:{
    //   gname: this.gname
    // },
    callBack: this.re_getHeatList,
    errorHandler: this.error_getHeatList
  })
}

root.methods.re_getHeatList = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  console.info('data======sssss',)
  this.heatList = data.data
  console.info('data======sssss',this.heatList)
}

root.methods.error_getHeatList = function (err) {
  console.log('获取账户信息出错！', err)
}


// 保留小数点后8位
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
export default root
