const root = {}

root.name = 'PopPublic'
root.props = {}
//加载中
root.props.loading = {
  type: Boolean,
  default: false
}
//是否绑定手机
root.props.bindMobile = {
  type: Boolean,
  default: false
}
//是否绑定谷歌
root.props.bindGA = {
  type: Boolean,
  default: false
}
//是否绑定邮箱
root.props.bindEmail = {
  type: Boolean,
  default: false
}
//谷歌错误码
root.props.GACodeWA = {
  type: String,
  default: ''
}
//手机错误码
root.props.verificationCodeWA = {
  type: String,
  default: ''
}
//邮箱错误码
root.props.emailVerificationCodeWA = {
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
//获取验证码
root.props.popGetCode = {
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

    // 点击状态  1为手机验证   2为谷歌验证  3为邮箱验证
    picked:this.bindEmail ? 3 :(this.bindGA ? 2 : 1),
    code:'',

    //错误码
    // GACodeWA: ''


  }
}

root.created = function () {
  this.picked = this.bindEmail ? 3 :(this.bindGA ? 2 : 1)
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
  this.$props.popGetCode()
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
  // this.pub_lic = false
  this.$props.popConfrim(this.picked,this.code);
  // setTimeout(()=>{
  //   this.verificationCodeWA = ''
  // },1000)
}

// 手机 谷歌验证切换
root.methods.open_mob = function (index) {
  this.picked = index
}


export default root
