import NetworkHandler from './NetworkHandler'

const NetworkConfigs = {}
NetworkConfigs.install = function (Vue, {defaultData} = {}) {

  Vue.prototype.$http = Vue.$http = new NetworkHandler(defaultData)
}

export default NetworkConfigs
