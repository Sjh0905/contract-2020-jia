const root = {}
root.name = "IndexAboutUs"


root.data = function () {
  return {

  }
}


root.created = function () {

  this.$store.commit('changeJoinus', true);

}

root.computed = {}

root.computed.lang = function () {
  // 返回语言
  return this.$store.state.lang
}

root.components = {
  'IndexHeader': resolve => require(['../vue/IndexHeader'], resolve),
  'IndexFooter': resolve => require(['../vue/IndexFooter'], resolve),
}

root.methods = {}



export default root
