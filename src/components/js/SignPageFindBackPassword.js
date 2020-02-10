const root = {}
root.name = 'SignPageFindBackPassword'

import '../../../static/gt'

/*------------------------------ 组件 -------------------------------*/


root.components = {
  'RegisterTopBar': resolve => require(['../vue/RegisterTopBar'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve)
}


/*-------------------- data ---------------------*/

root.data = function () {
  return {
    loading: false,

    getVerificationCode: false,
    getVerificationCodeInterval: null,
    getVerificationCountdown: 60,
    clickVerificationCodeButton: false,

    userName: '',
    userNamePlaceholderShow:true,
    userNameWA: '',

    mobile: '', //手机号
    mobileWA: '', //手机号错误提示

    mobileVerificationCode: '', //手机验证码
    mobileVerificationCodeWA: '', //手机验证码错误提示

    getMobileVerificationCode: false,
    getMobileVerificationCodeInterval: null,
    getMobileVerificationCountdown: 60,
    clickMobileVerificationCodeButton: false,


    verificationCode: '',
    verificationCodePlaceholderShow:true,
    verificationCodeWA: '',


    popOpen: false,
    popType: 0,
    popText: '系统繁忙',

    sending: false,


    captcha: null, //极验
    captchaReady: false, //极验获取

    // 2018-5-4
    frequency: 0,        // 剩余次数
    hours: 24,            // 冻结几小时
    total_frequency: 0,  // 累计多少次
    pop_tips1: '',
    pop_tips2: '',
    toast_tips: '',


    // 2018-7-27 新登录注册
    loginType: 0, // 0为手机登录，1为邮箱登录

    // 2018-07-30 h5增加focus效果
    mobileUserNameFocus: false,
    mobileUserVerificationFocus: false,
    emailUserNameFocus: false,
    emailUserVerificationFocus: false,


  }


}

/*-------------------- 计算 ---------------------*/

root.computed = {}
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
root.computed.lang = function () {
  return this.$store.state.lang
}
// 极验类型
root.computed.geetestType = function () {
  return this.$store.state.isMobile ? 'h5' : 'web'
}

/*-------------------- 生命周期 ---------------------*/

root.created = function () {
  this.$store.commit('changeMobileHeaderTitle', '忘记密码');
}

root.mounted = function () {
  this.getGeetest()
}


/*-------------------- 方法 ---------------------*/

root.methods = {}

// 获取焦点后关闭placheholder
root.methods.closePlaceholder = function (type) {
  // alert(type);
  if(type == 'userName'){
    this.userNamePlaceholderShow = false;
  }

  if(type == 'verificationCode'){
    this.verificationCodePlaceholderShow = false;
  }
}

// 提示toast次数错误
root.methods.SHOW_TIPS_FREQUENCY = function (frequency, total_frequency, hours) {
  this.frequency = frequency;
  this.total_frequency = total_frequency;
  this.hours = hours;
  this.popText = this.$t('falseHints.vfc_1') + this.frequency + this.$t('falseHints.vfc_2') + this.total_frequency + this.$t('falseHints.vfc_3') + this.hours + this.$t('falseHints.hour');
}

// 提示toast错误太多了
root.methods.SHOW_TIPS = function (hours) {
  this.hours = hours;
  this.popText = this.$t('falseHints.vfc_error1') + this.hours + this.$t('falseHints.vfc_error2');
}


// 选择找回方式
root.methods.choseLoginType = function (type) {
  this.loginType = type
}


/*----------------- 极验 ------------------*/

// 获取极验
root.methods.getGeetest = function () {
  this.$http.send('GET_GEETEST_INIT', {
    params: {client_type: this.geetestType},
    bind: this,
    callBack: this.re_getGeetest,
    errorHandler: this.error_getGeetest
  })
}
// 开始极验
root.methods.re_getGeetest = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data));
  console.warn('')
  if (!data || !data.dataMap || data.result == 'FAIL') {
    return
  }

  this.captchaReady = true

  let res = JSON.parse(data.dataMap.resStr)
  initGeetest({
    gt: res.gt,
    challenge: res.challenge,
    offline: !res.success,
    new_captcha: true,
    product: 'bind',
    width: '20rem',
    lang: this.lang === 'CH' ? 'zh-cn' : 'en',
  }, (captchaObj) => {
    this.initVerification(captchaObj)
  })
}

