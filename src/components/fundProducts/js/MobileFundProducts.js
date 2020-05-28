const root = {}
root.name = 'mobileFundProducts'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    recordType: 0,// 0是拔头筹 1是群雄起 2是步步高 3是天下同
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

// 点击切换页签
root.methods.changeTag = function (n) {
  if (parseInt(n) === this.recordType) return
  this.recordType = parseInt(n)
}
root.methods.goToPurchase = function() {
  this.$router.push({'path':'/index/mobileFundBuy'})
}

export default root
