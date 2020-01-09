const root = {}
root.name = 'MobileAssetWithdrawDetailAddress'

root.props = {}

root.data = function () {
  return {
    // 加载中
    loading: false,


    // 备注内容
    name: '',
    // 地址内容
    address: '',
    // 备注错误提示
    nameWA: '',
    // 地址错误提示
    addressWA: '',
  }
}



root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}

root.created = function () {
  this.$store.commit('changeMobileHeaderTitle', '提现地址');
}

root.computed = {}
// 跳到提现页，此页的数据获取
root.computed.mobileRechargeRecordData = function () {
  return this.$store.state.mobileRechargeRecordData;
}



root.methods = {};

root.methods.checkAddressData = function () {
  if(this.name != '' && this.address != '') {
    this.sendAddressData();
  }
  if(this.name === '') {
    this.nameWA = '请输入备注'
  }
  if(this.address === '') {
    this.addressWA = '请输入地址'
  }
}


// 发送请求给后台
root.methods.sendAddressData = function () {
  this.$http.send("POST_WITHDRAW_ADDRESS", {
    bind: this,
    params: {
      currency: this.currency
    },
    callBack: this.re_sendAddressData,
    errorHandler: this.error_sendAddressData,
  })

}

root.methods.re_sendAddressData = function (data) {
  console.log('成功了',data)
  // this.$router.push('/index/mobileAsset/mobileAssetWithdrawDetail')
}

root.methods.error_sendAddressData = function (err) {
  console.log('报错了',err)
}

// blur 检测备注是否已填
root.methods.inputCheckName = function () {
  if(this.name === '') {
    this.nameWA = '请输入备注'
  }
  if(this.name != '') {
    this.nameWA = ''
  }
}

// blur 检测地址是否已填
root.methods.inputCheckAddress = function () {
  if(this.address === '') {
    this.addressWA = '请输入地址'
  }
  if(this.address != '') {
    this.addressWA = ''
  }
}




export default root
