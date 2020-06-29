const root = {}
root.name = 'PositionModeBulletBox'
// 此组件需要一个 v-on:close
/*---------------------- 属性 ---------------------*/
root.props = {}

root.props.switch = {
  type: Boolean,
  default: false
}
root.props.close = {
  type: Function
}

root.props.pop_width = {
  type: Boolean,
  default: false
}

root.props.closeBtnShow = {
  type: Boolean,
  default: true
}

root.props.footerBorderTop = {
  type: Boolean,
  default: false
}

/*---------------------- data ---------------------*/

root.data = function () {
  return {}
}
root.computed = {}
root.computed.show = function () {
  return this.switch
}
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}

/*---------------------- 方法 ---------------------*/

root.methods = {}

root.methods.closeClick = function () {
  this.$emit('close')
}


export default root
