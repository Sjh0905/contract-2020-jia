import SocketHandler from './SocketHandler'

const SocketPlugin = {}

SocketPlugin.install = function (Vue, options) {

  Vue.mixin({
    beforeDestroy: function () {
      let _this = this
      if (Vue.prototype.$socket) {
        Vue.prototype.$socket.off({bind: _this})
      }
    }
  })

  Vue.prototype.$socket = Vue.$socket = new SocketHandler()

}

export default SocketPlugin
