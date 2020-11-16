const root = {}
root.name = 'ContractRiskWarning'
// 此组件需要一个 v-on:close
/*---------------------- 属性 ---------------------*/
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

/*---------------------- data ---------------------*/

root.data = function () {
  return {}
}
root.computed = {}
root.computed.show = function () {
  return this.switch
}
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
// 检验是否是APP
root.computed.isApp = function () {
  return this.$route.query.isApp ? true : false
}

/*---------------------- 方法 ---------------------*/

root.methods = {}

root.methods.closeClick = function () {
  this.$emit('close')
  this.$router.push('index/home')
}


root.methods.contractOpen = function () {
  window.location.replace(this.$store.state.contract_url + 'index/tradingHall?symbol=KK_USDT');
}
//
// root.methods.openContractH5 = function () {
//   // window.location.replace(this.$store.state.contract_url + 'index/mobileTradingHallDetail');
// }

// 合约首次风险提示弹窗确认按钮
root.methods.openContractH5 = function () {
  // this.popWindowContractRiskWarning = false
  // return
  this.$http.send('POST_MANAGE_TIME',{
    bind: this,
    query: {},
    callBack: this.re_openContractH5
  })
}
root.methods.re_openContractH5 = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if (data.code == 200) {

    if(this.isApp){
      this.$router.go(-1);
      return;
    }

    // history.go(0)
    this.$router.push({'path':'/index/mobileTradingHallDetail'})
  }
}

export default root
