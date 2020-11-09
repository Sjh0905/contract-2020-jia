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
  default: ''
}
// 单双仓
root.props.positionModeFirst = {
  type: String,
  default: 'singleWarehouseMode'
}
// 单双仓
root.props.positionList = {
  type: Array,
  default: ['positionList']
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
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.positionModeFirst == 'singleWarehouseMode'? this.openerType = 1:this.openerType = 2
  // this.createdArray(6,6)
  // console.info('positionAmt',this.positionAmt)
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 单仓分步（平仓止盈）
root.computed.stepPlanList = function () {
  if(!this.testNumber(this.takeProfitStep)) return
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
  if(this.positionAmt > 0){
    return this.allPrice(this.averagePrice,this.stopProfitPoint)
  }
  if(this.positionAmt < 0){
    return this.allPrice(this.averagePrice,-this.stopProfitPoint)
  }
  return 0
}
// 单仓全部价格（清仓止损）
root.computed.allBothPriceDown = function () {
  if(this.StopLossPoint == '') return
  if(this.positionAmt > 0){
    return this.allPrice(this.averagePrice,-this.StopLossPoint)
  }
  if(this.positionAmt < 0){
    return this.allPrice(this.averagePrice,this.StopLossPoint)
  }
  return 0
}


// 双开 多仓 全部 价格（平仓止盈）
root.computed.allLongPrice = function () {
  if(!this.stopProfitPoint) return '--'
  return this.allPrice(this.averagePriceLong,this.stopProfitPoint) || '--'
}
// 双开 多仓 分步 价格（平仓止盈）
root.computed.stepLongList = function () {
  if(!this.testNumber(this.takeProfitStep)) return
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
  return this.allPrice(this.averagePriceLong,-this.StopLossPoint) || '--'
}
// 双开 多仓 分步 价格（清仓止损）
root.computed.stepLongListDown = function () {
  // this.fullStopStep:num
  // this.openAmountShort:stepNum 可盈（可损）总量
  // this.fullStopPoint:Point 间隔点数
  // this.averagePriceShort:averagePrice 均价
  // this.StopLossPoint : pointIpt 止损点数
  if(!this.testNumber(this.fullStopStep)) return
  if(!this.fullStopStep || !this.fullStopPoint || !this.StopLossPoint || !this.openAmountLong) return
  // num：为步数，stepNum：可损（可损）总量，point:间隔点数（若为清仓止损，该值为负数）,averagePrice:均价,pointIpt:止盈(止损)点数
  return this.createdArray(Number(this.fullStopStep) || 0,Math.abs(this.openAmountShort),-Number(this.fullStopPoint),Number(this.averagePriceShort),-Number(this.StopLossPoint))
}

// 空仓全部价格（平仓止盈）
root.computed.allShortPrice = function () {
  if(!this.stopProfitPointEmpty) return '--'
  return this.allPrice(this.averagePriceShort,-this.stopProfitPointEmpty) || '--'
}

// 双开 空仓 分部 价格(平仓止盈)
root.computed.stepShortList = function () {
  // this.takeStepEmpty:num
  // this.openAmountShort:stepNum
  // this.stopPointEmpty:Point
  // this.averagePriceShort:averagePrice
  // this.stopProfitPointEmpty : 止盈点数
  if(!this.testNumber(this.takeStepEmpty)) return
  if(!this.takeStepEmpty || !this.stopPointEmpty || !this.stopProfitPointEmpty || !this.openAmountShort) return
  // num：为步数，stepNum：可损（可损）总量，point:间隔点数（若为清仓止损，该值为负数）,averagePrice:均价,pointIpt:止盈(止损)点数
  return this.createdArray(Number(this.takeStepEmpty) || 0,Math.abs(this.openAmountShort),-Number(this.stopPointEmpty),Number(this.averagePriceShort),-Number(this.stopProfitPointEmpty))
}

// 空仓全部价格（清仓止损）
root.computed.allShortPriceDown = function () {
  if(!this.StopLossPointEmpty) return '--'
  if(this.StopLossPointEmpty > this.averagePriceShort) return 0
  return this.allPrice(this.averagePriceShort,this.StopLossPointEmpty) || '--'
}

// 双开 空仓 分部 价格(清仓止损)
root.computed.stepShortListDown = function () {
  // this.fullStepShortEmpty:num
  // this.openAmountShort:stepNum
  // this.fullPointShortEmpty:Point
  // this.averagePriceShort:averagePrice
  // this.StopLossPointEmpty : 止损点数
  if(!this.testNumber(this.fullStepShortEmpty)) return
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
  if(this.positionList.length == 0)  (this.totalAmountLong = 0)
  return amount = Number(this.openAmount) + Number(this.totalAmountLong)
}
// 双仓可盈多仓均价
root.computed.averagePriceLong = function () {
  return Number(this.toFixed(this.averagePr('LONG',this.openAmountLong),2)) || '--'
}
// 双仓可盈空仓均价
root.computed.averagePriceShort = function () {
  return Number(this.toFixed(this.averagePr('SHORT',this.openAmountShort),2)) || '--'
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
  return amount = Number(this.openAmount) + Number(this.totalAmountShort)
}

// 单仓数量
root.computed.openAmountNum = function () {
  // if(!this.$globalFunc.testNumber(this.openAmount)) return
  let openAmountNum = 0
  if(this.openerType == 1 && this.longOrShortType == 2) {
    openAmountNum = Number('-'+this.openAmount)
    return Number(openAmountNum) || 0
  }
  return Number(this.openAmount) || 0
}
//  单仓可盈总量
root.computed.positionAmt = function () {
  let amount = 0
  this.positionList.forEach((v,dex)=>{
    if(v.positionSide == 'BOTH'){
      amount = Number(v.positionAmt)
    }
  })
  return amount = this.openAmountNum + amount

}
// 单仓均价
root.computed.averagePrice = function () {
  let averagePre = 0,sameSide
  this.positionList && this.positionList.forEach((v)=>{
    // 如果是单仓显示均价
    sameSide = (v.positionAmt > 0 && this.longOrShortType==1) || (v.positionAmt < 0 && this.longOrShortType==2)
    if(v.positionSide == 'BOTH'){
      // 单仓同方向计算均价
      if(sameSide) {
        averagePre = (Number(v.entryPrice) * Math.abs(v.positionAmt)) + (Number(this.isNowPrice) * Math.abs(this.openAmountNum))
        return averagePre = averagePre / (Math.abs(v.positionAmt)+Math.abs(this.openAmountNum))
      }
      // 如果对冲，均价为市价
      if((v.positionAmt < 0 && this.longOrShortType == 1) || (v.positionAmt > 0 && this.longOrShortType==2)){
        return averagePre = Number(this.isNowPrice)
      }
      // 如果只有 仓位 均价为开仓价
      if(!this.openAmount) return (averagePre = Number(v.entryPrice))
    }
  })
  if(this.positionList.length==0 && this.openAmount) return (averagePre = Number(this.isNowPrice))
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
root.computed.isLogin = function () {
  return this.$store.state.isLogin
}
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
// 关闭所有弹窗
root.methods.closeResult = function () {
  this.showResult = false
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

// 检测是否为数字
root.methods.testInput = function () {
  if(!this.$globalFunc.testNumber(this.openAmount)){
    this.popOpen = true;
    this.popType = 0;
    this.popText='开仓数量请输入正确的数字'
    return
  }
  if(!this.$globalFunc.testNumber(this.stopProfitPoint)){
    this.popOpen = true;
    this.popType = 0;
    this.popText='止盈点数请输入正确的数字'
    return
  }
  if(!this.$globalFunc.testNumber(this.stopProfitPoint)){
    this.popOpen = true;
    this.popType = 0;
    this.popText='止盈点数请输入正确的数字'
    return
  }
}
// 检测步数为正整数
root.methods.testPoint = function () {
  if(!this.testNumber(this.takeProfitStep)) return true
  if(!this.testNumber(this.fullStopStep)) return true
  if(!this.testNumber(this.takeStepEmpty)) return true
  if(!this.testNumber(this.fullStepShortEmpty)) return true
  return false
}
// 调用接口
root.methods.createWithStop = function () {
  // if (!this.$store.state.authState.userId) {
  //   // this.loading = false
  //   return
  // }
  // 如果没有登录直接跳转登录页面
  // if(!this.isLogin){
  //   window.location.replace(this.$store.state.contract_url + 'index/sign/login')
  // }
  // this.testInput()
  if(this.noCommit()){
    this.popOpen = true;
    this.popType = 0;
    this.popText='请填写正确的内容'
    return
  }
  if(this.positionLimit()){
    this.popOpen = true;
    this.popType = 0;
    this.popText='您暂时没有可平仓位'
    return
  }
  if(this.testPoint()) {
    this.popOpen = true;
    this.popType = 0;
    this.popText='分步步数请输入正整数'
    return
  }
  if(this.stepPointLimit()){
    this.popOpen = true;
    this.popType = 0;
    this.popText='请输入正确的止盈（止损）点数、分步和间隔点数'
    return
  }
  // if(true){
  //   alert('有仓位啦====')
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

  switch (data.code) {
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
    default:
      break;
  }
  if(data.code == 200) {
    // this.popOpen = true;
    // this.popType = 1;
    // this.popText = '下单成功'
    this.showResult = true
    this.resultData = data.data || {}
    // this.closeClick()
    return
  }
  // this.popOpen = true;
  // this.popType = 0;
  // this.popText = '下单失败';
}
// 获取订单出错
root.methods.error_createWithStop = function (err) {
  console.warn("获取订单出错！")
}
root.methods.windowResult = function () {

}
// 全部价格公式（直接用）
root.methods.allPrice = function (AveragePrice,allPoint) {
  let longPrice
  if(this.isStepTypeClose == 1 || this.isStepTypeEmpty == 1) {
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
}
// 打开开平器列表
root.methods.openList = function () {
  this.getRecords()
  this.showList = true
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
  this.createWithStop()
  // this.clearVal()
}
// 取消按钮
root.methods.closeClick = function () {
  this.$emit('close')
  this.clearVal()
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
}

// 单仓止盈
root.methods.stepOrallTakeProfit = function (item) {
  if(item.openType=='LONG' && item.stopProfitLong){
    if(!item.stopProfitStepLong){
      return '全部'
    }
    return '分步（' +item.stopProfitStepLong +'步/'+ item.profitIntervalLong+'点）'
  }
  if(item.openType=='SHORT' && item.stopProfitShort){
    if(!item.stopProfitStepShort){
      return '全部'
    }
    return '分步（' +item.stopProfitStepShort +'步/'+ item.profitIntervalShort +'点）'
  }
  return '--'
}
// 单仓止损
root.methods.stepOrallLoss = function (item) {
  if(item.openType=='LONG' && item.stopLossLong){
    if(!item.stopLossLong){
      return '全部'
    }
    return '分步（' +item.stopLossStepLong+'步/'+ item.lossIntervalLong+'点）'
  }
  if(item.openType=='SHORT' && item.stopLossShort){
    if(!item.stopLossShort){
      return '全部'
    }
    return '分步（' +item.stopLossShort+'步/'+ item.lossIntervalShort+'点）'
  }
  return '--'
}

// 双仓多仓止盈计划
root.methods.profitLong = function (item) {
  if(item.openType=='DUAL' && item.stopProfitLong){
    if(!item.stopProfitStepLong){
      return '全部'
    }
    return '分步（' +item.stopProfitStepLong +'步/'+ item.profitIntervalLong+'点）'
  }
  return '--'
}
// 双仓多仓止损计划
root.methods.lossLong = function (item) {
  if(item.openType=='DUAL' && item.stopLossLong){
    if(!item.stopLossLong){
      return '全部'
    }
    return '分步（' +item.stopLossStepLong+'步/'+ item.lossIntervalLong+'点）'
  }
  return '--'
}
// 双仓空仓止盈计划
root.methods.profitEmptyShort = function (item) {
  if(item.openType=='DUAL' && item.stopProfitShort){
    if(!item.stopProfitStepShort){
      return '全部'
    }
    return '分步（' +item.stopProfitStepShort +'步/'+ item.profitIntervalShort +'点）'
  }
  return '--'
}
// 双仓kong仓止损计划
root.methods.lossEmptyShort = function (item) {
  if(item.openType=='DUAL' && item.stopLossShort){
    if(!item.stopLossShort){
      return '全部'
    }
    return '分步（' +item.stopLossShort+'步/'+ item.lossIntervalShort+'点）'
  }
  return '--'
}


/*---------------  开平器 End  ---------------*/

// 创建数组 TODO：num：为步数，stepNum：可损（可损）总量，point:间隔点数（若为清仓止损，该值为负数）,averagePrice:均价,pointIpt:止盈(止损)点数
root.methods.createdArray = function (num=1,stepNum,point ,averagePrice,pointIpt) {
  // // 比如是2，需要是一个数组里面有两个对象
  // a = [{price:12000,step:0.1},{price:12100,step:0.1}]
  // // 比如是3，需要是一个数组里面有三个对象
  // a = [{price:12000,step:0.1},{price:12100,step:0.1},{price:12200,step:0.1}]
  let arr = new Array(Number(num))
  for (var i = 0; i < arr.length; i++) {
    arr[i] = {}
    // 12000需要计算出来的均价 200为用户输入的点数
    if(Number(point) * i > averagePrice) return
    arr[0].price = averagePrice + Number(pointIpt)
    arr[i].price = arr[0].price + (Number(point) * i)
    arr[i].step = Number(stepNum) / Number(num)
  }
  // arr[0].price = averagePrice + Number(pointIpt)
  return arr || []
}
// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}

/*---------------------- 格式化时间 begin ---------------------*/
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD')
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
