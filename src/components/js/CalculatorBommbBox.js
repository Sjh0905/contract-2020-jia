const root = {}
root.name = 'CalculatorBommbBox'
// root.props = {}
//
// root.props.openCalculator = {
//   type: Boolean,
//   default: false
// }
// root.props.closeCalculator = {
//   type: Function,
//   default: ()=>_
// }
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

/*------------------------------ 组件 ------------------------------*/
root.components = {
 // 'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
  'PositionModeBulletBox': resolve => require(['../vue/PositionModeBulletBox'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    // 计算器
    styleType:1,
    moreEmptyType:1,
    // openCalculator:true,

    calculatorValue: 1,
    calculatorMarks:{
      1: '1X',
      15: '15X',
      30: '30X',
      45:'45X',
      60:'60X',
      75:'75X',
    },

  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
root.computed.show = function () {
  return this.switch
}
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
// 做多做空选择
root.methods.selectMoreEmptyType = function (type) {
  this.moreEmptyType = type
}
// 标题切换选择
root.methods.selectType = function (type) {
  this.styleType = type
}
// 处理滑动条显示框内容
root.methods.formatTooltip=(val)=>{
  return  val + '%';
}
// // 关闭计算器弹窗
root.methods.closeClick = function () {
  this.$emit('close')
}
export default root
