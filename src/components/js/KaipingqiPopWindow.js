const root = {}
root.name = 'KaipingqiPopWindow'

root.props = {}
root.props.switch = {
  type: Boolean,
  default: true
}
root.props.close = {
  type: Function
}
// H5 关闭弹窗
root.props.closeBtn = {
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
// 最新价格
root.props.isNowPrice = {
  type: String,
  default: '',
}
// 单双仓
root.props.positionModeFirst = {
  type: String,
  default: 'singleWarehouseMode'
}
// 单双仓
root.props.positionList = {
  type: Array,
  default: []
}
// 精度
root.props.baseScale = {
  type: Number,
  default: 0
}

/*------------------------------ 组件 ------------------------------*/
root.components = {
  'PositionModeBulletBox': resolve => require(['../vue/PositionModeBulletBox'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),

}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    //记录页面
    showList:false,
    listOpen:false,

    openOpener:true,
    openerType:1, // 开平器 单开 双开 切换
    longOrShortType:1, // 单仓 开平器开多开空切换

    isStepType:1, //平仓止盈 全部和分步切换（单开）
    isStepTypeClose:1, //清仓止损 全部和分步切换（单开)

    isStepTypeLong:1, //平仓止盈 全部和分步切换（双开的多仓）
    isStepTypeCloseLong:1, //清仓止损 全部和分步切换(双开的多仓）

    isStepTypeEmpty:1, //平仓止盈 全部和分步切换(双开的空仓)
    isStepTypeCloseEmpty:1, //清仓止损 全部和分步切换(双开的空仓)


    stopProfitPoint:'', // 单仓  止盈点数
    takeProfitStep:'', // 单仓 平仓止盈 步数
    takeProfitPoint:'', // 单仓 平仓止盈 间隔点数


    StopLossPoint:'', // 单仓 清仓止损 止损点数
    fullStopStep:'', // 单仓 清仓止损 步数
    fullStopPoint:'', // 单仓 清仓止损 间隔点数



    openAmount:'', // 开仓数量
    // a: [{price:12000,step:0.1},{price:12100,step:0.1},{price:12200,step:0.1}],


    stopProfitPointEmpty:'', //双仓 空仓 平仓止盈 止盈点数
    takeStepEmpty:'', //双仓 空仓 平仓止盈 分步步数
    stopPointEmpty:'', //双仓 空仓 平仓止盈 间隔点数

    StopLossPointEmpty:'', //双仓 空仓 清仓止损 止损点数
    fullStepShortEmpty:'', //双仓 空仓 清仓止损 分步步数
    fullPointShortEmpty:'', //双仓 空仓 清仓止损 间隔点数

    totalAmountLong:0, // 双仓开多仓位总数量
    totalAmountShort:0, //双仓开空仓位总数量

    popType: 0,
    popText: '',
    popOpen: false,

    // 开平器记录弹窗
    openListWindow:true,
    // 记录数组
    openerRecords:[],

    // 结果弹窗
    showResult:false,
    resultData:{},
    // 禁止频繁点击
    openDisabel:false,
    isLiChengCheng:true,

  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  // if(this.isMobile){
  //   this.getPositionRisk()
  //   this._props.isNowPrice = this.$route.query.isNowPrice || ''
  //   this._props.positionModeFirst = this.$route.query.positionModeFirst || ''
  // }
  this.positionModeFirst == 'singleWarehouseMode'? this.openerType = 1:this.openerType = 2
  // this.createdArray(6,6)


}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
root.computed.show = function () {
  return this.switch
}
// 双仓 多仓 市价可开数量
root.computed.openAmtLong = function () {
  return this.$store.state.openAmount.openAmtLong
}
// 双仓 空仓 市价可开数量
root.computed.openAmtShort = function () {
  return this.$store.state.openAmount.openAmtShort
}
// 单仓 多仓 市价可开数量
root.computed.openAmtBuy = function () {
  return this.$store.state.openAmountSingle.openAmtBuy
}
// 单仓 空仓 市价可开数量
root.computed.openAmtSell = function () {
  return this.$store.state.openAmountSingle.openAmtSell
}
// // 检验是否是APP
root.computed.isApp = function () {
  return this.$route.query.isApp ? true : false
}
// 单仓分步（平仓止盈）
root.computed.stepPlanList = function () {
  if(!this.testNumber(this.takeProfitStep)) return
  if(Number(this.takeProfitStep) >5) return
  let PlanList
  // num：为步数，stepNum：可损（可损）总量，point:间隔点数（若为清仓止损，该值为负数）,averagePrice:均价
  if(this.takeProfitStep=='' || this.takeProfitPoint =='' || this.stopProfitPoint== '') return
  if(this.positionAmt > 0){
    PlanList = this.createdArray(Number(this.takeProfitStep),Math.abs(this.positionAmt),Number(this.takeProfitPoint),Number(this.averagePrice),Number(this.stopProfitPoint))
    return [...PlanList]
  }
  if(this.positionAmt < 0){
    PlanList = this.createdArray(Number(this.takeProfitStep),Math.abs(this.positionAmt),-Number(this.takeProfitPoint),Number(this.averagePrice),-Number(this.stopProfitPoint))
    return [...PlanList]
  }
}
// 单仓分步（清仓止损）
root.computed.stepPlanListDown = function () {
  if(!this.testNumber(this.fullStopStep)) return
  if(Number(this.fullStopStep)>5) return
  let PlanListDow
  // num：为步数，stepNum：可损（可损）总量，point:间隔点数（若为清仓止损，该值为负数）,averagePrice:均价,pointIpt:止盈(止损)点数
  if(this.StopLossPoint=='' || this.fullStopStep =='' || this.fullStopPoint== '') return
  if(this.positionAmt > 0){
    PlanListDow = this.createdArray(Number(this.fullStopStep) || 0,Math.abs(this.positionAmt),-Number(this.fullStopPoint),Number(this.averagePrice),-Number(this.StopLossPoint))
    return [...PlanListDow]
  }
  if(this.positionAmt < 0){
    PlanListDow = this.createdArray(Number(this.fullStopStep) || 0,Math.abs(this.positionAmt),Number(this.fullStopPoint),Number(this.averagePrice),Number(this.StopLossPoint))
    return [...PlanListDow]
  }
}

// 单仓全部价格（平仓止盈）
root.computed.allBothPrice = function () {
  if(this.stopProfitPoint== '') return
  if(Number(this.averagePrice) < Number(this.stopProfitPoint)) return 0
  if(this.positionAmt > 0){
    return Number(this.toFixed(this.allPrice(this.averagePrice,this.stopProfitPoint),2)) || '--'
  }
  if(this.positionAmt < 0){
    return Number(this.toFixed(this.allPrice(this.averagePrice,-this.stopProfitPoint),2)) || '--'
  }
  return 0
}
// 单仓全部价格（清仓止损）
root.computed.allBothPriceDown = function () {
  if(this.StopLossPoint == '') return
  if(Number(this.averagePrice) < Number(this.StopLossPoint)) return 0
  if(this.positionAmt > 0){
    return Number(this.toFixed(this.allPrice(this.averagePrice,-this.StopLossPoint),2)) || '--'
  }
  if(this.positionAmt < 0){
    return Number(this.toFixed(this.allPrice(this.averagePrice,this.StopLossPoint),2)) || '--'
  }
  return 0
}

// 双开 多仓 全部 价格（平仓止盈）
root.computed.allLongPrice = function () {
  if(!this.stopProfitPoint) return '--'
  return Number(this.toFixed(this.allPrice(this.averagePriceLong,this.stopProfitPoint),2)) || '--'
}
// 双开 多仓 分步 价格（平仓止盈）
root.computed.stepLongList = function () {
  if(!this.testNumber(this.takeProfitStep)) return
  if(Number(this.takeProfitStep) > 5) return
  if(!this.takeProfitStep || !this.stopProfitPoint || !this.takeProfitPoint || !this.openAmountLong) return
  // this.takeProfitStep:num
  // this.openAmountLong:stepNum
  // this.takeProfitPoint:Point
  // this.averagePriceLong:averagePrice
  // this.stopProfitPoint : 止盈点数
  // num：为步数，stepNum：可损（可损）总量，point:间隔点数（若为清仓止损，该值为负数）,averagePrice:均价,pointIpt:止盈(止损)点数
  return this.createdArray(Number(this.takeProfitStep) || 0,Math.abs(this.openAmountLong),Number(this.takeProfitPoint),Number(this.averagePriceLong),Number(this.stopProfitPoint))
}

// 双开 多仓 全部 价格(清仓止损)
root.computed.allLongPriceDown = function () {
  if(!this.StopLossPoint) return '--'
  if(this.allPrice(this.averagePriceLong,-this.StopLossPoint) <= 0) return 0
  return Number(this.toFixed(this.allPrice(this.averagePriceLong,-this.StopLossPoint),2)) || '--'
}
// 双开 多仓 分步 价格（清仓止损）
root.computed.stepLongListDown = function () {
  // this.fullStopStep:num
  // this.openAmountShort:stepNum 可盈（可损）总量
  // this.fullStopPoint:Point 间隔点数
  // this.averagePriceShort:averagePrice 均价
  // this.StopLossPoint : pointIpt 止损点数
  if(!this.testNumber(this.fullStopStep)) return
  if(Number(this.fullStopStep) > 5) return
  if(!this.fullStopStep || !this.fullStopPoint || !this.StopLossPoint || !this.openAmountLong) return
  // num：为步数，stepNum：可损（可损）总量，point:间隔点数（若为清仓止损，该值为负数）,averagePrice:均价,pointIpt:止盈(止损)点数
  return this.createdArray(Number(this.fullStopStep) || 0,Math.abs(this.openAmountShort),-Number(this.fullStopPoint),Number(this.averagePriceShort),-Number(this.StopLossPoint))
}

// 空仓全部价格（平仓止盈）
root.computed.allShortPrice = function () {
  if(!this.stopProfitPointEmpty) return '--'
  if(Number(this.stopProfitPointEmpty) > Number(this.averagePriceShort)) return 0
  return Number(this.toFixed(this.allPrice(this.averagePriceShort,-this.stopProfitPointEmpty),2)) || '--'
}

// 双开 空仓 分部 价格(平仓止盈)
root.computed.stepShortList = function () {
  // this.takeStepEmpty:num
  // this.openAmountShort:stepNum
  // this.stopPointEmpty:Point
  // this.averagePriceShort:averagePrice
  // this.stopProfitPointEmpty : 止盈点数
  if(!this.testNumber(this.takeStepEmpty)) return
  if(Number(this.takeStepEmpty) > 5) return
  if(!this.takeStepEmpty || !this.stopPointEmpty || !this.stopProfitPointEmpty || !this.openAmountShort) return
  // num：为步数，stepNum：可损（可损）总量，point:间隔点数（若为清仓止损，该值为负数）,averagePrice:均价,pointIpt:止盈(止损)点数
  return this.createdArray(Number(this.takeStepEmpty) || 0,Math.abs(this.openAmountShort),-Number(this.stopPointEmpty),Number(this.averagePriceShort),-Number(this.stopProfitPointEmpty))
}

// 空仓全部价格（清仓止损）
root.computed.allShortPriceDown = function () {
  if(!this.StopLossPointEmpty) return '--'
  // if(this.StopLossPointEmpty > this.averagePriceShort) return 0
  return Number(this.toFixed(this.allPrice(this.averagePriceShort,this.StopLossPointEmpty),2)) || '--'
}

// 双开 空仓 分部 价格(清仓止损)
root.computed.stepShortListDown = function () {
  // this.fullStepShortEmpty:num
  // this.openAmountShort:stepNum
  // this.fullPointShortEmpty:Point
  // this.averagePriceShort:averagePrice
  // this.StopLossPointEmpty : 止损点数
  if(!this.testNumber(this.fullStepShortEmpty)) return
  if(Number(this.fullStepShortEmpty) > 5) return
  if(!this.fullStepShortEmpty || !this.fullPointShortEmpty || !this.StopLossPointEmpty || !this.openAmountShort) return
  // num：为步数，stepNum：可损（可损）总量，point:间隔点数（若为清仓止损，该值为负数）,averagePrice:均价,pointIpt:止盈(止损)点数
  return this.createdArray(Number(this.fullStepShortEmpty) || 0,Math.abs(this.openAmountShort),Number(this.fullPointShortEmpty),Number(this.averagePriceShort),Number(this.StopLossPointEmpty))
}

// 双仓可盈多仓数量
root.computed.openAmountLong = function () {
  let amount = 0
  this.positionList && this.positionList.forEach((v,dex)=>{
    if(v.positionSide == 'LONG'){
      amount = Number(v.positionAmt)
      this.totalAmountLong = amount
    }
  })
  if(this.positionList.length == 0)  {
    this.totalAmountLong = 0
  }
  if(this.positionList.length == 0 && !this.openAmount) return '--'
  return amount = this.toFixed(Number(this.openAmount) + Number(this.totalAmountLong),this.baseScale) || '--'
}
// 双仓可盈多仓均价
root.computed.averagePriceLong = function () {
  return Number(this.toFixed(this.averagePr('LONG',this.openAmountLong || 1),2)) || '--'
}
// 双仓可盈空仓均价
root.computed.averagePriceShort = function () {
  return Number(this.toFixed(this.averagePr('SHORT',this.openAmountShort || 1),2)) || '--'
}
// 双仓可盈空仓数量
root.computed.openAmountShort = function () {
  let amount = 0
  this.positionList.forEach((v,dex)=>{
    if(v.positionSide == 'SHORT'){
      amount = Math.abs(v.positionAmt)
      this.totalAmountShort = amount
    }
  })
  if(this.positionList.length == 0)  (this.totalAmountShort = 0)
  if(this.positionList.length == 0 && !this.openAmount) return '--'
  return amount = this.toFixed(Number(this.openAmount) + Number(this.totalAmountShort),this.baseScale) || '--'
}
root.computed.totalOpenAmount = function () {
  if(this.positionList.length == 0 && !this.openAmount) return '--'
  return this.toFixed(Number(this.openAmountShort) + Number(this.openAmountLong),this.baseScale)
}

// 单仓数量
root.computed.openAmountNum = function () {
  // if(!this.$globalFunc.testNumber(this.openAmount)) return
  let openAmountNum = 0
  if(this.openerType == 1 && this.longOrShortType == 2) {
    openAmountNum = Number('-'+this.openAmount)
    return Number(openAmountNum) || 0
  }
  return this.toFixed(Number(this.openAmount),this.baseScale) || 0
}
//  单仓可盈总量
root.computed.positionAmt = function () {
  let amount = 0
  this.positionList.forEach((v,dex)=>{
    if(v.positionSide == 'BOTH'){
      amount = Number(v.positionAmt)
    }
  })
  if(!this.openAmountNum && this.positionList.length==0) return 0
  return amount = this.toFixed(Number(this.openAmountNum) + Number(amount),this.baseScale)
}
// 单仓均价
root.computed.averagePrice = function () {
  let averagePre = 0
  this.positionList && this.positionList.forEach((v)=>{
    // 如果是单仓显示均价
    // sameSide =
    if(v.positionSide == 'BOTH'){
      // 单仓同方向计算均价
      if((v.positionAmt > 0 && this.longOrShortType==1) || (v.positionAmt < 0 && this.longOrShortType==2)) {
        averagePre = (Number(v.entryPrice) * Math.abs(v.positionAmt)) + (Number(this.isNowPrice) * Math.abs(this.openAmountNum))
        return averagePre = averagePre / (Math.abs(v.positionAmt)+Math.abs(this.openAmountNum))
      }
      // 如果对冲，均价为市价
      if((v.positionAmt <= 0 && this.longOrShortType == 1) || (v.positionAmt >= 0 && this.longOrShortType==2)){
        return averagePre = Number(this.isNowPrice)
      }
      // 如果只有 仓位 均价为开仓价
      if(!this.openAmount) return (averagePre = Number(v.entryPrice))
    }
  })
  if(this.positionList.length==0 && this.openAmount) return averagePre = Number(this.isNowPrice)
  return Number(this.toFixed(averagePre,2)) || '--'
}
// 显示隐藏
root.computed.show = function () {
  return this.switch
}
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
// 是否登录
// 计算当前symbol
root.computed.symbol = function () {
  // console.warn('symbol',this.$store.state.symbol);
  return this.$store.state.symbol;
}
//不加下划线币对
root.computed.capitalSymbol = function () {
  return this.$globalFunc.toOnlyCapitalLetters(this.symbol);
}

/*------------------------------ 观察 -------------------------------*/
root.watch = {}
// 切换单双仓，止盈止损点数至为空
root.watch.openerType = function () {
  this.stopProfitPoint=''
  this.StopLossPoint=''
}
root.watch.longOrShortType = function (newVal,oldVal) {
  this.openAmount= ''
}
root.watch.positionModeFirst = function () {
  this.positionModeFirst == 'singleWarehouseMode'? this.openerType = 1:this.openerType = 2
}

/*------------------------------ 方法 -------------------------------*/
root.methods = {}

// 仓位
root.methods.getPositionRisk = function () {

  this.$http.send("GET_POSITION_RISK", {
    bind: this,
    callBack: this.re_getPositionRisk,
    errorHandler: this.error_getPositionRisk
  })
}
// 获取记录返回，类型为{}
root.methods.re_getPositionRisk = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  let records = data.data,filterRecords = []
  for (let i = 0; i < records.length ; i++) {
    let v = records[i];
    if (v.marginType == 'cross' && v.positionAmt != 0 && v.symbol == this.capitalSymbol) {
      filterRecords.push(v)
      continue;
    }
    //逐仓保证金：isolatedMargin - unrealizedProfit,开仓量或逐仓保证金不为0的仓位才有效
    if(v.marginType == 'isolated' && v.symbol == this.capitalSymbol){
      v.securityDeposit = this.accMinus(v.isolatedMargin,v.unrealizedProfit)
      // v.securityDeposit = Number(v.isolatedMargin) - Number(v.unrealizedProfit)

      //由于开头判断条件用括号包装，会被编译器解析成声明函数括号，所以前一行代码尾或本行代码头要加分号、或者本行代码改为if判断才行
      // (v.positionAmt != 0 || v.securityDeposit != 0) && filterRecords.push(v);
      if((v.positionAmt != 0 || v.securityDeposit != 0) && v.symbol == this.capitalSymbol) {
        filterRecords.push(v)
      }
    }
  }
  this.positionList = filterRecords || []
  // this.positionList = filterRecords || []
}
// 获取记录失败
root.methods.error_getPositionRisk = function (err) {
  // console.warn('err',err)
}

