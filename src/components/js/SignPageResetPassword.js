const root = {}
root.name = 'SignPageResetPassword'

// import '../../../static/verify-master/js/verify'


root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'MobileCheckbox': resolve => require(['../mobileVue/MobileCompentsVue/MobileCheckbox'], resolve),
  'RegisterTopBar': resolve => require(['../vue/RegisterTopBar'], resolve),
  'PopPublic': resolve => require(['../vue/PopPublic'], resolve),
}

root.data = function () {
  return {
    loading: true,

    psw: '',
    pswWA: '',

    pswConfirm: '',
    pswConfirmWA: '',

    verificationCode: '',
    verificationCodeWA: '',

    emailVerificationCode: '',
    emailVerificationCodeWA: '',


    getVerificationCode: false,
    getVerificationCodeInterval: null,
    getVerificationCodeCountdown: 60,
    clickVerificationCodeButton: false,

    getEmailVerificationCode: false,
    getEmailVerificationCodeInterval: null,
    getEmailVerificationCodeCountdown: 60,
    clickEmailVerificationCodeButton: false,


    bindGA: false,
    bindMobile: false,
    bindEmail: false,

    picked: '',

    GACode: '',
    GACodeWA: '',

    sending: false,

    loginType: 0, // 手机找回为0,邮箱找回为1

    // 2018-07-30 h5增加focus效果
    newPswFocus: false,
    newConfirmPswFocus: false,
    gaCodeFocus: false,
    verificationFocus: false,
    emailVerificationFocus: false,

    //二次验证弹窗是否显示
    verificationOpen:false,
  }
}


root.created = function () {
  this.$store.commit('changeMobileHeaderTitle', '重置密码');
  // 如果没有带参数
  if (!this.$route.query.email && !this.$route.query.mobile) {
    this.$router.push({name: 'findBackPsw'})
  }

  if (this.$route.query.email) {
    this.loginType = 1
  }
  if (this.$route.query.mobile) {
    this.loginType = 0
  }

  this.loading = false


  // 发送验证
  this.$http.send('VERIFYING_LOGIN_STATE', {
    bind: this,
    params: {
      email: this.$route.query.email,
      mobile: this.$route.query.mobile
    },
    callBack: this.re_verifying_login_state,
  })

}


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

// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}

root.methods = {}
// h5用户input框focus方法
root.methods.focusPsw = function () {
  this.newPswFocus = true
  this.pswWA = ''
}

root.methods.focusPswConfirm = function () {
  this.newConfirmPswFocus = true
  this.pswConfirmWA = ''
}

root.methods.focusGACode = function () {
  this.gaCodeFocus = true
  this.GACodeWA = ''
}

root.methods.focusVerificationCode = function () {
  this.verificationFocus = true
  this.verificationCodeWA = ''
}

root.methods.focusEmailVerificationCode = function () {
  this.emailVerificationFocus = true
  this.emailVerificationCodeWA = ''
}

// h5 邮箱时，两个绑定切换效果
root.methods.changeSelectItemGa = function () {
  this.picked = 'bindGA'
}

root.methods.changeSelectItemMobile = function () {
  this.picked = 'bindMobile'
}

root.methods.changeSelectItemEmail = function () {
  this.picked = 'bindEmail'
}

root.methods.createSlider = function () {


}

root.methods.re_verifying_login_state = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (data.errorCode || data.result === 'FAIL') {
    this.$router.push({name: 'login'})
    return
  }
  // 两者都验证了
  this.bindGA = data.dataMap.ga
  this.bindMobile = data.dataMap.sms
  this.bindEmail = data.dataMap.email

  // 如果是手机绑定的
  if (this.loginType === 0) {
    this.bindEmail && (this.picked = 'bindEmail')
  }

  if (this.loginType === 1) {
    this.bindMobile && (this.picked = 'bindMobile')
    this.bindGA && (this.picked = 'bindGA')
  }

  this.loading = false
}
root.methods.error_verifying_login_state = function (err) {
  console.warn("验证身份出错", err)
}

