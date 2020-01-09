const root = {}
root.name = 'PersonalCenterSecurityCenterReleaseMobile'

/*----------------------------- 组件 ------------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}

/*----------------------------- data ------------------------------*/

root.data = function () {
  return {
    loading: true,

    psw: '', //密码
    pswWA: '',//密码错误提示

    mobile: '',//手机号
    mobileWA: '',//手机号错误提示

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
  }
}

/*----------------------------- 生命周期 ------------------------------*/

root.created = function () {
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
  if (!this.$store.state.authState.sms) {
    this.$router.push('/index/personal/securityCenter')
    return
  }
  this.loading = false
}
// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return;
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
  if (!data.dataMap.sms) {
    this.$router.push('/index/personal/securityCenter')
  }
  this.loading = false
}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
  // console.warn("获取验证状态出错！", err)
  this.$router.push('/index/personal/securityCenter')
}

// 判断密码验证
root.methods.testPsw = function () {
  if (this.psw === '') {
    this.pswWA = ''
    return false
  }
  this.pswWA = ''
  return true
}
// 判断手机号
root.methods.testMobile = function () {
  if (this.mobile === '') {
    this.mobileWA = ''
    return false
  }
  if (!this.$globalFunc.testMobile(this.mobile)) {
    this.mobileWA = this.$t('personalCenterSecurityCenterReleaseMobile.mobileWA_0')
    return false
  }
  this.mobileWA = ''
  return true
}
// 判断验证码
root.methods.testVerificationCode = function () {
  if (this.verificationCode === '') {
    this.verificationCodeWA = ''
    return false
  }
  this.verificationCodeWA = ''
  return true
}

// 点击获取验证码
root.methods.getVerificationCodeFunc = function () {
  let canSend = true
  canSend = this.testMobile() && canSend
  if (this.mobile === '') {
    this.mobileWA = this.$t('personalCenterSecurityCenterReleaseMobile.mobileWA_1')
    canSend = false
  }

  if (!canSend) {
    return
  }

  this.getVerificationCode = true
  // this.clickVerificationCodeButton = true
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

  let params = {
    "type": "mobile", "mun": this.mobile, "purpose": "unbind"
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
    data.errorCode === 1 && (this.verificationCodeWA = this.$t('personalCenterSecurityCenterReleaseMobile.verificationCodeWA_0'))
    data.errorCode === 2 && (this.verificationCodeWA = this.$t('personalCenterSecurityCenterReleaseMobile.verificationCodeWA_1'))
    data.errorCode === 3 && (this.verificationCodeWA = this.$t('personalCenterSecurityCenterReleaseMobile.verificationCodeWA_2'))

    this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
    this.getVerificationCode = false
    this.getVerificationCodeCountdown = 60
  }
}
// 点击验证码出错
root.methods.error_getVerificationCode = function (err) {
  console.warn('绑定手机号获取手机验证码失败！', err)
  this.popType = 0
  this.popText = this.$t('personalCenterSecurityCenterReleaseMobile.popText_0')
  this.popOpen = true
}

// 提交
root.methods.commit = function () {
  if (this.sending) return
  let canSend = true
  canSend = this.testMobile() && canSend
  if (this.psw === '') {
    this.pswWA = this.$t('personalCenterSecurityCenterReleaseMobile.pswWA_0')
    canSend = false
  }
  if (this.mobile === '') {
    this.mobileWA = this.$t('personalCenterSecurityCenterReleaseMobile.mobileWA_1')
    canSend = false
  }
  if (this.verificationCode === '') {
    this.verificationCodeWA = this.$t('personalCenterSecurityCenterReleaseMobile.verificationCodeWA_3')
    canSend = false
  }

  if (!canSend) {
    return
  }
  let email = this.$store.state.authMessage.email

  this.$http.send('POST_COMMON_AUTH_UNBIND', {
    bind: this,
    params: {
      type: 'mobile',
      purpose: 'unbind',
      examinee: this.mobile,
      code: this.verificationCode,
      password: this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.psw).toString()
    },
    callBack: this.re_commit,
    errorHandler: this.error_commit,
  })

  this.sending = true
  this.popType = 2
  this.popOpen = true

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
    data.errorCode === 1 && (this.pswWA = this.$t('personalCenterSecurityCenterReleaseMobile.pswWA_1'))
    data.errorCode === 2 && (this.mobileWA = this.$t('personalCenterSecurityCenterReleaseMobile.mobileWA_2'))
    return
  }
  if (this.isMobile) {
    this.$router.push('/index/personal/auth/authentication')
  } else {
    this.$router.push('/index/personal/securityCenter')
  }
}
root.methods.error_commit = function (err) {
  console.warn("绑定手机出错", err)
  this.sending = false
  this.popOpen = false
  this.popType = 0
  this.popText = this.$t('personalCenterSecurityCenterReleaseMobile.popText_0')
  setTimeout(() => {
    this.popOpen = true
  }, 100)

}


// 弹窗
root.methods.popClose = function () {
  this.popOpen = false
}


export default root