// 关闭所有弹窗
root.methods.closeResult = function () {
  this.showResult = false
  if(this.isMobile){
    this.closeClickBtn()
    return
  }
  this.closeClick()

}
// 传参类型
root.methods.openTypeParams = function () {
  if(!this.openAmount) return 'STOP_MARKET'
  if(this.positionModeFirst == 'singleWarehouseMode' && this.longOrShortType == 1) return 'LONG'
  if(this.positionModeFirst == 'singleWarehouseMode' && this.longOrShortType == 2) return 'SHORT'
  if(this.positionModeFirst == 'doubleWarehouseMode') return 'DUAL'
}

// 止盈步数 多仓
root.methods.stopProfitStepLong = function () {
  // 若止盈点数为空  该值传 ''
  if(!this.stopProfitPoint || this.positionAmt <= 0) return ''
  if(this.positionAmt > 0 && this.isStepType == 2) return this.takeProfitStep
  if(this.positionAmt > 0 && this.isStepType == 1) return 0
}
// 止盈步数 空仓
root.methods.stopProfitStepShort = function () {
  // positionAmtShort && (this.isStepTypeClose ==2 ? this.fullStopStep : '')
  if(!this.stopProfitPoint || this.positionAmt >= 0) return ''
  if(this.positionAmt < 0 && this.isStepType == 2) return this.takeProfitStep
  if(this.positionAmt < 0 && this.isStepType == 1) return 0
}

