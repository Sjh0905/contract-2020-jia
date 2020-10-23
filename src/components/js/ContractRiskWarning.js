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
  return {
    invitreCodeInput: '',
  }
}
root.computed = {}
root.computed.show = function () {
  return this.switch
}
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
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
    if (this.invitreCodeInput != '') {
      this.getInviteCode()
    }
    // history.go(0)
    this.$router.push({'path':'/index/mobileTradingHallDetail'})
  }
}

root.methods.getInviteCode = function () {
  this.$http.send('GET_INVITE_CODE',{
    bind: this,
    urlFragment: this.invitreCodeInput,
    callBack: this.re_getInviteCode
  })
}
root.methods.re_getInviteCode = function () {
  //检测data数据是JSON字符串转换JS字符串
  typeof data === 'string' && (data = JSON.parse(data))
  if (data.errorCode == 2) {
    this.popType = 0;
    this.popText = ' 邀请关系建立失败';
    this.promptOpen = true;
    return;
  }
  if (data.errorCode == 3) {
    this.popType = 0;
    this.popText = ' 邀请人不存在';
    this.promptOpen = true;
    return;
  }
}

export default root
