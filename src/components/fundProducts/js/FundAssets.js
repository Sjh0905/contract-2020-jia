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
  this.openFundPurchase = true
  this.closeFundDitail()
}

// 跳转基金详情页
root.methods.gotoDetails = function (item) {
  console.log('跳转基金详情页（弹框形式）')
  this.openFundDitail = true
  console.info('item=======',item)
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
  this.purchaseList = data.dataMap.list
  this.totalBalance = data.dataMap.balance
  this.newQuantity = data.dataMap.quantity
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








/*---------------------- 加法运算 begin ---------------------*/
root.methods.accAdd = function (num1, num2) {
  num1 = parseFloat(num1)
  num2 = parseFloat(num2)
  return this.$globalFunc.accAdd(num1, num2)
}
/*---------------------- 加法运算 end ---------------------*/

export default root