// 止损步数 多仓
root.methods.stopLossStepLong = function () {
  if(!this.StopLossPoint || this.positionAmt <= 0) return ''
  // this.isStepTypeClose ==2 ? this.fullStopStep : ''
  if(this.positionAmt > 0 && this.isStepTypeClose == 2) return this.fullStopStep
  if(this.positionAmt > 0 && this.isStepTypeClose == 1) return 0
}
// 止损步数 空仓
root.methods.stopLossStepShort = function () {
  if(!this.StopLossPoint || this.positionAmt >= 0) return ''
  if(this.positionAmt < 0 && this.isStepTypeClose == 2) return this.fullStopStep
  if(this.positionAmt < 0 && this.isStepTypeClose == 1) return 0
}

// 止盈间隔数量 多仓
root.methods.profitIntervalLong = function () {
  // positionAmtLong && (this.isStepType == 2 ? this.takeProfitPoint : '')
  // 若止盈点数为空  该值传 ''
  if(!this.stopProfitPoint || this.positionAmt <= 0) return ''
  if(this.positionAmt > 0 && this.isStepType == 2) return this.takeProfitPoint
  if(this.positionAmt > 0 && this.isStepType == 1) return 0
}
// 止盈间隔数量 空仓
root.methods.profitIntervalShort = function () {
  // positionAmtShort && (this.isStepTypeClose ==2 ? this.fullStopStep : '')
  if(!this.stopProfitPoint || this.positionAmt >= 0) return ''
  if(this.positionAmt < 0 && this.isStepType == 2) return this.takeProfitPoint
  if(this.positionAmt < 0 && this.isStepType == 1) return 0
}

