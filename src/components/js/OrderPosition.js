import tradingHallData from '../../dataUtils/TradingHallDataUtils'
const root = {}
root.name = 'orderPosition'
root.props = {}
root.props.effectiveTime = {
  type: String,
  default: 'GTX'
}
// 最新价格/市价
root.props.latestPriceVal = {
  type: String,
  default: ''
}
// 最新价格/市价
root.props.availableBalance = {
  type: Number,
  default: 0
}
// 最新标记价格
root.props.markPrice = {
  type: String,
  default: ''
}
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve), // loading
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
  'PositionModeBulletBox': resolve => require(['../vue/PositionModeBulletBox'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading:true,
    records:[],
    socketRecords:[],
    recordsIndex:0,
    tradinghallLimit: 10,
    parity:'',
    // markPrice:'',
    getAssets:[],
    initialMargin:0,

    // 信息提示
    popType: 0,
    popText: '',
    promptOpen: false,

    modifyMarginOpen:false, // 修改逐仓弹框
    styleType:1,  // 1 为增加逐仓保证金；2 为减少逐仓保证金
    increaseAmount:'',  // 增加保证金金额
    reduceAmount:'',  // 减少保证金金额
    modifyMarginMoney: '',
    liquidationPrice:'',
    AmountText:'',  // 修改逐仓保证金输入弹框
    symbol:'' ,// 仓位币种
    positionSide:'', // 仓位方向
    marketPriceClick: false, //市价不能多次点击设置
    checkPriceClick: false, //限价不能多次点击设置
    popOpen:false,   // 一键平仓弹框
    waitForCancel: false, //是否开启等待

    // crossWalletBalance:'' ,// 全仓可用保证金
    // isolatedWalletBalance:'', // 逐仓仓可用保证金
    // walletBalance:'', // 钱包余额
    // reduceMoreAmount: 0 , // 最多可减少
    priceCheck:{
      'BOTH':0,
      'LONG':0,
      'SHORT':0
    },  // 平仓价格在多少
    order:{},
    priceCheck1:0,
    currSAdlQuantile:'',
    controlType: false,
    positionAmt:0, // 当前仓位的数量
    entryPrice: 0, // 当前仓位的开仓价格
    marginType:'',
    crossMaintMarginRate:0,//全仓保证金比率
    totalAmount:0,
    securityDeposit: 0 , // 逐仓保证金
    positionAmtLong:0, // 可平多数量
    positionAmtShort:0, // 可平空数量

    pSymbols:[],//仓位列表出现的币对
    pSymbolsMap:{},//仓位列表出现的币对与仓位映射关系
    popOpenMarket:false,
    positionInfo:{},
    totalAmountLong:0, // 双仓开多仓位数量
    totalAmountShort:0, // 双仓开空仓位数量
  }
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
root.watch.markPrice = function(newVal,oldVal) {
  // console.info(newVal)
  this.handleWithMarkPrice(this.records)
}
root.watch.walletBalance = function(newVal,oldVal) {
  // console.info(newVal)
}
root.watch.crossWalletBalance = function(newVal,oldVal) {
  // console.info(newVal)
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getPositionRisk()
  this.$eventBus.listen(this, 'GET_POSITION', this.getPositionRisk)
  this.positionSocket()
  this.getAdlQuantile()
  this.getAccount()
  // console.info('钱包总余额===',this.$store.state.walletBalance,'除去逐仓仓位的钱包总余额===',this.$store.state.crossWalletBalance)

  //引入链式计算
  this.chainCal = this.$globalFunc.chainCal
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
root.computed.reduceMostAmount1 = function (){
  // 计算最多可减少     // isolatedWalletBalance, isolatedWalletBalance + size * (Latest_Mark_Price - Entry_Price) - Latest_Mark_Price * abs(size) * IMR
  let isolatedWalletBalance = this.accMinus(this.walletBalance,this.crossWalletBalance) // 逐仓钱包余额
  let leverage = this.$store.state.leverage
  let reduceMoreAmount = 0
  // console.info('this.walletBalance,this.crossWalletBalance',this.walletBalance,this.crossWalletBalance)
  let priceDiff= this.accMul(this.positionAmt ,this.accMinus(Number(this.markPrice) , Number(this.entryPrice)))
  let markPosition = this.accDiv(this.accMul(Number(this.markPrice) , Math.abs(this.positionAmt)) , leverage)
  if(this.marginType == "isolated") {
    reduceMoreAmount = this.accMinus(this.accAdd(Number(isolatedWalletBalance) , priceDiff) , markPosition || 1)
  } else {
    reduceMoreAmount = this.accMinus(this.accAdd(Number(isolatedWalletBalance) , priceDiff) , markPosition || 1)
  }
  reduceMoreAmount = reduceMoreAmount < 0 ? reduceMoreAmount = 0 : this.toFixed(reduceMoreAmount,2)
  // console.info('this.reduceMoreAmount===', reduceMoreAmount, this.markPrice)
  return reduceMoreAmount
}
// 钱包余额
root.computed.walletBalance = function () {
  return this.$store.state.assets.walletBalance
}
// 除去逐仓仓位保证金的钱包余额，即全仓保证金余额
root.computed.crossWalletBalance = function () {
  return this.$store.state.assets.crossWalletBalance
}
// 逐仓钱包余额
root.computed.isolatedWalletBalance = function () {
  return this.accMinus(this.walletBalance,this.crossWalletBalance)
}
// 用户id，判断是否登录
root.computed.userId = function () {
  return this.$store.state.authState.userId
}
root.computed.serverTime = function () {
  return new Date().getTime();
}
root.computed.currSymbol = function () {
  return this.$store.state.symbol;
}
root.computed.leverage = function () {
  return this.$store.state.leverage;
}
root.computed.leverageBracket = function () {
  let arr = this.$store.state.leverageBracket && [...this.$store.state.leverageBracket] || [];
  return arr.reverse() //倒序处理，强平价格从最高档开始计算
}
// 存储仓位推送Key值的映射关系
root.computed.socketPositionKeyMap = function () {
  let data = tradingHallData.socketPositionKeyMap
  // console.log('data===',data);
  return data
}
// 强平价格计算类型
root.computed.LPCalculationType = function () {
  let data = tradingHallData.LPCalculationType
  return data
}

/*------------------------------ 方法 -------------------------------*/
root.methods = {}
root.methods.closePopMarket = function () {
  this.popOpenMarket = false
}
// 增加 或 减少保证金接口
root.methods.commitModifyMargin = function () {
  this.controlType = true
  if((this.styleType == 1 && this.increaseAmount == '') || (this.styleType == 2 && this.reduceAmount == '')) {
    this.popText = '请输入数量'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  this.$http.send("POST_POSITION_MARGIN", {
    bind: this,
    params: {
      symbol: this.symbol,
      positionSide: this.positionSide,
      amount:this.styleType == 1? this.increaseAmount : this.reduceAmount,
      type:this.styleType,  // 1是增加逐仓保障金；2 是减少逐仓保证金
    },
    callBack: this.re_commitModifyMargin,
    errorHandler: this.error_commitModifyMargin
  })
}
root.methods.re_commitModifyMargin = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (data.code == 200) {
    this.controlType = false
    // 监听钱包变化
    this.$eventBus.notify({key:'GET_BALANCE'})
    this.getPositionRisk()
    this.increaseAmount = ''
    this.reduceAmount = ''
    this.modifyMarginClose()
    return;
  }
  if (data.code != 200) {
    this.controlType = false
    this.popText = '修改保证金失败'
    this.popType = 0;
    this.promptOpen = true;
  }

}
root.methods.error_commitModifyMargin = function (err) {
  console.log('err===',err)
  this.controlType = false
  this.popText = '修改保证金失败'
  this.popType = 0;
  this.promptOpen = true;
  return
}

root.methods.selectType = function (type) {
  this.styleType = type
}
// 打开逐仓弹框
root.methods.openModifyMargin = function (item) {
  // console.info('item===',item)
  // this.reduceMostAmount1()
  this.modifyMarginMoney = item.securityDeposit
  // this.reduceMostAmount(item)
  this.positionAmt = item.positionAmt || 0
  this.entryPrice = item.entryPrice || 0
  this.marginType = item.marginType || ''
  this.securityDeposit = Number(item.securityDeposit || 0).toFixed(2)
  // this.modifyMarginMoney = item.isolatedMargin
  this.liquidationPrice = item.liquidationPrice
  this.symbol = item.symbol
  this.modifyMarginOpen = true
  if(item.positionSide != 'BOTH'){
    this.positionSide = item.positionSide
    return
  }
  this.positionSide = 'BOTH'
}



// 关闭逐仓弹框
root.methods.modifyMarginClose = function () {
  this.modifyMarginOpen = false
}
root.methods.setCloseAmount = function (item){
  if((item.ps  || item.positionSide) == 'LONG'){
    this.positionAmtLong = item.pa || item.positionAmt
  }

  if((item.ps  || item.positionSide) == 'SHORT'){
    this.positionAmtShort = item.pa || item.positionAmt
  }
  // 将可平仓数量存储到store里面
  let closeAmount = {
    positionAmtLong:this.positionAmtLong,
    positionAmtShort:this.positionAmtShort
  }
  this.$store.commit('CHANGE_CLOSE_AMOUNT',closeAmount)

}

// 接收仓位 socket 信息
root.methods.positionSocket = function () {
  let socketPositionKeyMap = this.socketPositionKeyMap
  // 获取仓位的数据
  this.$socket.on({
    key: 'ACCOUNT_UPDATE', bind: this, callBack: (message) => {
      if(!message) return
      let socketRecords = message.a.B[0] || {}
      let socketPositons = message.a.P || []

      let socketAssets = {
        walletBalance:socketRecords.wb || 0,
        crossWalletBalance:socketRecords.cw || 0
      }
      this.$store.commit('CHANGE_ASSETS', socketAssets)
      // socketRecords.wb &&
      // socketRecords.cw && this.$store.commit('CHANGE_ASSETS', {crossWalletBalance:socketRecords.cw})
      // console.info('this.walletBalance',this.walletBalance,socketRecords.wb,socketRecords.cw,
      //   this.$globalFunc.accAdd(this.crossWalletBalance,10000000)
      // )

      // this.getPositionRisk()

      let currPositions = this.records,realSocketPositons = socketPositons.filter(sv=>{
          this.setCloseAmount(sv)

        if(sv.mt == 'cross' && sv.s == 'BTCUSDT')return sv.pa!=0
        if(sv.mt == 'isolated' && sv.s == 'BTCUSDT')return sv.pa != 0 || sv.iw!=0
        })//开仓量或逐仓保证金不为0的仓位才有效

      // realSocketPositons.length == 0 && (currPositions = realSocketPositons)
      realSocketPositons.length > 0 && realSocketPositons.forEach(v=>{
        for(let k in socketPositionKeyMap){
          let smk = socketPositionKeyMap[k];
          smk && (v[smk] = v[k])
        }
        //由于socket返回的没有isolatedMargin，为了向接口看齐，方便处理，加一个出来
        v.isolatedMargin = this.accAdd(v.iw,v.unrealizedProfit)

        for (let i = 0; i <currPositions.length ; i++) {
          let item = currPositions[i]
          if(v.positionSide == item.positionSide){
            v = Object.assign(item,v)
            //限价输入框的价格
            v.iptMarkPrice = Number(this.markPrice).toFixed(2)
            break;
          }
        }
      })

      this.records = realSocketPositons
      //没有仓位数据时自动减仓返回的空数组，currSAdlQuantile会是undefined，增加仓位后重新调取接口获取值
      if(this.records.length > 0 && this.currSAdlQuantile == undefined)this.getAdlQuantile();
      //自动减仓数据拼接
      if(this.currSAdlQuantile)this.addAdlQuantile(this.currSAdlQuantile,this.records);
      this.handleWithMarkPrice(this.records)

      // this.socketRecords.forEach(v=>{
      //   if(v.ps == "BOTH") {
      //     console.info('v===',v)
      //   }
      //   if(v.ps == "LONG") {
      //     console.info('v===',v)
      //     console.info('this.records',this.records)
      //   }
      //   if(v.ps == "SHORT") {
      //     console.info('v===',v)
      //   }
      // })
    }
  })
}

// 关闭提示信息
root.methods.closePrompt = function () {
  this.promptOpen = false;
}
/*---------------------- 开仓价格 begin ---------------------*/
root.methods.closePositionBox= function (name) {
  $("." + name).attr("style","display:none");
}
root.methods.openPositionBox = function (name) {
  $("." + name).attr("style","display:block");
}
/*---------------------- 开仓价格 end ---------------------*/
// 钱包余额
root.methods.getAccount = function () {
  // if (this.priceCheck != 0) {
  //   this.priceCheck = (localStorage.getItem('PRICE_CHECK'));
  // }
  this.$http.send("GET_BALAN__BIAN", {
    bind: this,
    query: {
      timestamp: this.serverTime
    },
    callBack: this.re_getAccount,
    errorHandler: this.error_getAccount
  })
}
// 获取记录返回，类型为{}
root.methods.re_getAccount = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.loading = false
  this.getAssets = data.data.assets[0]
  this.initialMargin = this.getAssets.initialMargin
  // console.info('this.initialMargin',this.initialMargin)
}
// 获取记录出错
root.methods.error_getAccount = function (err) {
  console.warn("充值获取记录出错！", err)
}

// 仓位
root.methods.getPositionRisk = function () {
  this.$http.send("GET_POSITION_RISK", {
    bind: this,
    // query: {
    //   timestamp: this.serverTime
    // },
    callBack: this.re_getPositionRisk,
    errorHandler: this.error_getPositionRisk
  })
}
// 获取记录返回，类型为{}
root.methods.re_getPositionRisk = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data || !data.data || data.data.length == []) return

  let records = data.data,filterRecords = []

  for (let i = 0; i <records.length ; i++) {
    let v = records[i];
    if (v.marginType == 'cross' && v.positionAmt != 0 && v.symbol == 'BTCUSDT') {
      filterRecords.push(v)
      continue;
    }
    //逐仓保证金：isolatedMargin - unrealizedProfit,开仓量或逐仓保证金不为0的仓位才有效
    if(v.marginType == 'isolated' && v.symbol == 'BTCUSDT'){
      v.securityDeposit = this.accMinus(v.isolatedMargin,v.unrealizedProfit)
      // v.securityDeposit = Number(v.isolatedMargin) - Number(v.unrealizedProfit)

      //由于开头判断条件用括号包装，会被编译器解析成声明函数括号，所以前一行代码尾或本行代码头要加分号、或者本行代码改为if判断才行
      // (v.positionAmt != 0 || v.securityDeposit != 0) && filterRecords.push(v);
      if((v.positionAmt != 0 || v.securityDeposit != 0) && v.symbol == 'BTCUSDT') {
        // v.inputMarginPrice = this.toFixed(v.markPrice,2)
        filterRecords.push(v)
      }
    }
  }

  this.records = filterRecords
  this.recordsIndex = filterRecords.length || 0

  this.$emit('getPositionRisk',this.recordsIndex);

  if(this.records.length > 0){

    //需要用到标记价格计算
    this.handleWithMarkPrice(this.records);

    //自动减仓数据拼接
    if(this.currSAdlQuantile)this.addAdlQuantile(this.currSAdlQuantile,this.records)
  }
  // this.priceCheck = localStorage.setItem('priceCheck');
}
// 获取记录出错
root.methods.error_getPositionRisk = function (err) {
  console.warn("充值获取记录出错！", err)
}
//计算保证金和保证金比率
root.methods.handleWithMarkPrice = function(records){
  if(!records || records.length == 0)return
  let totalMaintMargin = 0,totalUnrealizedProfit = 0,totalAmt=0,totalAmtLong=0,totalAmtShort=0;
  this.pSymbols = [];//初始化
  this.pSymbolsMap = {}//初始化

  //由于四舍五入，以下均使用原生toFixed
  records.map((v,i)=>{

    if(!v.hasOwnProperty('iptMarkPrice')){
      v.markPrice && (v.iptMarkPrice = v.markPrice) || (v.iptMarkPrice = this.markPrice);
      v.iptMarkPrice = Number(v.iptMarkPrice).toFixed(2)
    }

    let notional = this.accMul(Math.abs(v.positionAmt) || 0,this.markPrice || 0)
    let args = this.getCalMaintenanceArgs(notional) || {},maintMarginRatio = args.maintMarginRatio || 0,notionalCum = args.notionalCum || 0

    v.bracketArgs = args;//用于强平价格降档计算

    //全仓维持保证金：Notional * MMR - cum；Notional= abs(positionAmt) * Latest_Mark_Price
    //逐仓维持保证金：abs(position size) * Latest_Mark_Price * MMR -cum
    v.maintMargin = this.accMinus(this.accMul(notional,maintMarginRatio),notionalCum)

    v.unrealizedProfitPage = v.unrealizedProfit//由于unrealizedProfit要用于计算逐仓保证金，值不能改变，但是页面和计算的值需要变化

    //回报率：全仓逐仓均是ROE = ( ( Mark Price - Entry Price ) * size ) / （Mark Price * abs(size) * IMR）,IMR = 1/杠杆倍数
    v.unrealizedProfitPage = this.accMul( this.accMinus(this.markPrice || 0,v.entryPrice || 0),v.positionAmt || 0 )//实时变化的未实现盈亏
    let msi = this.accDiv( this.accMul(Math.abs(v.positionAmt) || 0,this.markPrice || 0) , this.leverage )
    v.responseRate = this.accMul(this.accDiv(v.unrealizedProfitPage || 0,msi || 1),100)
    v.responseRate = Number(v.responseRate).toFixed(2) + '%'

    // console.log('v.responseRate.toFixed',i,v.responseRate)
    // this.changePositonAmt(v)
    if(v.marginType == 'cross'){
      //全仓保证金：size * markprice * 1 / leverage，size = abs(positionAmt)
      v.securityDeposit = this.accDiv(notional,this.leverage)

      totalMaintMargin = this.accAdd(totalMaintMargin,v.maintMargin || 0)
      totalUnrealizedProfit = this.accAdd(totalUnrealizedProfit,v.unrealizedProfitPage || 0)
    }
    if(v.marginType == 'isolated'){

      //逐仓保证金：isolatedMargin - unrealizedProfit
      v.securityDeposit = this.accMinus(v.isolatedMargin,v.unrealizedProfit)

      //逐仓保证金比率=维持保证金/(实时变的未实现盈亏+逐仓钱包余额 iw)；其中的iw → ws取，或者等于接口的isolatedMargin - unRealizedProfit
      v.maintMarginRate = this.accDiv( v.maintMargin,this.accAdd(v.unrealizedProfitPage || 0,v.securityDeposit) )
      v.maintMarginRate = Number(v.maintMarginRate * 100).toFixed(2) + '%'
    }

    if((v.ps  || v.positionSide) == 'BOTH') {
      totalAmt += (v.pa || v.positionAmt)
    }
    if((v.ps  || v.positionSide) == 'LONG'){
      totalAmtLong =  v.positionAmt
    }
    if((v.ps  || v.positionSide) == 'SHORT'){
      totalAmtShort =  v.positionAmt
    }

    // 单仓下计算可开数量
    if(totalAmt!=this.totalAmount) {
      this.totalAmount = totalAmt
      // console.info('this.totalAmount===',this.totalAmount)
      this.$eventBus.notify({key:'POSITION_TOTAL_AMOUNT'}, this.totalAmount)
    }
    if(totalAmtLong!=this.totalAmountLong) {
      this.totalAmountLong = totalAmtLong
      // console.info('this.totalAmount===',this.totalAmount)
      this.$eventBus.notify({key:'POSITION_TOTAL_AMOUNT_LONG'}, this.totalAmountLong)
    }
    if(totalAmtShort!=this.totalAmountShort) {
      this.totalAmountShort = totalAmtShort
      this.$eventBus.notify({key:'POSITION_TOTAL_AMOUNT_SHORT'}, this.totalAmountShort)
    }
    // console.info('this.totalAmountShort===',this.totalAmountShort)
    // console.info('this.totalAmountLong===',this.totalAmountLong)
    //单仓、双仓逐仓
    if(this.LPCalculationType[v.positionSide][v.marginType] == 1){
      this.LPCalculation1(v)
    }
    // 改变平仓数量
    this.setCloseAmount(v)

    //双仓全仓
    if(this.LPCalculationType[v.positionSide][v.marginType] == 2){
      let s = v.symbol , ps =  '_' + v.positionSide , absPa = Math.abs(v.positionAmt);//比较的是绝对值
      if(!this.pSymbols.includes(s)){
        this.pSymbols.push(s)
      }
      this.pSymbolsMap[s+ps]={absPa:absPa,pos:v}//存储当前数量绝对值和仓位对象
    }

  })

  //全仓保证金比率 = 各仓位的maintMargin字段之和 /（各仓位的unrealizedProfit之和+全仓账户余额 crossWalletBalance)
  this.crossMaintMarginRate = this.accDiv(totalMaintMargin,this.accAdd(totalUnrealizedProfit,this.crossWalletBalance))
  this.crossMaintMarginRate = Number(this.crossMaintMarginRate * 100).toFixed(2) + '%'
  this.records = records;


  //双仓全仓强平价格计算，由于全仓下同一symbol多空仓位强平价格一致，用map遍历完后再计算
  this.pSymbols.length > 0 && this.LPCalculation2();

}
//计算维持保证金首先获取比率、速算数等信息
root.methods.getCalMaintenanceArgs = function(notional=0){
  let bracketSingle = {};

  if(notional == 0){
    bracketSingle = this.leverageBracket.find(v=> v.notionalCap == 0)
    return bracketSingle;
  }
  //notional > notionalFloor && notional <= notionalCap 可推出 notional - notionalFloor > 0  && notional - notionalCap <= 0
  for (let i = 0; i < this.leverageBracket.length; i++) {
    let v = this.leverageBracket[i];
    let floorStep = this.accMinus(notional,v.notionalFloor || 0)
    let capStep = this.accMinus(notional,v.notionalCap || 0)

    if(floorStep > 0 && capStep <= 0){
      bracketSingle = v;
      bracketSingle.inx = i//用于强平价格降档计算
      break;
    }
  }

  return bracketSingle;
}
//类型1的强平价格
root.methods.LPCalculation1 = function (pos = {}){

  let LPCalculation1 = 0,size = pos.positionAmt || 0,ep = pos.entryPrice || 0,
      // 1.全仓模式下， WB 为 crossWalletBalance，由于目前只有一个symbol，暂时TMM=0，UPNL=0
      // 2.逐仓模式下，WB 为逐仓仓位的 isolatedWalletBalance，TMM=0，UPNL=0,isolatedWalletBalance = isolatedMargin - unrealizedProfit,正好和逐仓保证金相等
      WB = pos.marginType == "cross" ? this.crossWalletBalance : pos.securityDeposit;

  //从 Bracket 最高档开始逐层计算 LP，若计算出 LP 使得：floor < abs(B*LP) <= cap，则获得 LP，否则继续降档计算
  //若始终没有匹配值使得 floor < abs(B*LP) <= cap，则降至最后一档算出结果即为最终值
  for (let i = 0; i < this.leverageBracket.length; i++) {
    let v = this.leverageBracket[i],cum = v.notionalCum || 0,mmr = v.maintMarginRatio || 0

    //调用对应的计算方法： LPCalculation1BOTH LPCalculation1LONG LPCalculation1SHORT
    let paras = [WB,size,ep,cum,mmr] , LP = this["LPCalculation1"+pos.positionSide](paras),
        BLP = this.accMul(Math.abs(size),LP);//abs(B*LP)
        BLP = Math.abs(BLP);
    let floorStep = this.accMinus(BLP,v.notionalFloor || 0), capStep = this.accMinus(BLP,v.notionalCap || 0)

    if((floorStep > 0 && capStep <= 0) || i == this.leverageBracket.length - 1){
      LPCalculation1 = LP;
      break;
    }
  }

  //计算得出的强平价格
  pos.LPCalculation1 = LPCalculation1;

}
//1 单仓 LPCalculation1BOTH = LPCalculation1 + "BOTH"(positionSide)
root.methods.LPCalculation1BOTH = function (paras){
  let [WB,size,ep,cum,mmr] = paras , B = Math.abs(size)
  let molecular = this.chainCal().accAdd(WB,cum).accMinus(this.accMul(size,ep))//WB + cum_B - (size * EP_B)
  let denominator = this.chainCal().accMul(B,mmr).accMinus(size)//B * MMR_B -  size
  // console.log()
  return this.accDiv(molecular,denominator)
}
//1 双仓 - 多仓
root.methods.LPCalculation1LONG = function (paras){
  let [WB,size,ep,cum,mmr] = paras , L = Math.abs(size);
  let molecular = this.chainCal().accAdd(WB,cum).accMinus(this.accMul(L,ep))//WB + cum_L - (L * EP_L)
  let denominator = this.chainCal().accMul(L,mmr).accMinus(L)//L * MMR_L - L
  return this.accDiv(molecular,denominator)
}
//1 双仓 - 空仓
root.methods.LPCalculation1SHORT = function (paras){
  let [WB,size,ep,cum,mmr] = paras , S = Math.abs(size);
  let molecular = this.chainCal().accAdd(WB,cum).accAdd(this.accMul(S,ep))//WB + cum_S + (S * EP_S)
  let denominator = this.chainCal().accMul(S,mmr).accAdd(S)//S * MMR_S + S
  return this.accDiv(molecular,denominator)
}
//类型2的强平价格
root.methods.LPCalculation2 = function () {

  let leverageBracket = this.leverageBracket;

  //由于全仓模式下，一个 symbol 下多空仓位强平价格一致，可将最终结果存储到 this[s+"_LPCalculation2"]
  this.pSymbols.map((s,si)=>{
    let LPCalculation2 = 0,long = this.pSymbolsMap[s+"_LONG"], short = this.pSymbolsMap[s+"_SHORT"],longPos,shortPos;
      long && (longPos = long.pos); short && (shortPos = short.pos);

    //只有空仓
    if(!longPos && shortPos){
      for (let i = 0; i < leverageBracket.length; i++) {
        let v = leverageBracket[i],cum = v.notionalCum || 0,mmr = v.maintMarginRatio || 0,
            WB = this.crossWalletBalance,size = 0,ep = 0,paras = [],LP = 0

        // if(!longPos && shortPos){
          size = shortPos.positionAmt,ep = shortPos.entryPrice;
          paras = [WB,size,ep,cum,mmr]
          LP = this.LPCalculation1SHORT(paras)//cum_L对应等级cum是0，那公式就和“双仓-逐仓-空仓”一致
        // }

        let SLP = this.accMul(Math.abs(size),LP);//abs(S*LP)
        SLP = Math.abs(SLP);
        let floorStep = this.accMinus(SLP,v.notionalFloor), capStep = this.accMinus(SLP,v.notionalCap)

        if((floorStep > 0 && capStep <= 0) || i == leverageBracket.length - 1){
          LPCalculation2 = LP;
          break;
        }
      }
    }

    //只有多仓
    if(longPos && !shortPos){
      for (let i = 0; i < leverageBracket.length; i++) {
        let v = leverageBracket[i],cum = v.notionalCum || 0,mmr = v.maintMarginRatio || 0,
            WB = this.crossWalletBalance,size = 0,ep = 0,paras = [],LP = 0

        // if(longPos && !shortPos){
          size = longPos.positionAmt,ep = longPos.entryPrice;
          paras = [WB,size,ep,cum,mmr]
          LP = this.LPCalculation1LONG(paras)//cum_S对应等级cum是0，那公式就和“双仓-逐仓-多仓”一致
        // }

        let SIZELP1 = this.accMul(Math.abs(size),LP),SIZEMP = this.accMul(Math.abs(size),this.markPrice);
            SIZELP1 = Math.abs(SIZELP1);SIZEMP = Math.abs(SIZEMP);

        let floorStepL = this.accMinus(SIZELP1,v.notionalFloor || 0), capStepL = this.accMinus(SIZELP1,v.notionalCap || 0),
            floorStepM = this.accMinus(SIZEMP,v.notionalFloor || 0), capStepM = this.accMinus(SIZEMP,v.notionalCap || 0)

        //对比 abs(L*LP1) 与 abs(L*MP) 是否处于同一层级（可理解为二者同时满足floor<abs(L*LP1)、abs(L*MP)<=cap），若是，则 LP1 为最终结果
        if((floorStepL > 0 && capStepL <= 0) && (floorStepM > 0 && capStepM <= 0)){
          LPCalculation2 = LP;
          break;
        }
      }
    }

    //同时存在多空仓
    if(longPos && shortPos){
      let BAL = longPos.bracketArgs,bj = BAL.inx,SIZEL = Math.abs(longPos.positionAmt || 0),epL = longPos.entryPrice,
      SIZES = Math.abs(shortPos.positionAmt || 0),epS = shortPos.entryPrice,LP1 = 0,LP3 = 0,LPCalculation21 = 0,LPCalculation22 = 0;


      for (let j = bj; j < leverageBracket.length; j++) {
        let lv = leverageBracket[j],cumL = lv.notionalCum || 0,mmrL = lv.maintMarginRatio || 0

        //a. 把多仓 MMR&cum 代入强平公式 b. 空仓从最高档开始逐层计算 LP1
        for (let h = 0; h < leverageBracket.length; h++) {
          let sv = leverageBracket[h],cumS = sv.notionalCum || 0,mmrS = sv.maintMarginRatio || 0,
              paras = [SIZEL,epL,cumL,mmrL,SIZES,epS,cumS,mmrS];
          LP1 = this.LPCalculation2LS(paras);
          let SLP1 = this.accMul(SIZES,LP1); SLP1 = Math.abs(SLP1);//abs(S*LP1)
          let floorStep = this.accMinus(SLP1,v.notionalFloor), capStep = this.accMinus(SLP1,v.notionalCap)

          //若计算出LP1 使floor<abs(S*LP1)<=cap，则获得 LP1，否则需再继续降档计算 LP1，直到最后一档或者floor<abs(S*LP1)<=cap
          if((floorStep > 0 && capStep <= 0) || h == leverageBracket.length - 1){
            // LP1 = LP1;
            break;
          }
        }

        //对比 abs(L*LP1) 与 abs(L*MP) 是否处于同一层级，若是，则 LP1 为最终结果；否则多仓bracket 降一档
        //可理解为二者同时满足floor<abs(L或S*LP1)、abs(L或S*MP)<=cap
        let SIZELP1 = this.accMul(SIZEL,LP1),SIZEMP = this.accMul(SIZEL,this.markPrice);
            SIZELP1 = Math.abs(SIZELP1);SIZEMP = Math.abs(SIZEMP);

        let floorStepL = this.accMinus(SIZELP1,lv.notionalFloor), capStepL = this.accMinus(SIZELP1,lv.notionalCap),
            floorStepM = this.accMinus(SIZEMP,lv.notionalFloor), capStepM = this.accMinus(SIZEMP,lv.notionalCap)

        //对比 abs(L*LP1) 与 abs(L*MP) 是否处于同一层级（可理解为二者同时满足floor<abs(L*LP1)、abs(L*MP)<=cap），若是，则 LP1 为最终结果
        if((floorStepL > 0 && capStepL <= 0) && (floorStepM > 0 && capStepM <= 0)){
          LPCalculation2 = LP1;//本步最终得出的强平价格
          break;
        }

      }

      //全仓、双向持仓 且 仓位为净多头，则须在 LP1 的基础上继续计算
      if(SIZEL > SIZES){
        let BAS = shortPos.bracketArgs,cumS = BAS.notionalCum || 0,mmrS = BAS.maintMarginRatio || 0,
            cumL = BAL.notionalCum || 0,mmrL = BAL.maintMarginRatio || 0,
            paras = [SIZEL,epL,cumL,mmrL,SIZES,epS,cumS,mmrS];
        LP3 = this.LPCalculation2LS(paras);

      //TODO:接下来要和LP1对比取值

      }

    }
  });
}
//2 双仓 - 多仓
root.methods.LPCalculation2LONG = function (paras){

}
//2 双仓 - 空仓
root.methods.LPCalculation2SHORT = function (paras){

}
//2 双仓 - 多空都有
root.methods.LPCalculation2LS = function (paras){

}
// 自动减仓持仓ADL队列估算
root.methods.getAdlQuantile = function () {
  this.$http.send("GET_ADL_QUANTILE", {
    bind: this,
    query: {
      timestamp: this.serverTime
    },
    callBack: this.re_getAdlQuantile,
    errorHandler: this.error_getAdlQuantile
  })
}
// 自动减仓持仓ADL队列估算返回
root.methods.re_getAdlQuantile = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data || !data.data) return

  //TODO:list中每个币对只返回一个对象吗？
  this.currSAdlQuantile = data.data.find(v=>v.symbol==this.$globalFunc.toOnlyCapitalLetters(this.currSymbol));

  if(this.records.length > 0 && this.currSAdlQuantile)
    this.addAdlQuantile(this.currSAdlQuantile,this.records)
  // console.log('this is getAdlQuantile',data);
}
// 自动减仓持仓ADL队列估算返回出错
root.methods.error_getAdlQuantile = function (err) {
  console.warn("自动减仓持仓ADL队列估算返回出错！", err)
}
//仓位添加自动减仓数据
root.methods.addAdlQuantile = function(currSAdlQuantile,records){

  let indicatorLight = currSAdlQuantile.adlQuantile.json;
  records.map(v=>{
    v.adlQuantile = indicatorLight[v.positionSide] + ''
  })
  this.records = records;

  // console.log('currSAdlQuantile,records',currSAdlQuantile,records);
}

