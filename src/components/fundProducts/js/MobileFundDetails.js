const root = {}
root.name = 'mobileFundDetails'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {}
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

// 返回基金资产页面
root.methods.returnMobileFundAssets  =function () {
  this.$router.push({name:'mobileFundAssets'})
}

// 跳转本期购买
root.methods.gotoFundCurrent  =function () {
  this.$router.push({name:'mobileFundCurrent'})
}
export default root
