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
    calculatorValue: 1, // 收益杠杠倍数
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
    returnRate :'', // 回报率

    // targetCalculatorValue: 1,  //目标价格杠杆倍数
    targetCalculatorMarks:{
      1: '1X',
      25: '25X',
      50: '50X',
      75:'75X',
      100:'100X',
      125:'125X',
    },
    targetOpeningPrice :'', // 目标价格开仓价格
    targetPrice:'', // 目标价格
    targetReturnRate:'', // 目标价格回报率

    // maximumPosition:''  // 显示的最大头寸

    maximumPosition:['50,000','250,000','100,0000','5,000,000','20,000,000','50,000,000','100,000,000','200,000,000']
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
  if(this.targetOpeningPrice == '' || this.targetReturnRate == '') return true
  if(this.targetOpeningPrice == 0 || this.targetReturnRate == 0) return true
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

// 最大头寸计算
root.computed.maxPosition = function () {
  let maxPosition = ''
  if(this.calculatorValue > 100 && this.calculatorValue <= 125) {
    maxPosition = this.maximumPosition[0]
    return maxPosition
  }
  if(this.calculatorValue > 50 && this.calculatorValue <= 100) {
    maxPosition = this.maximumPosition[1]
    return maxPosition
  }
  if(this.calculatorValue > 20 && this.calculatorValue <= 50) {
    maxPosition = this.maximumPosition[2]
    return maxPosition
  }
  if(this.calculatorValue > 10 && this.calculatorValue <= 20) {
    maxPosition = this.maximumPosition[3]
    return maxPosition
  }
  if(this.calculatorValue > 5 && this.calculatorValue <= 10) {
    maxPosition = this.maximumPosition[4]
    return maxPosition
  }
  if(this.calculatorValue = 5) {
    maxPosition = this.maximumPosition[5]
    return maxPosition
  }
  if(this.calculatorValue = 4) {
    maxPosition = this.maximumPosition[6]
    return maxPosition
  }
  if(this.calculatorValue =3) {
    maxPosition = this.maximumPosition[7]
    return maxPosition
  }
  maxPosition = ''
  return maxPosition
}

/*------------------------------ 观察 -------------------------------*/
root.watch = {}
root.watch.styleType = function (oldVal,newVal) {
  if(oldVal == newVal) return
  this.calculatorValue = 1
  this.openingPrice = ''
  this.closingPrice=''
  this.transactionQuantity = ''
  this.targetOpeningPrice = ''
  this.targetPrice = ''
  this.returnRate = ''
  this.targetReturnRate = ''
}
root.watch.moreEmptyType = function (oldVal,newVal) {
  if(oldVal == newVal) return
  this.calculatorValue = 1
  this.openingPrice = ''
  this.closingPrice=''
  this.transactionQuantity = ''
  this.targetOpeningPrice = ''
  this.targetPrice = ''
  this.returnRate = ''
  this.targetReturnRate = ''
}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
/*---------------------- hover弹框 begin ---------------------*/
root.methods.closePositionBox= function (name) {
  $("." + name).attr("style","display:none");
}
root.methods.openPositionBox = function (name) {
  $("." + name).attr("style","display:block");
}
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
    this.income = this.toFixed(this.accMul((this.accMinus(Number(this.closingPrice) , Number(this.openingPrice))),Number(this.transactionQuantity)),2)
  }else{
    this.income = this.toFixed(this.accMul((this.accMinus(Number(this.openingPrice),Number(this.closingPrice))),Number(this.transactionQuantity)),2)
  }
  // 起始保证金计算
  this.securityDeposit = this.toFixed(this.accDiv(this.accMul(Number(this.openingPrice), Number(this.transactionQuantity)),Number(this.calculatorValue)),2)
  // 回报率计算
  this.returnRate = this.toFixed( this.accDiv(this.income,(this.securityDeposit * 10 * 10)),2)
}

// 目标价格计算
root.methods.calculateTargePrice = function () {
  if(this.targetOpeningPrice == '' || this.targetReturnRate == '') {
    this.targetPrice = '--'
    return
  }
  // 目标价格开仓价格
  let targetOpeningPrice = Number(this.targetOpeningPrice) || 0
  // 目标价格回报率
  let returnRate = Number(this.targetReturnRate) || 0
  let targetCalculatorValue = Number(this.calculatorValue) || 0
  let num = 10 * 10
  if(this.moreEmptyType == 1){
    this.targetPrice = this.toFixed(this.accAdd(targetOpeningPrice,(this.accDiv(this.accDiv(this.accMul(targetOpeningPrice,returnRate),targetCalculatorValue),num))),2)
    return
  }
  this.targetPrice = this.toFixed(this.accMinus(targetOpeningPrice,(this.accDiv(this.accDiv(this.accMul(targetOpeningPrice,returnRate),targetCalculatorValue),num))),2)
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
  console.info(val)
  return  val + 'X';
}
// // 关闭计算器弹窗
root.methods.closeClick = function () {
  this.$emit('close')
  this.calculatorValue = 1
  this.openingPrice = ''
  this.closingPrice=''
  this.transactionQuantity = ''
  this.targetOpeningPrice = ''
  this.targetPrice = ''
  this.returnRate = ''
  this.targetReturnRate = ''
}
/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/
/*---------------------- 加法运算 begin ---------------------*/
root.methods.accAdd = function (num1, num2) {
  return this.$globalFunc.accAdd(num1, num2)
}
/*---------------------- 加法运算 end ---------------------*/

/*---------------------- 减法运算 begin ---------------------*/
root.methods.accMinus = function (num1, num2) {
  return this.$globalFunc.accMinus(num1, num2)
}
/*---------------------- 减法运算 end ---------------------*/

/*---------------------- 乘法运算 begin ---------------------*/
root.methods.accMul = function (num1, num2) {
  return this.$globalFunc.accMul(num1, num2)
}
/*---------------------- 乘法运算 end ---------------------*/

/*---------------------- 除法运算 begin ---------------------*/
root.methods.accDiv = function (num1, num2) {
  return this.$globalFunc.accDiv(num1, num2)
}
/*---------------------- 除法运算 end ---------------------*/



export default root