// 初始化极验
root.methods.initVerification = function (captchaObj) {
  this.captcha = captchaObj
  this.captcha.onReady(() => {
  }).onClose(() => {
    // this.verificationCodeWA = '请完成验证操作'
  }).onSuccess(this.postVerificationCode)
}

// 获取极验出错
root.methods.error_getGeetest = function (err) {
  console.warn('获取极验出错', err)
}

// 点击验证极验
root.methods.clickGeetest = function () {
  if (!this.testUserName()) {
    return
  }
  this.captcha.verify();
}


// 检验是否可以发送验证码
root.methods.canSendVerification = function () {
  let canSend = true

  if (this.loginType === 0) {
    // 验证手机
    canSend = this.testMobile() && canSend
    if (this.mobile === '') {
      this.mobileWA = this.$t('mobileWA_1')
      canSend = false
    }
  }

  if (this.loginType === 1) {
    // 验证邮箱
    canSend = this.testUserName() && canSend
    if (this.userName === '') {
      this.userNameWA = this.$t('userNameWA_1')
      canSend = false
    }
  }
  return canSend
}


// 检验是否可以发送数据
root.methods.canCommit = function () {
  let canSend = true

  // if (this.loginType === 0) {
  //   // 判断用户名
  //   canSend = this.testMobile() && canSend
  //   canSend = this.testMobileVerificationCode() && canSend
  //   if (this.mobile === '') {
  //     this.mobileWA = this.$t('mobileWA_1')
  //     canSend = false
  //   }
  //   if (this.mobileVerificationCode === '') {
  //     this.mobileVerificationCodeWA = this.$t('userNameWA_3')
  //     canSend = false
  //   }
  //   if (!this.clickMobileVerificationCodeButton) {
  //     this.mobileVerificationCodeWA = this.$t('userNameWA_4')
  //     canSend = false
  //   }
  //   if (!canSend) {
  //     return
  //   }
  // }

  // if (this.loginType === 1) {
    // 验证邮箱
    canSend = this.testUserName() && canSend
    canSend = this.testVerificationCode() && canSend
    if (this.userName === '') {
      this.userNameWA = this.$t('userNameWA_2')
      canSend = false
    }
    if (this.verificationCode === '') {
      this.verificationCodeWA = this.$t('userNameWA_3')
      canSend = false
    }
    if (!this.clickVerificationCodeButton) {
      this.verificationCodeWA = this.$t('userNameWA_4')
      canSend = false
    }
  // }
  return canSend
}


// 开始获取邮箱验证码倒计时
root.methods.beginCountDownVerification = function () {
  this.getVerificationCode = true
  this.clickVerificationCodeButton = true
  this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
  this.getVerificationCodeInterval = setInterval(() => {
    this.getVerificationCountdown--
    if (this.getVerificationCountdown <= 0) {
      this.getVerificationCode = false
      this.getVerificationCountdown = 60
      clearInterval(this.getVerificationCodeInterval)
    }
  }, 1000)
}

// 开始获取手机验证码倒计时
root.methods.beginMobileCountDownVerification = function () {
  this.getMobileVerificationCode = true
  this.clickMobileVerificationCodeButton = true
  this.getMobileVerificationCodeInterval && clearInterval(this.getMobileVerificationCodeInterval)
  this.getMobileVerificationCodeInterval = setInterval(() => {
    this.getMobileVerificationCountdown--
    if (this.getMobileVerificationCountdown <= 0) {
      this.getMobileVerificationCode = false
      this.getMobileVerificationCountdown = 60
      clearInterval(this.getMobileVerificationCodeInterval)
    }
  }, 1000)
}

// 结束获取邮箱验证码倒计时
root.methods.endCountDownVerification = function () {
  this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
  this.getVerificationCode = false
  this.getVerificationCountdown = 60
}


// 结束获取手机验证码倒计时
root.methods.endMobileCountDownVerification = function () {
  this.getMobileVerificationCodeInterval && clearInterval(this.getMobileVerificationCodeInterval)
  this.getMobileVerificationCode = false
  this.getMobileVerificationCountdown = 60
}


