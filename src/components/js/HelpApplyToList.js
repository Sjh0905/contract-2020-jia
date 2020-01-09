const root = {};

root.name = 'HelpApplyToList'

/*----------------------- data ------------------------*/
root.data = function () {
  return {}
}

/*----------------------- 计算 ------------------------*/

root.computed = {}
// 语言
root.computed.lang = function () {
  return this.$store.state.lang
}

/*----------------------- 方法 ------------------------*/

root.methods = {}


export default root;
