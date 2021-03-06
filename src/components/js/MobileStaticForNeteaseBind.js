import '../../../static/gt'

const root = {}
root.name = 'MobileStaticForNeteaseBind'

/*------------------------------ 组件 -------------------------------*/


root.components = {
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'MobileCheckbox': resolve => require(['../mobileVue/MobileCompentsVue/MobileCheckbox'], resolve),

}


/*------------------------------ data -------------------------------*/

root.data = function () {
  return {
    loading: false,

    registerPicked: 'typePhone',


    userType: '',
    userName: '',
    userNameWA: '',

    verificationCode: '',
    clickVerificationCodeButton: false,
    getVerificationCode: false,
    getVerificationCodeCountdown: 60,
    verificationCodeWA: '',
    getVerificationCodeInterval: null,

    psw: '',
    pswWA: '',

    pswConfirm: '',
    pswConfirmWA: '',

    referee: '',
    refereeWA: '',

    // 渠道来源
    channel: '',


    agreement: false,
    agreementWA: '',

    // verifying: false,
    // verifyingWA: '',

    sending: false,


    popType: 0,
    popOpen: false,
    popText: '系统繁忙',
    popText2: '',

    captcha: null,
    captchaReady: false,

    userNameFocusFlag: false,
    verificationFocusFlag: false,
    passwardFocusFlag: false,

    // 网易回调地址
    neteasePathDev: 'http://star.8.163.com/index.html#/myEquity?closePage=1',
    neteasePath: 'https://star.8.163.com/m#/myEquity?closePage=1',

    // 成功后弹窗
    showToastFlag: false,
  }
}

/*------------------------------ 生命周期 -------------------------------*/

root.created = function () {
  this.getMutualValidate()

  if (this.$route.query.uid) {
    this.referee = this.$route.query.uid
  }

}

root.mounted = function () {
  // 监听键盘事件
  document.onkeydown = (event) => {
    if (event.keyCode === 13) {
      this.registerCommit()
    }
  }
}
root.beforeDestroy = function () {
  // 取消监听键盘事件
  document.onkeydown = (event) => {
  }
}

/*------------------------------ 计算 -------------------------------*/
root.computed = {}
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
// 语言
root.computed.lang = function () {
  return this.$store.state.lang
}

/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/


root.methods = {}

//
root.methods.closeToast = function () {
  this.showToastFlag = false
  let that = this;
    if(window.location.hostname === 'sim.TwentyTwenty') {
      window.location.href = that.neteasePathDev
    } else {
      window.location.href = that.neteasePath
    }
}

// 点击选择手机注册或者邮箱注册

root.methods.changeRegisterType = function (num) {
  if(num === 0) {
    this.registerPicked = 'typePhone'
  }
  if(num === 1) {
    this.registerPicked = 'typeEmail'
  }

  this.userName = '';
  this.userNameWA = '';

  this.verificationCode = ''
  this.verificationCodeWA = ''

  this.psw = '';
  this.pswWA = '';

  this.verificationCode = '';
  this.clickVerificationCodeButton = false;
  this.getVerificationCode = false;
  this.getVerificationCodeCountdown = 60;
}

// 点击input 删除userNameWA
root.methods.cleanUserNameWA = function () {
  this.userNameWA = '';
}


// 判断着陆后进入此页
root.methods.getMutualValidate = function () {
  this.$http.send('NETEASE_MUTUAL_VALIDATE', {
    bind: this,
    callBack: this.re_getMutualValidate,
    errorHandler: this.error_getMutualValidate
  })
}

root.methods.re_getMutualValidate = function (data) {
  typeof(data) === 'string' && (data = JSON.parse(data))
  console.log('data',data)

  if(data.result){
    return
  }
  this.$router.push({name: 'MobileStaticNoJurisdiction'})
}
// input框的操作
root.methods.focusUserName = function () {
  this.userNameFocusFlag = true
  this.userNameWA = '';
}

root.methods.focusVerificationCode = function () {
  this.verificationFocusFlag = true
  this.verificationCodeWA = ''
}

root.methods.focusInputIngPsw = function () {
  this.passwardFocusFlag = true
  this.pswWA = '';
}

// 判断输入用户
root.methods.testUserName = function () {
  this.userNameFocusFlag = false
  return this.inputUserName()
}

root.methods.inputUserName = function () {
  if (this.userName === '') {
    this.userNameWA = ''
    return true
  }
  if (!this.$globalFunc.testEmail(this.userName) && this.registerPicked === 'typeEmail') {
    this.userNameWA = '邮箱格式错误'
    return false
  }
  if (!this.$globalFunc.testMobile(this.userName) && this.registerPicked === 'typePhone') {
    this.userNameWA = '手机格式错误'
    return false
  }
  this.userNameWA = ''
  return true
}

