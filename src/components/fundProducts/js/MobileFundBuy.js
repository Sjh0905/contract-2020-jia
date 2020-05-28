const root = {}
root.name = 'mobileFundProducts'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    // 申购input框内
    inputUserAmount: 1,
    //每份的USDT数量
    eachAmount:100,
    //发行份数
    issueCopies:300,
    //剩余份数
    // remainingCopies:0,
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {

}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
root.computed.remainingCopies = function () {
  let remainingCopies = this.accMinus(this.issueCopies,this.inputUserAmount || 0)
  return remainingCopies > 0 ? remainingCopies : 0
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
root.methods.inputUserAmountInput = function () {
  // this.inputUserAmount = this.inputNumbers(this.inputUserAmount)
  // this.inputUserAmount = this.inputUserAmount
  // this.remainingCopies = this.accMinus(this.issueCopies,this.inputUserAmount || 0)
}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

/*---------------------- 加法运算 begin ---------------------*/
root.methods.accAdd = function (num1, num2) {
  num1 = parseFloat(num1)
  num2 = parseFloat(num2)
  return this.$globalFunc.accAdd(num1, num2)
}
/*---------------------- 加法运算 end ---------------------*/

/*---------------------- 减法运算 begin ---------------------*/
root.methods.accMinus = function (num1, num2) {
  num1 = parseFloat(num1)
  num2 = parseFloat(num2)
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