// 止损间隔点数 多仓
root.methods.lossIntervalLong = function () {
  if(!this.StopLossPoint || this.positionAmt <= 0) return ''
  // this.isStepTypeClose ==2 ? this.fullStopStep : ''
  if(this.positionAmt > 0 && this.isStepTypeClose == 2) return this.fullStopPoint
  if(this.positionAmt > 0 && this.isStepTypeClose == 1) return 0
}
// 止损间隔点数 空仓
root.methods.lossIntervalShort = function () {
  if(!this.StopLossPoint || this.positionAmt >= 0) return ''
  if(this.positionAmt < 0 && this.isStepTypeClose == 2) return this.fullStopPoint
  if(this.positionAmt < 0 && this.isStepTypeClose == 1) return 0
}
// 获取开平器列表
root.methods.getRecords = function () {
  this.$http.send('GET_ORDERS_GETRECORD', {
    bind: this,
    query: {
      symbol:this.capitalSymbol
    },
    callBack: this.re_getRecords,
    errorHandler: this.error_getRecords,
  })
}
root.methods.re_getRecords = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data && !data.data) return
  this.openerRecords = data.data || []
}
// 获取订单出错
root.methods.error_getRecords = function (err) {
  console.warn("获取订单出错！")
}


// 单仓双仓如果没有仓位数量,平仓输入框不能输入
root.methods.positionLimit = function () {
  if(this.positionModeFirst == 'singleWarehouseMode' && !this.positionAmt) {
    if(this.stopProfitPoint || this.StopLossPoint) return true
  }
  if(this.positionModeFirst == 'doubleWarehouseMode' && !this.openAmountLong) {
    if(this.stopProfitPoint || this.StopLossPoint) return true
  }
  if(this.positionModeFirst == 'doubleWarehouseMode' && !this.openAmountShort) {
    if(this.StopLossPointEmpty || this.StopLossPointEmpty) return true
  }
  return false
}
// 单仓双仓如果有仓位数量,有止盈（止损）点数，选用 分步，则 步数 和 间隔点数 不为空判断
root.methods.stepPointLimit = function () {
  if(this.positionModeFirst == 'singleWarehouseMode' && this.positionAmt) {
    if(this.isStepType == 2 && (!this.stopProfitPoint || !this.takeProfitStep || !this.takeProfitPoint)) return true
    if(this.isStepTypeClose == 2 && (!this.StopLossPoint || !this.fullStopStep || !this.fullStopPoint)) return true
  }
  // 双仓多仓 有止盈点数，分步和间隔点数不能为空
  if(this.positionModeFirst == 'doubleWarehouseMode' && this.openAmountLong) {
    if(this.isStepTypeLong == 2 && (!this.stopProfitPoint || !this.takeProfitStep || !this.takeProfitPoint)) return true
    if(this.isStepTypeClose == 2 && (!this.StopLossPoint || !this.fullStopStep || !this.fullStopPoint)) return true
  }
  // 双仓空仓 有止盈点数，分步和间隔点数不能为空
  if(this.positionModeFirst == 'doubleWarehouseMode' && this.openAmountShort) {
    if(this.isStepTypeEmpty == 2 && (!this.stopProfitPointEmpty || !this.takeStepEmpty || !this.stopPointEmpty)) return true
    if(this.isStepTypeCloseEmpty == 2 && (!this.StopLossPointEmpty || !this.fullStepShortEmpty || !this.fullPointShortEmpty)) return true
  }
  return false
}


// 单双仓如果都没填不可以提交
root.methods.noCommit = function () {
  if(this.positionModeFirst == 'singleWarehouseMode' && !this.openAmount && !this.stopProfitPoint && !this.StopLossPoint) return true
  // 双仓多仓 有止盈点数，分步和间隔点数不能为空
  if(this.positionModeFirst == 'doubleWarehouseMode' && !this.openAmount && !this.stopProfitPoint && !this.StopLossPoint && !this.stopProfitPointEmpty && !this.StopLossPointEmpty) return true
  // // 双仓空仓 有止盈点数，分步和间隔点数不能为空
  // if(this.positionModeFirst == 'doubleWarehouseMode' && this.openAmountShort) {
  //   if(!this.stopProfitPointEmpty) return true
  //   if(!this.StopLossPointEmpty) return true
  // }
  return false
}

// 检测步数为正整数
root.methods.testPoint = function () {
  if(!this.testNumber(this.takeProfitStep)) return true
  if(!this.testNumber(this.fullStopStep)) return true
  if(!this.testNumber(this.takeStepEmpty)) return true
  if(!this.testNumber(this.fullStepShortEmpty)) return true
  return false
}
// 分步限制
root.methods.stepLimit = function () {
  if(Number(this.takeProfitStep) > 5)return true
  if(Number(this.fullStopStep) > 5)return true
  if(Number(this.takeStepEmpty) > 5)return true
  if(Number(this.fullStepShortEmpty) > 5)return true
  return false
}


