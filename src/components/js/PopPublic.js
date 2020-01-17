const root = {}

root.name = 'PopPublic'
root.props = {}
//是否开启选择切换
root.props.showPicker = {
  type: Boolean,
  default: false
}
//错误码
root.props.GACodeWA = {
  type: String,
  default: ''
}
//关闭弹窗
root.props.popClose = {
  type: Function,
  default: ()=>_
}
//确认
root.props.popConfrim = {
  type: Function,
  default: ()=>_
}

root.data = function () {
  return {

    index:true,
    item:true,
    activeIndex: -1, //激活
    recharge: false,
    withdrawals: false,
    pub_lic_if:true,
    pub_lic:true,
    getVerificationCode: false,
    getVerificationCodeInterval: null,
    getVerificationCodeCountdown: 60,
    clickVerificationCodeButton: false,

    getEmailVerificationCode: false,
    getEmailVerificationCodeInterval: null,
    getEmailVerificationCodeCountdown: 60,
    clickEmailVerificationCodeButton: false,

    // 点击状态  1为手机验证   2为谷歌验证
    picked:1,

    //错误码
    // GACodeWA: ''


  }
}

root.created = function () {

}

root.components = {}

root.computed = {}

root.methods = {}

// 开始获取手机验证
root.methods.beginCountDownVerification = function () {
  this.getVerificationCode = true
  this.clickVerificationCodeButton = true
  this.verificationCodeWA = ''
  this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
  this.getVerificationCodeInterval = setInterval(() => {
    this.getVerificationCodeCountdown--
    if (this.getVerificationCodeCountdown <= 0) {
      this.getVerificationCode = false
      this.getVerificationCodeCountdown = 60
      clearInterval(this.getVerificationCodeInterval)
    }
  }, 1000)
}

// 结束获取手机验证码
root.methods.endCountDownVerification = function () {
  this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
  this.getVerificationCode = false
  this.getVerificationCodeCountdown = 60
}

// 点击发送验证码
root.methods.click_getVerificationCode = function () {
  this.beginCountDownVerification()

}

root.methods.re_getVerificationCode = function (data) {
  if (typeof data === 'string') data = JSON.parse(data)
  if (data.errorCode) {

    this.endCountDownVerification()
  }
}

// 取消按钮
root.methods.btnCancle = function () {
  this.pub_lic = false
  this.$props.popClose();
}

//确认按钮
root.methods.btnConfirm = function () {
  this.pub_lic = false
  this.$props.popConfrim();
}

// 手机 谷歌验证切换
root.methods.open_mob = function (index) {
  this.picked = index
}


export default root
