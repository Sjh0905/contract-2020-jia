// const root = {}
// root.name = 'MobileTransferSuccess'
// /*------------------------------ 组件 ------------------------------*/
// //root.components = {
// //  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
// //}
// /*------------------------------ data -------------------------------*/
// root.data = function () {
//   return {}
// }
// /*------------------------------ 生命周期 -------------------------------*/
// root.created = function () {}
// root.mounted = function () {}
// root.beforeDestroy = function () {}
// /*------------------------------ 计算 -------------------------------*/
// root.computed = {}
// /*------------------------------ 观察 -------------------------------*/
// root.watch = {}
// /*------------------------------ 方法 -------------------------------*/
// root.methods = {}
// export default root


const root = {}
root.name = 'MobileTransferSuccess'

/*---------------------- 组件 -----------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}





root.created = function () {

}

root.data = function () {
  return {

  }
}

/*---------------------- 方法 ---------------------*/
root.methods ={}

// 接收回调成功的数据

// 查看转账记录
root.methods.TransferRecords = function(){
  let routerParams = this.$route.params.data
  console.log(routerParams)
  this.$router.push({name:'MobileTransferRecords',params:{data:routerParams}})
}

// 继续转账
root.methods.confirmTransferRecords = function(){
  this.$router.push('mobileAssetRechargeAndWithdrawals')
}

export default root
