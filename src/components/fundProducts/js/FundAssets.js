const root = {}
root.name = 'FundAssets'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../../vue/Loading'], resolve),
  'PopupWindow': resolve => require(['../../vue/PopupWindow'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    selectedType: 1,  // 1:申购中  2：收益中  3：已结束
    // 申购中
    purchaseList:[],
    // 收益中
    incomeList:[],
    // // 已结束
    hasEndedList:[],
    totalBalance:0, // 总资产
    newQuantity:0, // 最新收益
    loading:true,
    openFundDitail:false, //基金详情弹窗
    openFundPurchase:false, //本期申购弹窗
    dataList:{},
    drawNumbers:[],
    prices:0,
    nonce:'',
    currentBuyList:[],// 本期申购列表
    limit: 30,
    lastId:0,
    ajaxWithdrawFlag:false,
    isShowGetMoreRecord:false,
    blockContractUrl:'',

    projectId:'',
    period:''
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  // 申购中
  this.getPurchase()
  // 收益中
  this.getIncome()
  // 已结束
  this.getHasEnded
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

// 关闭本期申购弹窗
root.methods.closeFundPurchase = function () {
  this.openFundPurchase = false
}

// 关闭基金详情弹窗
root.methods.closeFundDitail = function () {
  this.openFundDitail = false
}

root.methods.goTopPriodDetails = function () {
  // 打开申购弹框
  this.openFundPurchase = true
  // 关闭详情弹框
  this.closeFundDitail()
  // 调取本期申购接口
  this.getTkfTickets()
}

root.methods.getTkfTickets = function () {
  if(this.ajaxWithdrawFlag===true)return
  this.$http.send('GET_TKF_TICKETS',{
    bind:this,
    query:{
      projectId: this.projectId,
      period: this.period,
      currency:'USDT',
      limit:this.limit,
      id:this.lastId
    },
    callBack:this.re_getTkfTickets,
    errorHandler:this.error_getTkfTickets
  })
}
root.methods.re_getTkfTickets = function (data) {
  typeof (data)=='string'&& (data = JSON.parse(data))
  this.ajaxWithdrawFlag = false
  if (!data || data.dataMap.list.length === 0) {
    this.loading=false
    this.ajaxWithdrawFlag = true
    return
  }
  if (data.dataMap.list.length < this.limit){
    this.isShowGetMoreRecord = false
  } else {
    this.lastId += this.limit;
  }
  console.info(data)
  this.currentBuyList = data.dataMap.list
  this.nonce = data.dataMap.nonce.substring(data.dataMap.nonce.length-3)
  this.blockContractUrl = data.dataMap.blockContractUrl
  // this.ajaxWithdrawFlag = false
}
root.methods.error_getTkfTickets = function (err) {
}



// 跳转基金详情页
root.methods.gotoDetails = function (item) {
  console.log('跳转基金详情页（弹框形式）')
  this.openFundDitail = true
  this.projectId = item.projectId
  this.period = item.period
  this.dataList = item
  this.viewDetails(item)
}

root.methods.viewDetails = function (item) {
  this.$http.send('TKF_PREDICT_RECORD_DETAIL',{
    bind:this,
    params:{
      participateTime: item.purchaseTime,
      periodNumber: item.period,
      projectId: item.projectId,
      ticketStatus: item.status
    },
    callBack:this.re_viewDetails,
    errorHandler:this.error_viewDetails,
  })
}
root.methods.re_viewDetails = function (data) {
  typeof(data)=='string'&& (data=JSON.parse(data))
  if(!data)return
  this.drawNumbers = data.dataMap.presaleNo
  this.prices = data.dataMap.prices

  if(this.$route.query.selectedType != 1 && data.dataMap.nonce) {
    this.nonce = data.dataMap.nonce.substring(data.dataMap.nonce.length-3)
  }else {
    this.nonce = '未开奖'
  }
  // let disLength = this.nonce.length;
  // this.nonce1 = this.nonce.substring(disLength-3);
  // console.info('nonce1======',this.nonce1)
}
root.methods.error_viewDetails = function (err) {
  console.info(err)
}

// 切换理财状态
root.methods.getAssetStatus = function (type) {
  this.selectedType = type
  // 申购中
  if(type === 1){
    this.getPurchase()
    return
  }
  // 收益中
  if(type === 2){
    this.getIncome()
    return
  }
  // 已结束
  if(type === 3){
    this.getHasEnded()
    return
  }
}

// 申购中
root.methods.getPurchase = function () {
  this.$http.send('TKF_FINANCIAL_RECORDS', {
    bind: this,
    query:{
      status: 'APPLY',

    },
    callBack: this.re_getPurchase,
    errorHandler:this.error_getPurchase
  })
}
root.methods.re_getPurchase = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data)return
  this.purchaseList = data.dataMap.list || []
  this.totalBalance = data.dataMap.balance || 0
  this.newQuantity = data.dataMap.quantity || 0
  this.loading = false

}
root.methods.error_getPurchase = function (err) {
  console.log('err=====',err)
}

// 收益中
root.methods.getIncome = function (){
  this.$http.send('TKF_FINANCIAL_RECORDS',{
    bind:this,
    query:{
      status: 'PROCESSING',
    },
    callBack:this.re_getIncome,
    errorHandler:this.error_getIncome
  })
}
root.methods.re_getIncome = function (data){
  typeof(data) == 'string' && (data = JSON.parse(data))
  if(!data)return
  this.incomeList = data.dataMap.list
  this.totalBalance = data.dataMap.balance
  this.loading = false
}
root.methods.error_getIncome = function (err){
  console.warn('err====',err)
}

// 已结束
root.methods.getHasEnded = function () {
  this.$http.send('TKF_FINANCIAL_RECORDS',{
    bind:this,
    query:{
      status: 'END',
    },
    callBack:this.re_getHasEnded,
    errorHandler:this.error_getHasEnded
  })
}
root.methods.re_getHasEnded = function (data){
  typeof (data) == 'string' && (data= JSON.parse(data))
  if(!data)return
  this.hasEndedList = data.dataMap.list
  this.loading = false
}
root.methods.error_getHasEnded = function (err) {
}




// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD hh:mm:ss')
}

/*---------------------- 加法运算 begin ---------------------*/
root.methods.accAdd = function (num1, num2) {
  num1 = parseFloat(num1)
  num2 = parseFloat(num2)
  return this.$globalFunc.accAdd(num1, num2)
}
/*---------------------- 加法运算 end ---------------------*/

export default root
