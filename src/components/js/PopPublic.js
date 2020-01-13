const root = {}

root.name = 'PopPublic'


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
    classStyle:1,

    //错误码
    GACodeWA: ''


  }
}

root.created = function () {

}

root.components = {}

root.computed = {}

root.computed.showPicker = function () {
  if (this.loginType === 0) {
    return false
  }
  if (this.loginType === 1) {
    return this.bindGA && this.bindMobile
  }
  return false
}

root.methods = {}

root.methods.closeClick = function () {
  this.pub_lic = false
}

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

// 开始获取邮箱验证码
root.methods.beginEmailCountDownVerification = function () {
  this.getEmailVerificationCode = true
  this.clickEmailVerificationCodeButton = true
  this.emailVerificationCodeWA = ''
  this.getEmailVerificationCodeInterval && clearInterval(this.getEmailVerificationCodeInterval)
  this.getEmailVerificationCodeInterval = setInterval(() => {
    this.getEmailVerificationCodeCountdown--
    if (this.getEmailVerificationCodeCountdown <= 0) {
      this.getEmailVerificationCode = false
      this.getEmailVerificationCodeCountdown = 60
      clearInterval(this.getEmailVerificationCodeInterval)
    }
  }, 1000)
}

// 结束获取邮箱验证码
root.methods.endEmailCountDownVerification = function () {
  this.getEmailVerificationCodeInterval && clearInterval(this.getEmailVerificationCodeInterval)
  this.getEmailVerificationCode = false
  this.getEmailVerificationCodeCountdown = 60
}


// 点击发送验证码
root.methods.click_getVerificationCode = function () {
  this.beginCountDownVerification()
  // 发送
  let params = {
    "type": 'mobile',
    "purpose": "resetLoginPassword",
  }
  this.$http.send('POST_VERIFICATION_CODE', {
    bind: this,
    params: params,
    callBack: this.re_getVerificationCode
  })
}


root.methods.re_getVerificationCode = function (data) {
  if (typeof data === 'string') data = JSON.parse(data)
  if (data.errorCode) {
    switch (data.errorCode) {
      case 1:
        this.pswWA = this.$t('pswWA_1')
        break;
      case 2:
        this.pswWA = this.$t('pswWA_2')
        break;
      case 3:
        this.pswWA = this.$t('pswWA_3')
        break;
      case 4:
        this.pswWA = this.$t('pswWA_4')
        break;
      default:
        this.pswWA = this.$t('canNotUse')
    }
    this.endCountDownVerification()
  }
}

// 取消按钮
root.methods.but_cancel = function () {
  this.pub_lic = false
}

//确认按钮
root.methods.click_send = function () {
  this.pub_lic = false
}

// 手机 谷歌验证切换
root.methods.open_mob = function (index) {
  this.classStyle = index
}


// //谷歌验证切换
// root.methods.open_ge = function (index, item) {
//   console.log('open_ge=====33333333',index)
//   this.recharge = false
//   this.activeIndex !== index && (this.withdrawals = true)
//   if (this.activeIndex === index) {
//     this.withdrawals = !this.withdrawals
//     if (this.withdrawals === false) {
//       this.activeIndex = -1
//       return
//     }
//   }
//   this.activeIndex = index
// }



export default root