// 测试输入密码
root.methods.testPsw = function () {
  this.newPswFocus = false;
  if (this.pswConfirm !== '' || this.pswConfirm === this.psw) {
    this.testPswConfirm()
  }
  if (this.psw === '') {
    this.pswWA = ''
    return true
  }
  if (!this.$globalFunc.testPsw(this.psw)) {
    this.pswWA = this.$t('pswWA_0')
    return false
  }
  this.pswWA = ''
  return true
}


// 检测确认密码
root.methods.testPswConfirm = function () {
  this.newConfirmPswFocus = false
  if (this.psw !== this.pswConfirm) {
    this.pswConfirmWA = this.$t('pswConfirmWA')
    return false
  }
  this.pswConfirmWA = ''
  return true
}


// 检测验证码
root.methods.testVerificationCode = function () {
  this.verificationFocus = false
  if (this.picked !== 'bindMobile') {
    this.verificationCodeWA = ''
    return true
  }
  if (this.verificationCode === '') {
    this.verificationCodeWA = ''
    return false
  }
  this.verificationCodeWA = ''
  return true
}


// 检测邮箱验证码
root.methods.testEmailVerificationCode = function () {
  this.emailVerificationFocus = false
  if (this.picked !== 'bindEmail') {
    this.emailVerificationCodeWA = ''
    return true
  }
  if (this.emailVerificationCode === '') {
    this.emailVerificationCodeWA = ''
    return false
  }
  this.emailVerificationCodeWA = ''
  return true
}


