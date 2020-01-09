const root = {}

/*------------------- 组件名称 ---------------------*/
root.name = 'BaseToggle'

/*------------------- props ---------------------*/
root.props = {}
root.props.toggleOpen = {
  type: Boolean,
  default: false,
  required: true
}

root.props.switchFunc = {
  type: Function,
  required: true
}


/*------------------- data ---------------------*/
root.data = function () {
  return {}
}

/*------------------- 方法 ---------------------*/
root.methods = {}
root.methods.clickToggle = function (event) {
  this.switchFunc(event)
}


export default root