root.methods.stepMore = function () {
  let singLong = Math.abs(Number(this.positionAmt)) / (Number(this.takeProfitStep)|| 1) >= 0.001 ? true:false,
    singShort = Math.abs(Number(this.positionAmt)) / (Number(this.fullStopStep) || 1) >= 0.001 ? true:false,

    doubleLong =Math.abs(Number(this.openAmountLong)) / (Number(this.takeProfitStep)|| 1) >= 0.001 ? true:false,
    doubleLong2 =Math.abs(Number(this.openAmountLong)) / (Number(this.fullStopStep)|| 1) >= 0.001 ? true:false,
    doubleShort =Math.abs(Number(this.openAmountShort)) / (Number(this.takeStepEmpty)|| 1) >= 0.001 ? true:false,
    doubleShort2 =Math.abs(Number(this.openAmountShort)) / (Number(this.fullStepShortEmpty)|| 1) >= 0.001 ? true:false;

  if(this.positionModeFirst == 'singleWarehouseMode') {
      return singLong && singShort
  }
  if(this.positionModeFirst == 'doubleWarehouseMode' && Number(this.openAmountLong)) {
      return doubleLong && doubleLong2
  }
  if(this.positionModeFirst == 'doubleWarehouseMode' && Number(this.openAmountShort)){
    return doubleShort && doubleShort2
  }
  return false
  // if(this.positionModeFirst == 'doubleWarehouseMode' && Math.abs(this.openAmountLong) / Number(this.takeProfitStep) >= 0.001) return true
  // if(this.positionModeFirst == 'doubleWarehouseMode' && Math.abs(this.openAmountLong) / Number(this.fullStopStep) >= 0.001 ) return true
  // if(this.positionModeFirst == 'doubleWarehouseMode' && Math.abs(this.openAmountShort) / Number(this.takeProfitStep) >= 0.001 ) return true
  // if(this.positionModeFirst == 'doubleWarehouseMode' && Math.abs(this.openAmountShort) / Number(this.fullStopStep) >= 0.001 ) return true

}
root.methods.testIpt = function (ipt) {
  if(!this.$globalFunc.testNumberPoint(this[ipt])){
    this.popOpen = true;
    this.popType = 0;
    this.popText='请输入数字'
  }
}
root.methods.testNumberPoint = function (ipt) {

  // if(this.$globalFunc.testNumberPoint(ipt)){
  //   this.popOpen = true;
  //   this.popType = 0;
  //   this.popText='请输入正确的数字'
  //   this.openDisabel = false
  //   return
  // }
  // let a = this.$globalFunc.testNumberPoint(this.openAmount),
  //   b=this.$globalFunc.testNumberPoint(this.stopProfitPoint),
  //   c=this.$globalFunc.testNumberPoint(this.takeProfitPoint),
  //   d=this.$globalFunc.testNumberPoint(this.StopLossPoint),
  //   e=this.$globalFunc.testNumberPoint(this.fullStopPoint),
  //   b1=this.$globalFunc.testNumberPoint(this.stopProfitPointEmpty),
  //   b2=this.$globalFunc.testNumberPoint(this.StopLossPointEmpty),
  //   b3=this.$globalFunc.testNumberPoint(this.stopPointEmpty),
  //   b4=this.$globalFunc.testNumberPoint(this.fullPointShortEmpty);
  //
  // if(this.positionModeFirst == 'singleWarehouseMode') {
  //   return a || b || c || d || e
  // }
  // if(this.positionModeFirst == 'doubleWarehouseMode') {
  //   return a && b && c && d && e && b1 && b2 && b3 && b4
  // }

  // 单仓 和 双仓 多仓
  // if(this.$globalFunc.testNumberPoint(this.openAmount)) return true
  // if(this.$globalFunc.testNumberPoint(this.stopProfitPoint)) return true
  // if(this.$globalFunc.testNumberPoint(this.takeProfitPoint)) return true
  // if(this.$globalFunc.testNumberPoint(this.StopLossPoint)) return true
  // if(this.$globalFunc.testNumberPoint(this.fullStopPoint)) return true
  // // 双仓 空仓
  // if(this.$globalFunc.testNumberPoint(this.stopProfitPointEmpty)) return true
  // if(this.$globalFunc.testNumberPoint(this.StopLossPointEmpty)) return true
  // if(this.$globalFunc.testNumberPoint(this.stopPointEmpty)) return true
  // if(this.$globalFunc.testNumberPoint(this.fullPointShortEmpty)) return true
  // return false
}
// 开仓数量不能超过可开数量
root.methods.limitAmount = function () {
  if(this.positionModeFirst == 'singleWarehouseMode' && this.longOrShortType==1 && Math.abs(this.positionAmt) >= this.openAmtBuy) {
    return true
  }
  if(this.positionModeFirst == 'singleWarehouseMode' && this.longOrShortType==1 && Math.abs(this.positionAmt) >= this.openAmtSell) {
    return true
  }
  if(this.positionModeFirst == 'doubleWarehouseMode' && Math.min(this.openAmtLong,this.openAmtShort) <= Number(this.openAmountLong)) {
    return true
  }
  if(this.positionModeFirst == 'doubleWarehouseMode' && Math.min(this.openAmtLong,this.openAmtShort) <= Number(this.openAmountShort)) {
    return true
  }
  return false
}
// 调用接口
root.methods.createWithStop = function () {
  this.openDisabel = true
  this.isLiChengCheng = true
  // if (!this.$store.state.authState.userId) {
  //   // this.loading = false
  //   return
  // }
  // 如果没有登录直接跳转登录页面
  // if(!this.isLogin){
  //   window.location.replace(this.$store.state.contract_url + 'index/sign/login')
  // }
  // this.testInput()

  // if(!this.$globalFunc.testNumberPoint(this.openAmount)) {
  //   this.popOpen = true;
  //   this.popType = 0;
  //   this.popText='请输入数字'
  //   this.openDisabel = false
  //   return
  // }

  let params,positionAmtLong,positionAmtShort
  if(this.positionModeFirst == 'singleWarehouseMode'){
    positionAmtLong = this.positionAmt > 0
    positionAmtShort = this.positionAmt < 0

    params = {
      openType: this.openTypeParams(), //开仓方式
      amount: this.openAmount, //开仓数量

      stopProfitLong: positionAmtLong ? this.stopProfitPoint: '', // 止盈点数 不止盈就不传
      stopProfitShort: positionAmtShort ? this.stopProfitPoint: '', // 止盈点数 不止盈就不传

      stopLossLong: positionAmtLong ? this.StopLossPoint:'', // 止损点数 不止损就不传
      stopLossShort: positionAmtShort ? this.StopLossPoint:'', //止损点数 不止损就不传


      stopProfitStepLong: this.stopProfitStepLong(), // 止盈步数 全部传0 或者不传
      stopProfitStepShort: this.stopProfitStepShort() , // 止盈步数 全部传0 或者不传

      stopLossStepLong: this.stopLossStepLong(), // 止损步数 全部传0 或者不传
      stopLossStepShort: this.stopLossStepShort(), // 止损步数 全部传0 或者不传

      profitIntervalLong: this.profitIntervalLong(), //止盈间隔数量
      profitIntervalShort: this.profitIntervalShort(), //止盈间隔数量

      lossIntervalLong:this.lossIntervalLong(), //止损间隔数量
      lossIntervalShort:this.lossIntervalShort(), //止损间隔数量

      symbol: this.capitalSymbol, // 币对
    }
  }

  if(this.positionModeFirst == 'doubleWarehouseMode'){
    params = {
      openType: this.openTypeParams(), //开仓方式
      amount: this.openAmount, //开仓数量

      stopProfitLong: this.stopProfitPoint || '', // 止盈点数 不止盈就不传
      stopProfitShort: this.stopProfitPointEmpty || '', // 止盈点数 不止盈就不传

      stopLossLong: this.StopLossPoint || '', // 止损点数 不止损就不传
      stopLossShort: this.StopLossPointEmpty || '', //止损点数 不止损就不传

      stopProfitStepLong:  this.isStepTypeLong == 1 ? 0 :this.takeProfitStep, // 止盈步数 全部传0 或者不传
      stopProfitStepShort:  this.isStepTypeEmpty == 1 ? 0: this.takeStepEmpty , // 止盈步数 全部传0 或者不传

      stopLossStepLong: this.isStepTypeClose ==1 ? 0: this.fullStopStep, // 止损步数 全部传0 或者不传
      stopLossStepShort: this.isStepTypeCloseEmpty == 1 ? 0:this.fullStepShortEmpty, // 止损步数 全部传0 或者不传

      profitIntervalLong: this.isStepTypeLong == 1? 0 :this.takeProfitPoint, //止盈间隔数量
      profitIntervalShort: this.isStepTypeEmpty == 1 ? 0: this.stopPointEmpty, //止盈间隔数量

      lossIntervalLong:this.isStepTypeClose ==1 ? 0: this.fullStopPoint, //止损间隔数量
      lossIntervalShort: this.isStepTypeCloseEmpty==1 ? 0:this.fullPointShortEmpty, //止损间隔数量

      symbol: this.capitalSymbol, // 币对
    }
  }
  this.$http.send('POST_CREATE_WITH_STOP', {
    bind: this,
    params: params,
    callBack: this.re_createWithStop,
    errorHandler: this.error_createWithStop,
  })
}
// 获取订单回调
root.methods.re_createWithStop = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  this.openDisabel = false
  this.isLiChengCheng =true
  switch (data.code) {
    case 401:
      this.popOpen = true;
      this.popType = 0;
      this.popText = '请您先进行登录';
      break;
    case 304:
      this.popOpen = true;
      this.popType = 0;
      this.popText = '用户无权限';
      break;
    case 307:
      this.popOpen = true;
      this.popType = 0;
      this.popText = '仓位模式变更同步中，请于1分钟后操作';
      break;
    case 2001:
      this.popOpen = true;
      this.popType = 0;
      this.popText = '分步限制';
      break;
    case 2002:
      this.popOpen = true;
      this.popType = 0;
      this.popText = '您暂时没有可平仓位';
      break;
    case 2003:
      this.popOpen = true;
      this.popType = 0;
      this.popText = '分步下单数量小于最小下单数量'
      break;
    case 2004:
      this.popOpen = true;
      this.popType = 0;
      this.popText = '单向持仓模式下无法双开订单'
      break;
    case 2005:
      this.popOpen = true;
      this.popType = 0;
      this.popText = '获取仓位模式失败'
      break;
    case 200:
      this.openDisabel = false
      this.showResult = true
      this.isLiChengCheng = false
      this.resultData = data.data || {}
      break;
    default:
      this.popOpen = true;
      this.popType = 0;
      this.popText = '下单失败'
  }
  // if(data.code == 200) {
  //   // this.popOpen = true;
  //   // this.popType = 1;
  //   // this.popText = '下单成功'
  //   this.openDisabel = false
  //   this.showResult = true
  //   this.resultData = data.data || {}
  //   // this.closeClick()
  //   return
  // }
  // this.popOpen = true;
  // this.popType = 0;
  // this.popText = '下单失败';
}
// 获取订单出错
root.methods.error_createWithStop = function (err) {
  this.openDisabel = false
  console.warn("获取订单出错！")
}
root.methods.windowResult = function () {

}
// 全部价格公式（直接用）
root.methods.allPrice = function (AveragePrice,allPoint) {
  let longPrice
  if(this.isStepTypeClose == 1 || this.isStepTypeEmpty == 1 || this.isStepType == 1 || this.isStepTypeLong==1) {
    longPrice = Number(AveragePrice) + Number(allPoint)
  }
  return longPrice
}

