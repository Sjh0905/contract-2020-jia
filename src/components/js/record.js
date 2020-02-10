const root = {}
root.name = 'record'
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
// 语言 CH中文
root.computed.lang = function () {
  return this.$store.state.lang
}

/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
export default root
