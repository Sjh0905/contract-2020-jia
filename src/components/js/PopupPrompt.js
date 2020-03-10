const root = {}
root.name = 'PopupPrompt'
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}
root.data = function () {
  return {
    timeOut: null,
  }
}

root.props = {}
root.props.popOpen = {
  type: Boolean,
  default: true
}

// 成功文案修改
root.props.popText = {
  type: String,
  default: root.props.popType == 1 ? '修改成功' : '修改失败'
}

// 成功文案修改
root.props.popText2 = {
  type: String,
  default: ''
}

// 0是失败，1是成功，2是等待
root.props.popType = {
  type: Number,
  default: 0
}
// 关闭弹窗
root.props.popClose = {
  type: Function,
  required: true
}

// 停留时间
root.props.waitTime = {
  type: [String, Number],
  default: 1500,
}

root.watch = {}
root.watch.popOpen = function (newVal, oldVal) {
  // console.warn("hi!!", newVal, oldVal,this.popType)
  if (!newVal || (this.popType !== 0 && this.popType !== 1 && this.popType !== 3)) return
  this.timeOut && clearTimeout(this.timeOut)
  this.timeOut = setTimeout(this.popClose, this.waitTime)
}

root.computed = {}
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}


export default root