root.methods.openPositionMarket = function (item) {
  this.positionInfo = item || {}
  this.popOpenMarket = true
}

// 市价
root.methods.marketPrice = function () {
  this.marketPriceClick = true
  let item = this.positionInfo || {}
  // var v = ipt.value;//获取input的值
  let params = {
    leverage: this.$store.state.leverage,
    positionSide: item.positionSide,
    quantity: Math.abs(item.positionAmt),
    orderSide: (item.positionAmt<0) ? 'BUY':'SELL',
    stopPrice: null,
    symbol: "BTCUSDT",
    orderType: "MARKET",
  }
  this.$http.send("POST_ORDERS_POSITION", {
    bind: this,
    params: params,
    callBack: this.re_marketPrice,
    errorHandler: this.error_marketPrice
  })
}
// 获取记录返回，类型为{}
root.methods.re_marketPrice = function (data) {
  if(data.code == '303' && data.errCode == '2019') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '杠杆账户余额不足';//当前无仓位，不能下单
    return
  }
  if(data.code == '303' && data.errCode == '4061') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '订单的持仓方向和用户设置不一致';//订单的持仓方向和用户设置不一致
    return
  }
  if(data.code == '303' && data.errCode == '4077') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '订单的持仓方向和用户设置不一致';//订单的持仓方向和用户设置不一致
    return
  }
  if(data.code == 303) {
    this.popType = 0;
    this.promptOpen = true;
    this.popText = '下单失败';
    return
  }
  if(data.code == 302) {
    this.popType = 0;
    this.promptOpen = true;
    this.popText = '参数错误';
    return
  }
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.popOpen = false
  this.getPositionRisk()
  this.$eventBus.notify({key:'GET_BALANCE'})
  this.promptOpen = true;
  this.marketPriceClick = false
  // 关闭弹框
  this.closePopMarket()
  if(data.data.status == 'NEW') {
    this.popType = 1;
    this.popText = '下单成功';
    return
  }
  if(data.data.status == 'PARTIALLY_FILLED') {
    this.popType = 1;
    this.popText = '您的订单成交了一部分';
    return
  }
  if(data.data.status == 'FILLED') {
    this.popType = 1;
    this.popText = '完全成交';
    return
  }
  if(data.data.status == 'CANCELED') {
    this.popType = 1;
    this.popText = '自己撤销的订单';
    return
  }
  if(data.data.status == 'EXPIRED') {
    this.popType = 0;
    this.popText = '您的订单已过期';
    return
  }
  if(data.data.status == 'NEW_INSURANCE') {
    this.popType = 1;
    this.popText = '风险保障基金(强平)';
    return
  }
  if(data.data.status == 'NEW_ADL') {
    this.popType = 1;
    this.popText = '自动减仓序列(强平)';
    return
  }
}
// 限价
root.methods.checkPrice = function (item) {
  // let markPrice1 = document.getElementById('inputMarginPrice1').value;//获取input的节点bai
  // console.info('this is markPrice 618', item.iptMarkPrice)
  let params = {
    leverage: this.$store.state.leverage,
    positionSide: item.positionSide,
    price: item.iptMarkPrice,
    quantity: Math.abs(item.positionAmt),
    orderSide: (item.positionAmt > 0) ? 'SELL':'BUY',
    // stopPrice: null,
    symbol: "BTCUSDT",
    timeInForce: this.effectiveTime,
    orderType: "LIMIT",
    // workingType: null,
  }
  if(item.positionSide == 'BOTH'){
    Object.assign(params, {reduceOnly: true});
  }
  this.checkPriceClick = true
  this.$http.send("POST_ORDERS_POSITION", {
    bind: this,
    params: params,
    callBack: this.re_checkPrice,
    errorHandler: this.error_checkPrice
  })
}
// 获取记录返回，类型为{}
root.methods.re_checkPrice = function (data) {
  this.checkPriceClick = false
  if(data.code == '303' && data.errCode == '2019') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '杠杆账户余额不足';//当前无仓位，不能下单
    return
  }

  if(data.code == '303' && data.errCode == '4061') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '订单的持仓方向和用户设置不一致';//订单的持仓方向和用户设置不一致
    return
  }
  if(data.code == '303' && data.errCode == '4077') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '订单的持仓方向和用户设置不一致';//订单的持仓方向和用户设置不一致
    return
  }
  if(data.code == 303) {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '下单失败';
    return
  }
  if(data.code == 302) {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '参数错误';
    return
  }
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$eventBus.notify({key:'GET_ORDERS'})
  this.$eventBus.notify({key:'GET_BALANCE'})
  this.getPositionRisk()
  this.promptOpen = true;
  this.priceCheck[data.data.positionSide] = data.data.price

  // console.info('this.priceCheck===',this.priceCheck)

  // this.priceCheck = localStorage.setItem('PRICE_CHECK',data.data.price);
  //
  // if (this.priceCheck != 0) {
  //   this.priceCheck = JSON.parse(localStorage.getItem('PRICE_CHECK'));
  // }
  this.order = data.data

  if(data.data.status == 'NEW') {
    this.popType = 1;
    this.popText = '下单成功';
    return
  }
  if(data.data.status == 'PARTIALLY_FILLED') {
    this.popType = 1;
    this.popText = '您的订单成交了一部分';
    return
  }
  if(data.data.status == 'FILLED') {
    this.popType = 1;
    this.popText = '完全成交';
    return
  }
  if(data.data.status == 'CANCELED') {
    this.popType = 1;
    this.popText = '自己撤销的订单';
    return
  }
  if(data.data.status == 'EXPIRED') {
    this.popType = 0;
    this.popText = '您的订单已过期';
    return
  }
  if(data.data.status == 'NEW_INSURANCE') {
    this.popType = 1;
    this.popText = '风险保障基金(强平)';
    return
  }
  if(data.data.status == 'NEW_ADL') {
    this.popType = 1;
    this.popText = '自动减仓序列(强平)';
    return
  }

}
root.methods.error_checkPrice = function (err){
  console.info('err==',err)
}
//一键平仓
root.methods.closePositions = function () {
  this.popOpen = true
}
//一键平仓
root.methods.closePop = function () {
  this.popOpen = false
}

// 确认全平
root.methods.ensurePop = async function () {
  this.records.forEach(v=>{
    this.marketPrice(v)
  })
  this.closePop()
}

// 获取记录出错
root.methods.error_marketPrice = function (err) {
  console.warn("充值获取记录出错！", err)
}


//取消平仓
root.methods.cancelThePosition = async function () {
  let params = {
    orderId: this.order.orderId,
    symbol: this.order.symbol,
    timestamp: this.order.updateTime
  }
  await this.$http.send('GET_CAPITAL_CANCEL', {
    bind: this,
    params: params,
    callBack: this.re_cancelOrder,
    errorHandler: this.error_cancelOrder
  })
}
// 返回
root.methods.re_cancelOrder = function (data) {
  // this.$eventBus.notify({key: 'CANCEL_ORDER'})
  this.priceCheck[data.data.positionSide] = 0
  this.promptOpen = true;
  this.popType = 1;
  this.popText = '取消成功';
  this.getPositionRisk()
  this.$eventBus.notify({key:'GET_ORDERS'})


}
root.methods.error_cancelOrder = function (err) {
  console.warn("撤单错误！", err)
}

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

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

export default root