// 均价计算公式(直接套用)
root.methods.averagePr = function (side,amount) {
  let averagePre = 0
  this.positionList && this.positionList.forEach((v)=>{
    // 如果是单仓显示均价
    if(v.positionSide == side || Math.abs(v.positionAmt)!=0){
      averagePre = (Number(v.entryPrice) * Math.abs(v.positionAmt) + Number(this.isNowPrice) * Math.abs(amount))
      return averagePre = averagePre / (Math.abs(v.positionAmt)+Math.abs(amount))
    }
  })

  if(this.positionList.length==0){
    averagePre = Number(this.isNowPrice) * Math.abs(amount)
    return averagePre = averagePre / Math.abs(amount)
  }
  return this.toFixed(averagePre,2) || '--'
}
// 获取记录出错
root.methods.error_getPositionRisk = function (err) {
  console.warn("充值获取记录出错！", err)
}
// 关闭开平器记录
root.methods.closeList = function () {
  this.showList = false
  // this.closeClick()
  // this.closeClick()
}
// 打开开平器列表
root.methods.openList = function () {
  if(!this.isMobile){
    this.getRecords()
  }
  if(this.isMobile){
    // APP使用会调用此段代码
    if(this.$route.query.isApp) {
      if(!this.$store.state.authState.userId){
        window.postMessage(JSON.stringify({
          method: 'toLogin'
        }))
        return
      }

      window.postMessage(JSON.stringify({
          method: 'toH5Route',
          parameters: {
            url: window.location.origin + '/index/MobileBottleOpenerList?isApp=true&isWhite=true',
            loading: false,
            navHide: false,
            title: '',
            requireLogin:true,
            isTransparentNav:true
          }
        })
      );
      return
    }
    // 开平器记录
    this.$router.push('MobileBottleOpenerList')
    return
  }
  this.showList = true
  // this.isLiChengCheng = false
}

root.methods.testPointValue = function (keyName,length = 2) {
  this[keyName].indexOf('.') > 0 && (this[keyName].split('.')[1].length > length) && (this[keyName] = this[keyName].split('.')[0] + '.' + this[keyName].split('.')[1].substr(0, length));
}

/*---------------  开平器 Begin  ---------------*/


root.methods.changeIsStepTypeCloseEmpty = function (isStepTypeCloseEmpty) {
  this.isStepTypeCloseEmpty = isStepTypeCloseEmpty
}

root.methods.changeIsStepTypeEmpty = function (isStepTypeEmpty) {
  this.isStepTypeEmpty = isStepTypeEmpty
}

// 改变清仓止损全部分步切换
root.methods.changeStepClose = function (isStepTypeClose) {
  this.isStepTypeClose = isStepTypeClose
}
// 改变平仓止盈全部分步切换
root.methods.changeIsStepType = function (isStepType) {
  this.isStepType = isStepType
}
root.methods.changeIsStepTypeLong = function (isStepTypeLong) {
  this.isStepTypeLong = isStepTypeLong
}
// 开多开空切换
root.methods.changeLongShort = function (type) {
  this.longOrShortType = type
}
// 开平器切换
root.methods.changeOpenerType = function (type) {
  if(this.positionModeFirst == 'singleWarehouseMode') return this.openerType = 1
  this.openerType = 2
  this.openerType = type
}
// 开平器确定按钮
root.methods.comitBottleOpener = function () {
  if(this.limitAmount()){
    this.popOpen = true;
    this.popType = 0;
    this.popText='开仓数量不能超过可开数量'
    this.openDisabel = false
    this.isLiChengCheng = true
    return
  }
  if(this.noCommit()){
    this.popOpen = true;
    this.popType = 0;
    this.popText='请填写正确的内容'
    this.openDisabel = false
    this.isLiChengCheng = true
    return
  }
  if(this.positionLimit()){
    this.popOpen = true;
    this.popType = 0;
    this.popText='您暂时没有可平仓位'
    this.openDisabel = false
    this.isLiChengCheng = true
    return
  }
  if(this.stepLimit()) {
    this.popOpen = true;
    this.popType = 0;
    this.popText='分步最多为5步'
    this.openDisabel = false
    this.isLiChengCheng = true
    return
  }
  if(!this.stepMore()) {
    this.popOpen = true;
    this.popType = 0;
    this.popText='分步下单数量小于最小下单数量'
    this.openDisabel = false
    this.isLiChengCheng = true
    return
  }
  if(this.testPoint()) {
    this.popOpen = true;
    this.popType = 0;
    this.popText='分步步数请输入正整数'
    this.openDisabel = false
    this.isLiChengCheng = true
    return
  }
  if(this.stepPointLimit()){
    this.popOpen = true;
    this.popType = 0;
    this.popText='分步状态下,请输入正确的分步和点数'
    this.openDisabel = false
    this.isLiChengCheng = true
    return
  }

  this.createWithStop()
  // this.clearVal()
}
// 取消按钮
root.methods.closeClick = function () {
  this.$emit('close')
  this.clearVal()
}
// H5 取消按钮
root.methods.closeClickBtn = function () {

  let openerStatus = JSON.parse(sessionStorage.getItem('opener_states'))
  if(openerStatus != null && openerStatus == '0'){
    this.$emit('closeBtn')
    this.clearVal()
    sessionStorage.setItem('opener_states',1)
  }


  // }
}
// 关闭弹窗清除所有值
root.methods.clearVal= function () {
  this.takeProfitStep = ''
  this.takeProfitPoint = ''
  this.stopProfitPoint = ''
  this.StopLossPoint = ''
  this.fullStopStep = ''
  this.fullStopPoint = ''
  this.openAmount = ''
  this.stopProfitPointEmpty = ''
  this.StopLossPointEmpty = ''
  this.isLiChengCheng = true
}