// 检测谷歌验证码
root.methods.testGACode = function () {
  this.gaCodeFocus = false
  if (this.picked !== 'bindGA') {
    this.GACodeWA = ''
    return true
  }
  if (this.GACode === '') {
    this.GACodeWA = ''
    return false
  }
  this.GACodeWA = ''
  return true
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


// 点击发送邮箱验证码
root.methods.click_getEmailVerificationCode = function () {
  this.beginEmailCountDownVerification()
  // 发送
  let params = {
    "type": 'email',
    "purpose": "findBackPassword"
  }

  this.$http.send('POST_VERIFICATION_CODE', {
    params: params,
  }).then(({data}) => {
    if (data.errorCode) {
      switch (data.errorCode) {
        case 1:
          this.pswWA = this.$t('emailVerificationCodeWA_2')
          break;
        case 2:
          this.pswWA = this.$t('emailVerificationCodeWA_3')
          break;
        case 3:
          this.pswWA = this.$t('emailVerificationCodeWA_4')
          break;
        case 4:
          this.pswWA = this.$t('emailVerificationCodeWA_5')
          break;
        default:
          this.pswWA = this.$t('canNotUse')
      }

      this.endEmailCountDownVerification()
    }
  }).catch(err => {

  })
}
//开启二次验证弹窗
root.methods.openPopPublic = function () {
  this.verificationOpen = true;
}
//关闭二次验证弹窗
root.methods.closePopPublic = function () {
  this.verificationOpen = true;
}
root.methods.confrimPopPublic = function (picked,code) {
  // this.$props.verificationClose();
  if(picked == 1){
    this.picked = 'bindMobile'
    this.verificationCode = code;
  }
  if(picked == 2){
    this.picked = 'bindGA'
    this.GACode = code;
  }

  this.click_send();
}

// 是否可以重置密码
root.methods.canOpenPopPublic = function () {
  let canSend = true
  // 判断用户名
  canSend = this.testPsw() && canSend
  canSend = this.testPswConfirm() && canSend

  if (this.psw === '') {
    this.pswWA = this.$t('pswWA_5')
    canSend = false
  }
  if (this.pswConfirm === '') {
    this.pswConfirmWA = this.$t('pswConfirmWA_1')
    canSend = false
  }
  return canSend
}

// 是否可以重置密码
root.methods.canSend = function () {
  let canSend = true
  // 判断用户名
  canSend = this.testPsw() && canSend
  canSend = this.testPswConfirm() && canSend
  canSend = this.testGACode() && canSend
  canSend = this.testVerificationCode() && canSend
  canSend = this.testEmailVerificationCode() && canSend
  canSend = !this.sending && canSend

  if (this.psw === '') {
    this.pswWA = this.$t('pswWA_5')
    canSend = false
  }
  if (this.pswConfirm === '') {
    this.pswConfirmWA = this.$t('pswConfirmWA_1')
    canSend = false
  }

  if (this.verificationCode === '' && this.picked === 'bindMobile') {
    this.verificationCodeWA = this.$t('verificationCodeWA_0')
    canSend = false
  }
  if (!this.clickVerificationCodeButton && this.picked === 'bindMobile') {
    this.verificationCodeWA = this.$t('verificationCodeWA_1')
    canSend = false
  }
  if (this.GACode === '' && this.picked === 'bindGA') {
    this.GACodeWA = this.$t('GACodeWA_0')
    canSend = false
  }
  if (this.emailVerificationCode === '' && this.picked === 'bindEmail') {
    this.emailVerificationCodeWA = this.$t('verificationCodeWA_0')
    canSend = false
  }
  return canSend
}


// 点击发送
root.methods.click_send = function () {

  //如果弹窗没打开并且需要二次验证
  if (!this.verificationOpen && (this.bindGA || this.bindMobile)){

    if (!this.canOpenPopPublic()) {
      return
    }

    this.openPopPublic();
    return
  }

  if (!this.canSend()) {
    return
  }
  this.sending = true

  let pickedType = '', code = ''

  if (this.picked === 'bindMobile') {
    pickedType = 'mobile'
    code = this.verificationCode
  }
  if (this.picked === 'bindGA') {
    pickedType = 'ga'
    code = this.GACode
  }
  if (this.picked === 'bindEmail') {
    pickedType = 'email'
    code = this.emailVerificationCode
  }


  let params


  if (pickedType === '') {

    // 如果是手机
    if (this.loginType === 0) {
      params = {
        "mobile": this.$route.query.mobile,
        "password": this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.psw).toString()
      }
      this.$http.send('FIND_BACK_MOBILE_PASSWORD_RESET', {
        bind: this,
        params: params,
        callBack: this.re_reset_callback,
        errorHandler: this.error_reset_callback
      })
      return
    }

    // 如果是邮箱
    params = {
      "email": this.$route.query.email,
      "password": this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.psw).toString()
    }
    this.$http.send('FIND_BACK_PASSWORD_RESET', {
      bind: this,
      params: params,
      callBack: this.re_reset_callback,
      errorHandler: this.error_reset_callback
    })
    return
  }

  // 如果选择了手机认证，也就是邮箱找回的手机认证
  if (pickedType === 'mobile') {
    params = {
      "purpose": "resetLoginPassword",
      "examinee": this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.psw).toString(),
      "code": code,
      "type": pickedType
    }

    this.$http.send('POST_COMMON_AUTH', {
      bind: this,
      params: params,
      callBack: this.re_reset_mobile_callback,
      errorHandler: this.error_reset_mobile_callback
    })
    return
  }

  // 如果选择了邮箱认证，也就是手机找回的邮箱认证 pickedType === 'email'  code = this.emailVerificationCode
  if (pickedType === 'email') {
    params = {
      "purpose": "findBackPassword",
      "examinee": this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.psw).toString(),
      "code": code,
      "type": pickedType
    }

    this.$http.send('POST_COMMON_AUTH', {
      bind: this,
      params: params,
      callBack: this.re_reset_email_callback,
      errorHandler: this.error_reset_email_callback
    })
    return
  }


  // 如果都不是，说明是手机找回的谷歌验证 pickedType = 'ga' code = this.GACode
  params = {
    "purpose": "resetLoginPassword",
    "examinee": this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.psw).toString(),
    "code": code,
    "type": pickedType
  }

  this.$http.send('POST_COMMON_AUTH', {
    bind: this,
    params: params,
    callBack: this.re_reset_ga_callback,
    errorHandler: this.error_reset_ga_callback
  })


}

