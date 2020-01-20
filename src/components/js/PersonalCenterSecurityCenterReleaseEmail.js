const root = {}

root.name = 'PersonalCenterSecurityCenterReleaseEmail'

root.props = {}
root.props.show = {
  type: Boolean,
  default: false
}

/*----------------------------- 组件 ------------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupT': resolve => require(['../vue/PopupT'], resolve),
}

/*----------------------------- data ------------------------------*/

root.data = function () {
  return {
    loading: true,

    psw: '', //密码
    pswWA: '',//密码错误提示

    email: '',//手机号
    emailWA: '',//手机号错误提示

    verificationCode: '', //验证码
    verificationCodeWA: '',//验证码错误提示

    // clickVerificationCodeButton: false,
    getVerificationCode: false,
    getVerificationCodeCountdown: 60,
    getVerificationCodeInterval: null,

    popType: 0,
    popOpen: false,
    popText: '系统繁忙',

    sending: false,

    // 2018-5-4
    frequency: 0,        // 剩余次数
    hours: 24,            // 冻结几小时
    total_frequency: 0,  // 累计多少次
    pop_tips1: '',
    pop_tips2: '',
    toast_tips: '',

    // 2018-07-30 h5增加focus效果
    pswFocus: false,
    emailFocus: false,
    verificationFocus: false,

    // show:true
  }
}

/*----------------------------- 生命周期 ------------------------------*/

root.created = function () {
  this.$store.commit('changeMobileHeaderTitle', '解绑邮箱');
  this.getAuthState()
}
root.mounted = function () {
  // 监听键盘事件
  document.onkeydown = (event) => {
    if (event.keyCode === 13) {
      this.commit()
    }
  }
}
root.beforeDestroy = function () {
  // 取消监听键盘事件
  document.onkeydown = (event) => {
  }
}

/*----------------------------- 计算 ------------------------------*/

root.computed = {}
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
root.computed.lang = function () {
  return this.$store.state.lang;
}
/*----------------------------- 方法 ------------------------------*/

root.methods = {}


root.methods.focusPsw = function () {
  this.pswFocus = true;
  this.pswWA = ''
}

root.methods.focusEmail = function () {
  this.emailFocus = true;
  this.emailWA = ''
}

root.methods.focusVerificationCode = function () {
  this.verificationFocus = true;
  this.verificationCodeWA = ''
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

// 判断验证状态
root.methods.getAuthState = function () {
  if (!this.$store.state.authState) {
    this.$http.send('GET_AUTH_STATE', {
      bind: this,
      callBack: this.re_getAuthState,
      errorHandler: this.error_getAuthState
    })
    return
  }
  if (!this.$store.state.authState.email) {
    this.$router.push({name: 'securityCenter'})
    return
  }
  this.loading = false
}
// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return;
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
  if (!data.dataMap.email) {
    this.$router.push({name: 'securityCenter'})
  }
  this.loading = false
}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
  this.$router.push({name: 'securityCenter'})
}

// 判断密码验证
root.methods.testPsw = function () {
  this.pswFocus = false
  if (this.psw === '') {
    this.pswWA = ''
    return false
  }
  this.pswWA = ''
  return true
}
// 判断手机号
root.methods.testEmail = function () {
  this.emailFocus = false;
  if (this.email === '') {
    this.emailWA = ''
    return false
  }
  if (!this.$globalFunc.testEmail(this.email)) {
    this.emailWA = this.$t('userNameWA_3')
    return false
  }
  this.emailWA = ''
  return true
}
// 判断验证码
root.methods.testVerificationCode = function () {
  this.verificationFocus = false;
  if (this.verificationCode === '') {
    this.verificationCodeWA = ''
    return false
  }
  this.verificationCodeWA = ''
  return true
}

// 开始倒计时
root.methods.beginCountDownVerification = function () {
  this.getVerificationCode = true
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

// 结束倒计时
root.methods.endCountDownVerification = function () {
  this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
  this.getVerificationCode = false
  this.getVerificationCodeCountdown = 60
}

// 点击获取验证码
root.methods.getVerificationCodeFunc = function () {
  let canSend = true
  canSend = this.testEmail() && canSend
  if (this.email === '') {
    this.emailWA = this.$t('userNameWA_1')
    canSend = false
  }

  if (!canSend) {
    return
  }

  this.beginCountDownVerification()

  let params = {
    "type": "email", "mun": this.email, "purpose": "unbind"
  }

  this.$http.send('POST_VERIFICATION_CODE', {
    bind: this,
    params: params,
    callBack: this.re_getVerificationCode,
    errorHandler: this.error_getVerificationCode
  })
}
// 点击验证码回复
root.methods.re_getVerificationCode = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.warn('data', data)
  if (data.errorCode) {
    switch (data.errorCode) {
      case 1:
        this.verificationCodeWA = this.$t('emailWA_1')
        break;
      case 2:
        this.verificationCodeWA = this.$t('emailWA_2')
        break;
      case 3:
        this.verificationCodeWA = this.$t('emailWA_3')
        break;
      default:
        this.verificationCodeWA = this.$t('canNotUse')
    }

    this.endCountDownVerification()
  }
}
// 点击验证码出错
root.methods.error_getVerificationCode = function (err) {
  console.warn('绑定手机号获取手机验证码失败！', err)
  this.popType = 0
  this.popText = this.$t('popText_0')
  this.popOpen = true
}

// 可以提交
root.methods.canCommit = function () {
  let canSend = true
  canSend = this.testEmail() && canSend
  if (this.psw === '') {
    this.pswWA = this.$t('pswWA_0')
    canSend = false
  }
  if (this.email === '') {
    this.emailWA = this.$t('userNameWA_1')
    canSend = false
  }
  if (this.verificationCode === '') {
    this.verificationCodeWA = this.$t('verificationCodeWA_3')
    canSend = false
  }
  return canSend
}

// 提交
root.methods.commit = function () {
  if (this.sending) return

  if (!this.canCommit()) {
    return
  }

  this.sending = true
  this.popType = 2
  this.popOpen = true

  this.$http.send('POST_COMMON_AUTH_UNBIND', {
    bind: this,
    params: {
      type: 'email',
      purpose: 'unbind',
      examinee: this.email,
      code: this.verificationCode,
      password: this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.psw).toString()
    },
    callBack: this.re_commit,
    errorHandler: this.error_commit,
  })

}

root.methods.re_commit = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  // console.warn('绑定手机回复', data)
  this.sending = false;

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

  this.popClose()
  if (data.errorCode) {

    switch (data.errorCode) {
      case 1:
        this.pswWA = this.$t('pswWA_1')
        break;
      case 2:
        this.emailWA = this.$t('emailWA_4')
        break;
      default:
        this.emailWA = this.$t('canNotUse')
    }
    return
  }
  if (this.isMobile) {
    this.$router.push({name: 'authentication'})
  } else {
    // this.$router.push({name: 'securityCenter'})
    this.click_rel_em(true)
  }
}
root.methods.error_commit = function (err) {
  console.warn("绑定手机出错", err)
  this.sending = false
  this.popOpen = false
  this.popType = 0
  this.popText = this.$t('popText_0')
  setTimeout(() => {
    this.popOpen = true
  }, 100)

}

root.methods.click_rel_em = function (callApi) {
  // this.show = false
  // this.$router.push({name: 'securityCenter'})
    this.$emit('close',false,callApi)

}


// 弹窗
root.methods.popClose = function () {
  this.popOpen = false
}


export default root