/* -------------------- 开平器记录列表 begin-------------------- */
// 止盈计划
root.methods.stopProfit = function (item) {
  let stopProfitLong = item.stopProfitLong,
    stopProfitStepLong = item.stopProfitStepLong,
    profitIntervalLong = item.profitIntervalLong,

    stopProfitShort = item.stopProfitShort,
    stopProfitStepShort = item.stopProfitStepShort,
    profitIntervalShort = item.profitIntervalShort,

    openType = item.openType

  if(stopProfitLong) {
    if(openType=='LONG') {
      if(stopProfitStepLong){
        return '分步（' + stopProfitStepLong +'步/'+ profitIntervalLong+'点）'
      }
      return '全部'
    }
    if(openType=='SHORT') {
      return '--'
    }
    if(openType=='DUAL') {
      if(stopProfitStepLong){
        return '分步（' + stopProfitStepLong +'步/'+ profitIntervalLong+'点）'
      }
      return '全部'
    }
    if(openType=='STOP_MARKET') {
      if(stopProfitStepLong){
        return '分步（' +stopProfitStepLong +'步/'+ profitIntervalLong+'点）'
      }
      return '全部'
    }
  }

  if(stopProfitShort) {
    if(openType=='LONG') {
      return '--'
    }
    if(openType=='SHORT') {
      if(stopProfitStepShort) {
        return '分步（' + stopProfitStepShort + '步/' + profitIntervalShort + '点）'
      }
      return '全部'
    }
    if(openType=='DUAL') {
      if(stopProfitStepShort) {
        return '分步（' + stopProfitStepShort + '步/' + profitIntervalShort + '点）'
      }
      return '全部'
    }
    if(openType=='STOP_MARKET') {
      if(stopProfitStepShort) {
        return '分步（' + stopProfitStepShort + '步/' + profitIntervalShort + '点）'
      }
      return '全部'
    }
  }

  return '--'
}

// 止盈点数
root.methods.stopProfitPointe = function (item) {
  let stopProfitLong = item.stopProfitLong,

    stopProfitShort = item.stopProfitShort,

    openType = item.openType

  if(stopProfitLong) {
    if(openType=='LONG') {
      return stopProfitLong
    }
    if(openType=='SHORT') {
      return '--'
    }
    if(openType=='DUAL') {
      return stopProfitLong
    }
    if(openType=='STOP_MARKET') {
      return stopProfitLong
    }
  }

  if(stopProfitShort) {
    if(openType=='LONG') {
      return '--'
    }
    if(openType=='SHORT') {
      return stopProfitShort
    }
    if(openType=='DUAL') {
      return stopProfitShort
    }
    if(openType=='STOP_MARKET') {
      return stopProfitShort
    }
  }
  return '--'
}

// 止损计划
root.methods.stopLoss = function (item) {
  let stopLossLong = item.stopLossLong,
    stopLossStepLong = item.stopLossStepLong,
    lossIntervalLong = item.lossIntervalLong,

    stopLossShort = item.stopLossShort,
    stopLossStepShort = item.stopLossStepShort,
    lossIntervalShort = item.lossIntervalShort,

    openType = item.openType

  if(stopLossLong) {
    if(openType=='LONG') {
      if(stopLossStepLong){
        return '分步（' + stopLossStepLong +'步/'+ lossIntervalLong+'点）'
      }
      return '全部'
    }
    if(openType=='SHORT') {
      return '--'
    }
    if(openType=='DUAL') {
      if(stopLossStepLong){
        return '分步（' + stopLossStepLong +'步/'+ lossIntervalLong+'点）'
      }
      return '全部'
    }
    if(openType=='STOP_MARKET') {
      if(stopLossStepLong){
        return '分步（' +stopLossStepLong +'步/'+ lossIntervalLong+'点）'
      }
      return '全部'
    }
  }

  if(stopLossShort) {
    if(openType=='LONG') {
      return '--'
    }
    if(openType=='SHORT') {
      if(stopLossStepShort) {
        return '分步（' + stopLossStepShort + '步/' + lossIntervalShort + '点）'
      }
      return '全部'
    }
    if(openType=='DUAL') {
      if(stopLossStepShort) {
        return '分步（' + stopLossStepShort + '步/' + lossIntervalShort + '点）'
      }
      return '全部'
    }
    if(openType=='STOP_MARKET') {
      if(stopLossStepShort) {
        return '分步（' + stopLossStepShort + '步/' + lossIntervalShort + '点）'
      }
      return '全部'
    }
  }

  return '--'
}

// 止损点数
root.methods.stopLossPoint = function (item) {
  let stopLossLong = item.stopLossLong,

    stopLossShort = item.stopLossShort,

    openType = item.openType

  if(stopLossLong) {
    if(openType=='LONG') {
      return stopLossLong
    }
    if(openType=='SHORT') {
      return '--'
    }
    if(openType=='DUAL') {
      return stopLossLong
    }
    if(openType=='STOP_MARKET') {
      return stopLossLong
      return '全部'
    }
  }

  if(stopLossShort) {
    if(openType=='LONG') {
      return '--'
    }
    if(openType=='SHORT') {
      return stopLossShort
    }
    if(openType=='DUAL') {
      return stopLossShort
    }
    if(openType=='STOP_MARKET') {
      return stopLossShort
    }
  }

  return '--'
}

// 止盈计划 双仓空仓
root.methods.stopProfitShort = function (item) {
  let stopProfitShort = item.stopProfitShort,
    stopProfitStepShort = item.stopProfitStepShort,
    profitIntervalShort = item.profitIntervalShort,

    openType = item.openType

  if(stopProfitShort) {
    if(openType=='DUAL') {
      if(stopProfitStepShort) {
        return '分步（' + stopProfitStepShort + '步/' + profitIntervalShort + '点）'
      }
      return '全部'
    }
    if(openType=='STOP_MARKET') {
      if(stopProfitStepShort) {
        return '分步（' + stopProfitStepShort + '步/' + profitIntervalShort + '点）'
      }
      return '全部'
    }
  }

  return '--'
}

