const root = {}
root.name = 'mobileCalculator'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    styleType:1,
    moreEmptyType:1,

    // 滑块变量
    calculatorValue: 1, // 收益杠杠倍数
    calculatorMarks:{
      ETHUSDT:{
        1: '1X',
        20: '20X',
        40: '40X',
        60: '60X',
        80: '80X',
        100:'100X',
      },
      BTCUSDT:{
        1: '1X',
        25: '25X',
        50: '50X',
        75:'75X',
        100:'100X',
        125:'125X',
      }
    },
    calculatorClass:['radiusa_green','radiusb_green','radiusc_green','radiusd_green','radiuse_green'],

    // maximumPosition:['50,000','250,000','100,0000','5,000,000','20,000,000','50,000,000','100,000,000','200,000,000','9,223,372,036,854,776,000'],


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



  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  if(this.$route.query.isApp) {
    window.postMessage(JSON.stringify({
      method: 'setH5Back',
      parameters: {
        canGoH5Back:false
      }
    }))
  }
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
root.computed.sNameMap = function () {{}
  let defaultSNameMap = {"BTCUSDT":"BTC_USDT","ETHUSDT":"ETH_USDT"}
  return this.$store.state.sNameMap || defaultSNameMap
}
// 判断收益输入框是否为空
root.computed.isStyle = function () {
  if(this.closingPrice == '' || this.openingPrice == '' || this.transactionQuantity == '') return true
  if(this.closingPrice == 0 || this.openingPrice == 0 || this.transactionQuantity == 0) return true
  return false
}
root.computed.maximunPosition = function () {
  return this.accMul(Number(this.openingPrice), Number(this.transactionQuantity))
}

// 判断目标价格输入框是否为空
root.computed.isTargePrice = function () {
  if(this.targetOpeningPrice == '' || this.targetReturnRate == '') return true
  if(this.targetOpeningPrice == 0 || this.targetReturnRate == 0) return true
  return false
}
root.computed.isStyle = function () {
  if(this.openingPrice==0 || this.openingPrice==0 || this.transactionQuantity==0) return false
  if(this.openingPrice=='' || this.openingPrice=='' || this.transactionQuantity=='') return false
  return true
}
// 是否可以计算
root.computed.isComputed = function (){
  if(!this.maxPosition) return
  if(Number(this.maxPosition) < this.accMul(Number(this.openingPrice), Number(this.transactionQuantity)))return true
  return false
}

//加下划线币对
root.computed.symbol = function () {
  return this.$store.state.symbol;
}
//不加下划线币对
root.computed.capitalSymbol = function () {
  return this.$globalFunc.toOnlyCapitalLetters(this.symbol);
}
// 检验是否是APP
root.computed.isApp = function () {
  return this.$route.query.isApp ? true : false
}

// 最大头寸值
root.computed.maximumPosition = function () {
  return this.$store.state.bracketNotionalcap[this.capitalSymbol] || []
}
// 杠杆倍数
root.computed.initialLeverage = function () {
  return this.$store.state.bracketLeverage[this.capitalSymbol] || []
}
// 最大头寸计算
root.computed.maxPosition = function () {
  let maxPosition = '',initialLeverage = this.initialLeverage
  // console.info(initialLeverage,this.maximumPosition)
  if(this.calculatorValue > initialLeverage[1] && this.calculatorValue <= initialLeverage[0]) {
    maxPosition = this.maximumPosition[0]
    return maxPosition
  }
  if(this.calculatorValue > initialLeverage[2] && this.calculatorValue <= initialLeverage[1]) {
    maxPosition = this.maximumPosition[1]
    return maxPosition
  }
  if(this.calculatorValue > initialLeverage[3] && this.calculatorValue <= initialLeverage[2]) {
    maxPosition = this.maximumPosition[2]
    return maxPosition
  }
  if(this.calculatorValue > initialLeverage[4] && this.calculatorValue <= initialLeverage[3]) {
    maxPosition = this.maximumPosition[3]
    return maxPosition
  }
  if(this.calculatorValue > initialLeverage[5] && this.calculatorValue <= initialLeverage[4]) {
    maxPosition = this.maximumPosition[4]
    return maxPosition
  }
  if(this.calculatorValue == initialLeverage[5]) {
    maxPosition = this.maximumPosition[5]
    return maxPosition
  }
  if(this.calculatorValue ==  initialLeverage[6]) {
    maxPosition = this.maximumPosition[6]
    return maxPosition
  }
  if(this.calculatorValue == initialLeverage[7]) {
    maxPosition = this.maximumPosition[7]
    return maxPosition
  }
  if(this.calculatorValue == initialLeverage[8]) {
    maxPosition = this.maximumPosition[8]
    return maxPosition
  }
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
root.watch.maximunPosition = function (newVal,oldVal) {
}
root.watch.maxPosition = function (newVal,oldVal) {
}
root.watch.calculatorValue = function (newVal,oldVal) {
}
root.watch.targetPrice = function (newVal,oldVal) {
  this.income = ''
  this.securityDeposit = ''
  this.returnRate =''
}
root.watch.openingPrice = function (newVal,oldVal) {
  this.income = ''
  this.securityDeposit = ''
  this.returnRate =''
}
root.watch.transactionQuantity = function (newVal,oldVal) {
  this.income = ''
  this.securityDeposit = ''
  this.returnRate =''
}
// 切换收益和目标价格
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
  this.income = ''
  this.securityDeposit = ''
  this.returnRate =''
}
//做多做空切换
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
// 计算收益
root.methods.clickCalculation = function (){
  if(this.closingPrice == '' || this.openingPrice == '' || this.transactionQuantity == '') return
  if(Number(this.maxPosition)  < this.accMul(Number(this.openingPrice), Number(this.transactionQuantity))) return
  if(this.moreEmptyType == 1){
    // 收益计算
    this.income = this.toFixed(this.accMul((this.accMinus(Number(this.closingPrice) , Number(this.openingPrice))),Number(this.transactionQuantity)),2)
  }else{
    this.income = this.toFixed(this.accMul((this.accMinus(Number(this.openingPrice),Number(this.closingPrice))),Number(this.transactionQuantity)),2)
  }
  // 起始保证金计算
  this.securityDeposit = this.toFixed(this.accDiv(this.accMul(Number(this.openingPrice), Number(this.transactionQuantity)),Number(this.calculatorValue)),2)
  // 回报率计算
  this.returnRate = Number(this.accMul(this.accDiv(this.income,(this.securityDeposit)),10*10)).toFixed(2)

}

// 目标价格计算
root.methods.calculateTargePrice = function () {
  if(this.targetOpeningPrice == '' || this.targetReturnRate == '') {
    this.targetPrice = '--'
    return
  }
  if(this.maxPosition < this.accMul(Number(this.openingPrice), Number(this.transactionQuantity))) return
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

// 处理滑动条显示框内容
root.methods.formatTooltip=(val)=>{
  // console.info(val)
  return  val + 'X';
}
// 做多做空选择
root.methods.selectMoreEmptyType = function (type) {
  this.moreEmptyType = type
}
// 标题切换选择
root.methods.selectType = function (type) {
  this.styleType = type
}
// 返回交易页
root.methods.jumpToTradingHallDetail = function () {
  this.$router.go(-1)
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
