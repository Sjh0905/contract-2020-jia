const root = {}
root.name = 'lockingRecord'

/*-------------------------- components begin ------------------------------*/

root.components = {
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}

/*-------------------------- data begin ------------------------------*/

root.data = function () {
  return {
    TT:0,
    KK:0,
    totalReward:0,
    lastDateReward:0
  }
}

/*-------------------------- 计算 begin------------------------------*/
root.computed = {}

/*-------------------------- 生命周期 begin------------------------------*/


root.created = function () {
  this.getTotalLock()
  this.$eventBus.listen(this, 'UN_LOCK', this.getTotalLock);
}

/*-------------------------- 方法 begin------------------------------*/
root.methods = {}
// 获取锁仓总金额
root.methods.getTotalLock = function () {
  this.$http.send('TOTAL_LOCK_REWARD', {
    bind: this,
    callBack: this.re_getTotalLock,
    errorHandler: this.error_getTotalLock
  })
}
// 获取锁仓总金额回调
root.methods.re_getTotalLock = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  // if (!data) return
  this.TT = data.dataMap.TT
  this.KK = data.dataMap.KK
  this.totalReward = data.dataMap.totalReward
  this.lastDateReward = data.dataMap.lastDateReward

}
// 获取锁仓总金额出错
root.methods.error_getTotalLock = function (err) {
  console.log(err)
}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/


export default root