// 止盈点数 双仓空仓
root.methods.stopProfitPointeShort = function (item) {
  let stopProfitLong = item.stopProfitLong,

    stopProfitShort = item.stopProfitShort,

    openType = item.openType

  if(stopProfitShort && (openType=='DUAL' || openType=='STOP_MARKET')) {
    return stopProfitShort
  }
  return '--'
}

// 止损计划 双仓空仓
root.methods.stopLossShort = function (item) {
  let stopLossShort = item.stopLossShort,
    stopLossStepShort = item.stopLossStepShort,
    lossIntervalShort = item.lossIntervalShort,

    openType = item.openType

  if(stopLossShort) {
    if(openType=='DUAL' || openType=='STOP_MARKET') {
      if(stopLossStepShort) {
        return '分步（' + stopLossStepShort + '步/' + lossIntervalShort + '点）'
      }
      return '全部'
    }
  }
  // if(openType=='STOP_MARKET') {
  //   if(stopLossStepShort) {
  //     return '分步（' + stopLossStepShort + '步/' + lossIntervalShort + '点）'
  //   }
  //   return '全部'
  // }
  return '--'
}

// 止损点数 双仓空仓
root.methods.stopLossPointShort = function (item) {
  let stopLossShort = item.stopLossShort,
    openType = item.openType

  if(stopLossShort && (openType=='DUAL' || openType=='STOP_MARKET')) {
    return stopLossShort
  }
  return '--'
}
/* -------------------- 开平器记录列表 end -------------------- */

// // 单仓止盈
// root.methods.stepOrallTakeProfit = function (item) {
//   // 做多 平仓止盈
//   if(item.openType=='LONG' && item.stopProfitLong){
//     if(!item.stopProfitStepLong){
//       return '全部'
//     }
//     if(item.stopProfitStepLong){
//       return '分步（' +item.stopProfitStepLong +'步/'+ item.profitIntervalLong+'点）'
//     }
//   }
//   // 没开仓 直接平仓止盈
//   if(item.openType=='STOP_MARKET' && item.stopProfitLong){
//     if(!item.stopProfitStepLong){
//       return '全部'
//     }
//     if(item.stopProfitStepLong){
//       return '分步（' +item.stopProfitStepLong +'步/'+ item.profitIntervalLong+'点）'
//     }
//   }
//   // 没开仓 直接平仓止损
//   if(item.openType=='STOP_MARKET' && item.stopProfitShort){
//     if(!item.stopProfitStepShort){
//       return '全部'
//     }
//     if(item.stopProfitStepShort) {
//       return '分步（' + item.stopProfitStepShort + '步/' + item.profitIntervalShort + '点）'
//     }
//   }
//   // 做空 平仓止损
//   if(item.openType=='SHORT' && item.stopProfitShort){
//     if(!item.stopProfitStepShort){
//       return '全部'
//     }
//     if(item.stopProfitStepShort) {
//       return '分步（' + item.stopProfitStepShort + '步/' + item.profitIntervalShort + '点）'
//     }
//   }
//
//   return '--'
// }
// // 单仓止损
// root.methods.stepOrallLoss = function (item) {
//   if(item.openType =='LONG' && item.stopLossLong){
//     if(!item.stopLossStepLong){
//       return '全部'
//     }
//     if(item.stopLossStepLong) {
//       return '分步（' + item.stopLossStepLong + '步/' + item.lossIntervalLong + '点）'
//     }
//   }
//   if(item.openType=='SHORT' && item.stopLossShort){
//     if(!item.stopLossStepShort){
//       return '全部'
//     }
//     if(item.stopLossStepShort) {
//       return '分步（' + item.stopLossStepShort + '步/' + item.lossIntervalShort + '点）'
//     }
//   }
//   return '--'
// }
// // 双仓多仓止盈计划
// root.methods.profitLong = function (item) {
//   if(item.openType=='DUAL' && item.stopProfitLong){
//     if(!item.stopProfitStepLong){
//       return '全部'
//     }
//     if(item.stopProfitStepLong) {
//       return '分步（' + item.stopProfitStepLong + '步/' + item.profitIntervalLong + '点）'
//     }
//   }
//   return '--'
// }
// // 双仓多仓止损计划
// root.methods.lossLong = function (item) {
//   if(item.openType=='DUAL' && item.stopLossLong){
//     if(!item.stopLossStepLong){
//       return '全部'
//     }
//     if(item.stopLossStepLong){
//       return '分步（' +item.stopLossStepLong+'步/'+ item.lossIntervalLong+'点）'
//     }
//   }
//     return '--'
// }
// // 双仓空仓止盈计划
// root.methods.profitEmptyShort = function (item) {
//   if(item.openType=='DUAL' && item.stopProfitShort){
//     if(!item.stopProfitStepShort){
//       return '全部'
//     }
//     if(item.stopProfitShort && item.stopProfitStepShort) {
//       return '分步（' + item.stopProfitStepShort + '步/' + item.profitIntervalShort + '点）'
//     }
//   }
//   return '--'
// }
// // 双仓kong仓止损计划
// root.methods.lossEmptyShort = function (item) {
//   if(item.openType=='DUAL' && item.stopLossShort){
//     if(item.stopLossShort && !item.stopLossStepShort){
//       return '全部'
//     }
//     if(item.stopLossShort && item.stopLossStepShort){
//       return '分步（' +item.stopLossStepShort+'步/'+ item.lossIntervalShort+'点）'
//     }
//   }
//   return '--'
// }


/*---------------  开平器 End  ---------------*/

// 创建数组 TODO：num：为步数，stepNum：可损（可损）总量，point:间隔点数（若为清仓止损，该值为负数）,averagePrice:均价,pointIpt:止盈(止损)点数
root.methods.createdArray = function (num=1,stepNum,point ,averagePrice,pointIpt) {
  // // 比如是2，需要是一个数组里面有两个对象
  // a = [{price:12000,step:0.1},{price:12100,step:0.1}]
  // // 比如是3，需要是一个数组里面有三个对象
  // a = [{price:12000,step:0.1},{price:12100,step:0.1},{price:12200,step:0.1}]
  let arr = new Array(Number(num)),number,temp,baseScale=1000
  for (var i = 0; i < arr.length; i++) {
    arr[i] = {}
    // 12000需要计算出来的均价 200为用户输入的点数
    if(Number(point) * i > averagePrice) return
    arr[0].price = averagePrice + Number(pointIpt)
    arr[i].price = arr[0].price + (Number(point) * i)

    number = Number(stepNum) * baseScale % Number(num)
    temp =  Number(stepNum) * baseScale - number
    arr[i].step = (temp / Number(num)) / baseScale

    if(i == arr.length-1) {
      arr[i].step = arr[i].step + number /baseScale
    }
  }
  // arr[0].price = averagePrice + Number(pointIpt)
  return arr || []
}
// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}

// // H5 代码
// // 返回交易页
// root.methods.show = function () {
//   // this.$router.go(-1)
//   this.$emit('close')
// }






/*---------------------- 格式化时间 begin ---------------------*/
// 年月日
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD')
}
// // 时分秒
root.methods.formatDateUitlHms = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'hh:mm:ss')
}
/*---------------------- 格式化时间 end ---------------------*/

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/
root.methods.testNumber = function (number) {
  return this.$globalFunc.testNumber(number)
}
export default root