// 验证成功
root.methods.postVerificationCode = function () {

  if(!this.testUserName())return

  // 如果选择的是手机找回
  if (this.loginType === 0) {
    this.verificationCodeWA = ''
    this.beginCountDownVerification()
    // let result = this.captcha.getValidate()
    let params = {
      // geetest_challenge: result.geetest_challenge,
      // geetest_seccode: result.geetest_seccode,
      // geetest_validate: result.geetest_validate,
      client_type: this.geetestType,
      "type": "mobile",
      "mun": this.userName.trim(),
      "purpose": "findBackPassword"
    }
    this.$http.send('POST_VERIFICATION_CODE', {
      bind: this,
      params: params,
      callBack: this.re_postMobileVerificationCode,
      errorHandler: this.error_postVerificationCode
    })
    return
  }
  // 如果选择的是邮箱找回
  this.verificationCodeWA = ''
  this.beginCountDownVerification()
  // let result = this.captcha.getValidate()
  let params = {
    // geetest_challenge: result.geetest_challenge,
    // geetest_seccode: result.geetest_seccode,
    // geetest_validate: result.geetest_validate,
    client_type: this.geetestType,
    "type": "email",
    "mun": this.userName.trim(),
    "purpose": "resetLoginPassword"
  }
  this.$http.send('POST_VERIFICATION_CODE', {
    bind: this,
    params: params,
    callBack: this.re_postVerificationCode,
    errorHandler: this.error_postVerificationCode
  })
}

// 点击验证码回复
root.methods.re_postVerificationCode = function (data) {
  if (typeof data === 'string') data = JSON.parse(data)
  // console.warn("获取验证码返回", data)
  if (data.errorCode) {
    switch (data.errorCode) {
      case 1:
        this.userNameWA = this.$t('verificationCodeWA_0')
        break;
      case 2:
        this.userNameWA = this.$t('verificationCodeWA_1')
        break;
      case 3:
        this.verificationCodeWA = this.$t('verificationCodeWA_2')
        break;
      case 4:
        this.userNameWA = this.$t('verificationCodeWA_3')
        break;
      default:
        this.userNameWA = this.$t('canNotUse')

    }
    this.endCountDownVerification()
  }
}

// 点击验证码回复
root.methods.re_postMobileVerificationCode = function (data) {
  if (typeof data === 'string') data = JSON.parse(data)
  if (data.errorCode) {
    switch (data.errorCode) {
      case 1:
        // this.mobileWA = this.$t('mobileWA_5')
        this.userNameWA = this.$t('mobileWA_9')
        break;
      case 2:
        // this.mobileWA = this.$t('mobileWA_6')
        this.userNameWA = this.$t('mobileWA_10')
        break;
      case 3:
        // this.mobileVerificationCodeWA = this.$t('mobileWA_7')
        this.verificationCodeWA = this.$t('mobileWA_11')
        break;
      case 4:
        // this.mobileWA = this.$t('mobileWA_8')
        this.userNameWA = this.$t('mobileWA_12')
        break;
      case 5:
        // this.mobileWA = this.$t('mobileWA_8')
        this.userNameWA = this.$t('mobileWA_13')
        break;
      default:
        this.userNameWA = this.$t('canNotUse')
    }
    this.endMobileCountDownVerification()
  }
}


// 点击验证码出错
root.methods.error_postVerificationCode = function (err) {
  console.warn('找回密码获取手机验证码失败！', err)
}

/*----------------- 极验 end ------------------*/

// h5用户input框focus方法
root.methods.focusUserMobile = function () {
  this.mobileUserNameFocus = true
  this.mobileWA = ''
}

root.methods.focusMobileVerificationCode = function () {
  this.mobileUserVerificationFocus = true
  this.mobileVerificationCodeWA = ''
}

root.methods.focusUserName = function () {
  this.emailUserNameFocus = true
  this.userNameWA = ''
}

root.methods.focusVerificationCode = function () {
  this.emailUserVerificationFocus = true
  this.verificationCodeWA = ''
}

// 判断输入用户名 不会判断为空
root.methods.testUserName = function () {
  this.userNamePlaceholderShow = true
  this.emailUserNameFocus = false

  // if (this.userName === '') {
  //   this.userNameWA = ''
  //   return false
  // }
  // if (!this.$globalFunc.testEmail(this.userName)) {
  //   this.userNameWA = this.$t('userNameWA')
  //   return false
  // }

  let userNameFlag = this.$globalFunc.testEmail(this.userName);
  let mobileFlag = this.$globalFunc.testMobile(this.userName);

  if (this.userName === '') {
    this.userNameWA = ''
    return false
  }
  //如果既不是邮箱格式也不是手机格式
  if (!userNameFlag && !mobileFlag) {
    this.userNameWA = this.$t('userNameWA')
    return false
  }

  //如果是手机
  mobileFlag && (this.loginType = 0)
  //如果是邮箱
  userNameFlag && (this.loginType = 1)


  this.userNameWA = ''
  return true
}