root.methods.re_reset_callback = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  this.sending = false
  if (data.errorCode) {
    // 1数据格式错误 2没有伪登录的cookie 3伪登录code错误 4不存在的邮箱 5调错接口，此用户已经绑定了谷歌或手机
    switch (data.errorCode) {
      case 1:
        this.pswWA = this.$t('pswWA_6')
        break;
      case 2:
        this.pswWA = this.$t('emailVerificationCodeWA_5')
        break;
      case 3:
        this.pswWA = this.$t('emailVerificationCodeWA_5')
        break;
      default:
        this.pswWA = this.$t('canNotUse')
    }
    return
  }
  this.checkLogin()
  // this.$router.replace('home')
  location.reload()
}


root.methods.re_reset_mobile_callback = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  this.sending = false
  if (data.errorCode) {
    switch (data.errorCode) {
      case 1:
        this.pswWA = this.$t('pswWA_1')
        break;
      case 2:
        this.verificationCodeWA = this.$t('verificationCodeWA_2')
        break;
      case 3:
        this.verificationCodeWA = this.$t('verificationCodeWA_3')
        break;
      case 4:
        this.pswWA = this.$t('pswWA_4')
        break;
      default:
        this.pswWA = this.$t('canNotUse')
    }
    this.endCountDownVerification()
    return
  }
  this.checkLogin()
  location.reload()
  // this.$router.replace('home')
}

root.methods.re_reset_ga_callback = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  this.sending = false
  console.warn('data', data)

  if (data.errorCode) {
    switch (data.errorCode) {
      case 1:
        this.pswWA = this.$t('pswWA_4')
        break;
      case 2:
        this.GACodeWA = this.$t('GACodeWA_1')
        break;
      case 3:
        this.pswWA = this.$t('pswWA_7')
        break;
      default:
        this.pswWA = this.$t('canNotUse')
    }

    this.endCountDownVerification()
    return
  }
  this.checkLogin()
  location.reload()
  // this.$router.replace({name: 'home'})
}

root.methods.re_reset_email_callback = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  this.sending = false
  console.warn('data', data)
  if (data.errorCode) {
    switch (data.errorCode) {
      case 1:
        this.pswWA = this.$t('emailVerificationCodeWA_2')
        break;
      case 2:
        this.emailVerificationCodeWA = this.$t('emailVerificationCodeWA_1')
        break;
      case 3:
        this.pswWA = this.$t('emailVerificationCodeWA_1')
        break;
      case 4:
        this.pswWA = this.$t('emailVerificationCodeWA_5')
        break;
      default:
        this.pswWA = this.$t('canNotUse')
    }

    this.endEmailCountDownVerification()
    return
  }
  this.checkLogin()
  location.reload()
}
root.methods.error_reset_email_callback = function (err) {

}


root.methods.checkLogin = function () {
  this.$http.send('CHECKLOGININ', {
    bind: this,
    callBack: this.re_checkLogin,
    errorHandler: this.error_checkLogin
  })
}
root.methods.re_checkLogin = function (data) {
  let dataObj = JSON.parse(data)
  if (dataObj.result === 'FAIL' || dataObj.errorCode) {
    return
  }
  this.$store.commit('SET_AUTH_MESSAGE', dataObj.dataMap.userProfile)
  this.$router.replace({
    name: 'authentication'
  })

}
root.methods.error_checkLogin = function (err) {
  console.warn("出错了！", err)

}

root.methods.error_reset_callback = function (err) {
  this.sending = false
  console.warn("重置密码出错了！", err)
}


root.methods.error_reset_mobile_callback = function (err) {
  this.sending = false
  console.warn("重置密码出错了！", err)
}

root.methods.error_reset_ga_callback = function (err) {
  this.sending = false
  console.warn("重置密码出错了！", err)
}

export default root
