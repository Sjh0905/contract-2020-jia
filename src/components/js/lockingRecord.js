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
}


/*-------------------------- 方法 begin------------------------------*/
root.methods = {}
// 判断认证状态
root.methods.getTotalLock = function () {
  if (!this.$store.state.authState) {
    this.$http.send('TOTAL_LOCK_REWARD', {
      bind: this,
      callBack: this.re_getTotalLock,
      errorHandler: this.error_getTotalLock
    })
  }
}
// 判断验证状态回调
root.methods.re_getTotalLock = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  // if (!data) return
  console.info(data)
  this.TT = data.dataMap.TT
  this.KK = data.dataMap.KK
  this.totalReward = data.dataMap.totalReward
  this.lastDateReward = data.dataMap.lastDateReward

}
// 判断验证状态出错
root.methods.error_getTotalLock = function (err) {
  console.log(err)
}


export default root