// 判断输入手机号 不会判断为空
root.methods.testMobile = function () {
  this.mobileUserNameFocus = false
  if (this.mobile === '') {
    this.mobileWA = ''
    return false
  }
  if (!this.$globalFunc.testMobile(this.mobile)) {
    this.mobileWA = this.$t('mobileWA_4')
    return false
  }
  this.mobileWA = ''
  return true
}

// 判断输入验证码 基本上不会判断
root.methods.testVerificationCode = function () {
  this.verificationCodePlaceholderShow = true
  this.emailUserVerificationFocus = false
  if (this.verificationCode === '') {
    this.verificationCodeWA = ''
    return false
  }
  this.verificationCodeWA = ''
  return true
}

// 判断输入验证码 基本上不会判断
root.methods.testMobileVerificationCode = function () {
  this.mobileUserVerificationFocus = false
  if (this.mobileVerificationCode === '') {
    this.mobileVerificationCodeWA = ''
    return false
  }
  this.mobileVerificationCodeWA = ''
  return true
}


// 点击发送
root.methods.click_findBackPassword = function () {

  if (!this.canCommit()) {
    return
  }

  this.sending = true
  this.popType = 2
  this.popOpen = true


  // 如果是手机找回
  if (this.loginType === 0) {
    let params = {
      type: 'mobile',
      purpose: 'findBackPassword',
      "examinee": this.userName.trim(),
      "code": this.verificationCode
    }

    this.$http.send('FIND_BACK_PASSWORD', {
      bind: this,
      params: params,
      callBack: this.re_find_back_psw,
      errorHandler: this.error_find_back_psw
    })
    return
  }

  let params = {
    type: 'email',
    purpose: 'resetLoginPassword',
    "examinee": this.userName.trim(),
    "code": this.verificationCode
  }


  this.$http.send('FIND_BACK_PASSWORD', {
    bind: this,
    params: params,
    callBack: this.re_find_back_psw,
    errorHandler: this.error_find_back_psw
  })

}

root.methods.re_find_back_psw = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  this.popOpen = false
  this.sending = false
  if (data.errorCode == '2' && !!data.dataMap.times) {
    let res = data.dataMap;
    this.SHOW_TIPS_FREQUENCY((res.times - res.wrong), res.times, (res.lock / 60));
    setTimeout(() => {
      this.popType = 0;
      this.popOpen = true;
    }, 200);
  }

  if (data.errorCode == '100' && !!data.dataMap.lock) {
    let res = data.dataMap;
    this.SHOW_TIPS(res.lock / 60);
    setTimeout(() => {
      this.popType = 0;
      this.popOpen = true;
    }, 200);
  }


  if (data.result === 'FAIL' || data.errorCode) {

    let userWA = ''
    let verificationCodeWA = ''
    switch (data.errorCode) {
      case 1:
        userWA = this.$t('noUser')
        break;
      case 2:
        verificationCodeWA = this.$t('verificationCodeWA_4')
        break;
      default:
        userWA = this.$t('canNotUse')
    }
    // if (this.loginType === 0) {
    //   this.mobileWA = userWA
    //   this.mobileVerificationCodeWA = verificationCodeWA
    // }
    // if (this.loginType === 1) {
      this.userNameWA = userWA
      this.verificationCodeWA = verificationCodeWA
    // }
    return
  }

  this.$router.push({
    name: 'resetPsw',
    query: {
      email: this.loginType === 1 ? this.userName : '',
      mobile: this.loginType === 0 ? this.userName : ''
    }
  })
}


root.methods.error_find_back_psw = function (err) {
  this.sending = false
  this.popOpen = false
  this.popType = 0
  this.popText = this.$t('popText')
  setTimeout(() => {
    this.popOpen = true
  }, 200)
}

root.methods.popClose = function () {
  this.popOpen = false
}

export default root
