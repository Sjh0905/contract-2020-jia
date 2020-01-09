import EventBus from './EventBus'

const EventConfigs = {}
EventConfigs.install = function (Vue, option) {
  Vue.mixin({
    beforeDestroy: function () {
      let _this = this
      if (Vue.prototype.$eventBus) {
        Vue.prototype.$eventBus.unListen(_this)
      }
    }
  })
  Vue.prototype.$eventBus = Vue.$eventBus = new EventBus()
}


export default EventConfigs
