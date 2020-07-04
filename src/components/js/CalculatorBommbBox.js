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
      25: '25X',
      50: '50X',
      75:'75X',
      100:'100X',
      125:'125X',
    },


    openingPrice:'', // 收益开仓价格
    closingPrice:'', // 收益平仓价格
    transactionQuantity:'', // 收益成交数量
    securityDeposit:'', // 起始保证金
    income: '', // 收益

    targetCalculatorValue: 1,
    targetCalculatorMarks:{
      1: '1X',
      25: '25X',
      50: '50X',
      75:'75X',
      100:'100X',
      125:'125X',
    },
    targetOpeningPrice :'', // 目标价格开仓价格
    returnRate :'', // 回报率
    targetPrice:'' // 目标价格
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {

}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 判断收益输入框是否为空
root.computed.isStyle = function () {
  if(this.closingPrice == '' || this.openingPrice == '' || this.transactionQuantity == '') return true
  if(this.closingPrice == 0 || this.openingPrice == 0 || this.transactionQuantity == 0) return true
  return false
}
// 判断目标价格输入框是否为空
root.computed.isTargePrice = function () {
  if(this.targetOpeningPrice == '' || this.returnRate == '') return true
  if(this.targetOpeningPrice == 0 || this.returnRate == 0) return true
  return false
}
// // 收益
// root.computed.income = function () {
// }
// // 回报率
// root.computed.securityDeposit = function () {
// }

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
// // 判断计算按钮样式
// root.methods.isStyle = function () {
//   if(this.openingPrice==0 || this.openingPrice==0 || this.transactionQuantity==0) return false
//   if(this.openingPrice=='' || this.openingPrice=='' || this.transactionQuantity=='') return false
//   return true
// }
// 计算收益
root.methods.clickCalculation = function (){
  if(this.closingPrice == '' || this.openingPrice == '' || this.transactionQuantity == '') return
  if(this.moreEmptyType == 1){
    // 收益计算
    this.income = (Number(this.closingPrice) - Number(this.openingPrice)) * Number(this.transactionQuantity)
  }else{
    this.income = (Number(this.openingPrice) - Number(this.closingPrice)) * Number(this.transactionQuantity)
  }
  // 起始保证金计算
  this.securityDeposit = Number(this.openingPrice) * Number(this.transactionQuantity) / Number(this.calculatorValue)
  // 回报率计算
  this.returnRate = this.income / this.securityDeposit * 10 * 10 +'%'
}

root.methods.calculateTargePrice = function () {

  if(this.targetOpeningPrice == '' || this.returnRate == '') {
    this.targetPrice = '--'
    return
  }
  let targetOpeningPrice = Number(this.targetOpeningPrice) || 0
  let returnRate = Number(this.returnRate) || 0
  let targetCalculatorValue = Number(this.targetCalculatorValue) || 0
  let num = 10 * 10
  if(this.moreEmptyType == 1){
    this.targetPrice = targetOpeningPrice + (targetOpeningPrice * returnRate / targetCalculatorValue / num)
    return
  }
  this.targetPrice = targetOpeningPrice - (targetOpeningPrice * returnRate / targetCalculatorValue / num)
}

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
