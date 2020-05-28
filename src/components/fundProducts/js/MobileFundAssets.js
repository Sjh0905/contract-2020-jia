const root = {}
root.name = 'MobileFundAssets'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    selectedType: 1,  // 1:申购中  2：收益中  3：已结束
  }
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

// 跳转基金详情页
root.methods.gotoDetails = function () {
  this.$router.push({name:'mobileFundDetails'})
}

// 切换产品
root.methods.getAssetStatus = function (type) {
  this.selectedType = type

}
export default root
