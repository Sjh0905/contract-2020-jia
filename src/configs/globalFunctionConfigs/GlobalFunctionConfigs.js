import GlobalFunction from './GlobalFunction'

const GlobalFuncPlugin = {}

GlobalFuncPlugin.install = function (Vue, option) {
  Vue.prototype.$globalFunc = GlobalFunction
}

export default GlobalFuncPlugin