// 输入密码中
root.methods.testInputIngPsw = function () {
  if (this.psw.length > 16) {
    this.pswWA = this.$t('register.pswWA_0')
  }
  this.psw = this.psw.slice(0, 16)
}
// 输入确认密码中
root.methods.testInputIngPswConfirm = function () {
  if (this.pswConfirm.length > 16) {
    this.pswConfirmWA = this.$t('register.pswConfirmWA_0')
  }
  this.pswConfirm = this.pswConfirm.slice(0, 16)
}

/*----------------- 极验 ------------------*/

// 获取验证码
root.methods.postVerificationCode = function () {
  // 验证邮箱
  if (!this.testUserName()) {
    return
  }
  if (this.userName === '' && this.registerPicked === 'typeEmail') {
    this.userNameWA = '请输入邮箱'
    return
  }

  if (this.userName === '' && this.registerPicked === 'typePhone') {
    this.userNameWA = '请输入手机号'
    return
  }

  // 发送，目的是register注册
  let params = {
    "type": this.registerPicked === 'typeEmail'?"email":"mobile",
    "mun": this.userName.trim(),
    "purpose": "binduser"
  }

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

  this.$http.send('POST_VERIFICATION_CODE', {
    bind: this, params: params, callBack: this.re_postVerificationCode, errorHandler: this.error_postVerificationCode
  })
}

// 获取验证码的回复
root.methods.re_postVerificationCode = function (data) {
  let dataObj = JSON.parse(data)
  if (dataObj.errorCode && this.registerPicked === 'typePhone') {
    dataObj.errorCode === 1 && (this.verificationCodeWA = '此手机未注册')
    dataObj.errorCode === 2 && (this.verificationCodeWA = '手机格式错误')
    dataObj.errorCode === 3 && (this.verificationCodeWA = '发送过于频繁')
    dataObj.errorCode === 4 && (this.verificationCodeWA = '发送异常')
    dataObj.errorCode === 5 && (this.verificationCodeWA = '验证未通过')
    dataObj.errorCode === 6 && (this.verificationCodeWA = '该手机号已被其他用户绑定激活')
    this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
    this.getVerificationCode = false
    this.getVerificationCodeCountdown = 60
  }
  if (dataObj.errorCode && this.registerPicked === 'typeEmail') {
    dataObj.errorCode === 1 && (this.verificationCodeWA = '此邮箱未注册')
    dataObj.errorCode === 2 && (this.verificationCodeWA = '邮箱格式错误')
    dataObj.errorCode === 3 && (this.verificationCodeWA = '发送过于频繁')
    dataObj.errorCode === 4 && (this.verificationCodeWA = '发送异常')
    dataObj.errorCode === 5 && (this.verificationCodeWA = '验证未通过')
    dataObj.errorCode === 6 && (this.verificationCodeWA = '该邮箱已被其他用户绑定激活')
    this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
    this.getVerificationCode = false
    this.getVerificationCodeCountdown = 60
  }
}
// 获取验证码出错
root.methods.error_postVerificationCode = function (err) {
  console.warn('获取验证码出错了！！', err)
}

/*----------------- 极验 end ------------------*/


// 验证码输入
root.methods.testVerificationCode = function () {
  this.verificationFocusFlag = false
  if (this.verificationCode === '') {
    this.verificationCodeWA = ''
    return false
  }
  this.verificationCodeWA = ''
  return true
}

// 密码输入
root.methods.testPsw = function () {
  this.passwardFocusFlag = false
  if (this.psw === '') {
    this.pswWA = ''
    return false
  }
  if (!this.$globalFunc.testPsw(this.psw)) {
    this.pswWA = this.$t('register.pswWA_1')
    return false
  }
  this.pswWA = ''
  return true
}

// 确认密码
root.methods.testPswConfirm = function () {
  if (this.psw !== this.pswConfirm) {
    this.pswConfirmWA = this.$t('register.pswWA_2')
    return false
  }
  this.pswConfirmWA = ''
  return true
}

// 确认同意协议
root.methods.testAgreement = function () {
  // this.agreement = !this.agreement
  this.agreementWA = ''
}

// 确认同意协议
root.methods.changeAgreement = function () {
  this.agreement = !this.agreement
  this.agreementWA = ''
}



