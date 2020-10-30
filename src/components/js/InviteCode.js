const root = {}
root.name = 'inviteCode'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading:true,
    inviteCode:[],
    tradinghallLimit: 10
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getInviteCode()
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}

// 用户id，判断是否登录
root.computed.userId = function () {
  return this.$store.state.authState.userId
}
root.computed.computedInviteCode = function () {
  return this.inviteCode
}
root.computed.serverTime = function () {
  return new Date().getTime();
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

// 资金流水
root.methods.getInviteCode = function () {
  this.$http.send('GET_INVITE_LEST',{
    bind: this,
    query:{},
    callBack: this.re_getInviteCode,
    errorHandler:this.error_getInviteCode
  })
}
// 资金流水正确回调
root.methods.re_getInviteCode = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data && !data.data)return
  this.loading = false
  // console.info('data====',data.data)
  this.inviteCode = data.data || []
}
// 资金流水错误回调
root.methods.error_getInviteCode = function (err) {
  console.log('获取币安24小时价格变动接口',err)
}
/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/
export default root
