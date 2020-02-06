const root = {}
root.name = 'OverviewOfAssets'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve)
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading: false,

  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {}

root.mounted = function () {}

root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 当前语言
root.computed.lang = function () {
  return this.$store.state.lang;
}

/*------------------------------ 观察 -------------------------------*/
root.watch = {}

/*------------------------------ 方法 -------------------------------*/
root.methods = {}


export default root