// 点击注册
root.methods.registerCommit = function () {
  if (this.sending) return
  let canSend = true
  // 判断用户名
  canSend = this.testUserName() && canSend
  canSend = this.testVerificationCode() && canSend
  canSend = this.testPsw() && canSend

  if (this.userName === '') {
    this.userNameWA = this.$t('register.userNameWA_2')
    canSend = false
  }
  if (this.verificationCode === '') {
    this.verificationCodeWA = this.$t('register.verificationCodeWA_3')
    canSend = false
  }
  if (this.psw === '') {
    this.pswWA = this.$t('register.pswWA_3')
    canSend = false
  }

  // if (!this.verifying) {
  //   this.verifyingWA = this.$t('register.verifyingWA')
  //   canSend = false
  // }

  if (!canSend) {
    // console.log("不能发送！")
    return
  }

  let params = {}

  if(this.registerPicked === 'typeEmail'){
    params = {
      "email": this.userName.trim(),
      "password1": this.$globalFunc.CryptoJS.SHA1(this.userName + ':' + this.psw).toString(),
      "password": this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.psw).toString(),
      "code": this.verificationCode,
      'corOrgId': this.$route.query.corOrgId,
      'corOrgUID': this.$route.query.corOrgUID,
      'callbackInfo': this.$route.query.callbackInfo,
    }
  } else {
    params = {
      "mobile": this.userName.trim(),
      "password": this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.psw).toString(),
      "code": this.verificationCode,
      'corOrgId': this.$route.query.corOrgId,
      'callbackInfo': this.$route.query.callbackInfo,
      'corOrgUID': this.$route.query.corOrgUID,
    }
  }
  this.$http.send('NETEASE_BIND_USER', {
    bind: this,
    params: params,
    callBack: this.re_register,
    errorHandler: this.error_register
  })
  this.sending = true
  this.popType = 2
  this.popOpen = true
}

// 注册处理
root.methods.re_register = function (data) {
  this.sending = false
  this.popOpen = false

  // console.warn('注册数据', data)

  typeof(data) === 'string' && (data = JSON.parse(data))

  if (data.result === 'FAIL' && this.registerPicked === 'typePhone' || data.errorCode) {
    // dataObj.msg
    data.errorCode === 1 && (this.userNameWA = '用户未注册')
    data.errorCode === 2 && (this.userNameWA = '参数错误')
    data.errorCode === 3 && (this.verificationCodeWA = '验证码错误')
    data.errorCode === 4 && (this.pswWA = '密码错误')
    data.errorCode === 5 && (this.userNameWA = '页面过期')
    data.errorCode === 6 && (this.userNameWA = '该手机号已被其他用户绑定激活')
    if(data.errorCode === 7){
      this.popOpen = true
      this.popType = 0
      this.popText = '机构用户已绑定'

      let that = this;
      setTimeout(function(){
        if(window.location.hostname === 'sim.TwentyTwenty') {
          window.location.href = that.neteasePathDev
        } else {
          window.location.href = that.neteasePath
        }
      },1000)
    }
    return
  }

  if (data.result === 'FAIL' && this.registerPicked === 'typeEmail' || data.errorCode) {
    // dataObj.msg
    data.errorCode === 1 && (this.userNameWA = '用户未注册')
    data.errorCode === 2 && (this.userNameWA = '参数错误')
    data.errorCode === 3 && (this.verificationCodeWA = '验证码错误')
    data.errorCode === 4 && (this.pswWA = '密码错误')
    data.errorCode === 5 && (this.userNameWA = '页面过期')
    data.errorCode === 6 && (this.userNameWA = '该邮箱已被其他用户绑定激活')
    if(data.errorCode === 7){
      this.popOpen = true
      this.popType = 0
      this.popText = '机构用户已绑定'

      let that = this;
      setTimeout(function(){
        if(window.location.hostname === 'sim.TwentyTwenty') {
          window.location.href = that.neteasePathDev
        } else {
          window.location.href = that.neteasePath
        }
      },1000)
    }
    return
  }


  this.showToastFlag = true

}

// 获得认证状态
root.methods.re_get_auth_state = function (data) {
  let dataObj = JSON.parse(data)
  this.$store.commit('SET_AUTH_STATE', dataObj.dataMap)
  // this.$eventBus.notify({key: 'BIND_AUTH_POP'})


}



// 注册出错
root.methods.error_register = function (err) {
  this.sending = false
  this.popOpen = false
  this.popType = 0
  this.popText = this.$t('register.popText_0')
  setTimeout(() => {
    this.popOpen = true
  }, 200)
}

// 关闭弹窗
root.methods.popClose = function () {
  this.popOpen = false
}

export default root
