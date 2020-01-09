const root = {}
root.name = 'PersonalCenterSecurityCenterModifyLoginPassword'

/*------------------------------- 组件 --------------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}

/*------------------------------- data --------------------------------*/

root.data = function () {
  return {
    loading: false,
    oldPsw: '',
    oldPswWA: '',

    psw: '',
    pswWA: '',

    pswConfirm: '',
    pswConfirmWA: '',

    verificationType: '-1',

    GACode: '',
    GACodeWA: '',

    verificationCode: '',
    verificationCodeWA: '',

    getVerificationCode: false,
    getVerificationCodeCountdown: 60,
    getVerificationCodeInterval: null,

    sending: false,

    popOpen: false,
    popType: 0,
    popText: '系统繁忙',

  }
}

/*------------------------------- 生命周期 --------------------------------*/

root.created = function () {
  // this.getAuthState()
}

/*------------------------------- 计算 --------------------------------*/

root.computed = {}
// 是否显示选择
root.computed.showVerificationType = function () {
  return
  if (!this.$store.state.authState) {
    return false
  }
  return this.$store.state.authState.ga && this.$store.state.authState.sms
}


// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}

// 判断是手机用户还是邮箱用户 0为手机用户，1为邮箱用户
root.computed.userType = function () {
  return this.$store.state.authState && this.$store.state.authState.province == 'mobile' ? 0 : 1
}


/*------------------------------- 方法 --------------------------------*/
root.methods = {}
// 获取认证状态 暂时用不到
root.methods.getAuthState = function () {
  if (!this.$store.state.authState) {
    this.$http.send('GET_AUTH_STATE', {
      bind: this,
      callBack: this.re_getAuthState,
      errorHandler: this.error_getAuthState
    })
    return
  }
  this.$store.state.authState.sms && (this.verificationType = '1')
  this.$store.state.authState.ga && (this.verificationType = '0')
  this.loading = false
}
// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
  // console.warn("获取验证状态", data.dataMap)
  data.dataMap.sms && (this.verificationType = '1')
  data.dataMap.ga && (this.verificationType = '0')
  this.loading = false
}

// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
  console.warn("获取验证状态出错！", err)
  this.$router.push('/index/personal/securityCenter')
}

// 判断密码
root.methods.testPsw = function () {
  let isTextPsw = true;
  if (this.oldPsw === '') {
    this.oldPswWA = '请输入原密码'
    isTextPsw = false
  }
  if (this.psw === '') {
    this.pswWA = '请输入新密码'
    isTextPsw = false
  }
  if (!this.$globalFunc.testPsw(this.psw)) {
    this.pswWA = '输入密码不符合规范！'
    isTextPsw = false
  }
  if (this.pswConfirm !== this.psw) {
    this.pswConfirmWA = '两者输入必须一致'
    isTextPsw = false
  }
  if (isTextPsw === false) {
    return false;
  }
  if (isTextPsw === true) {
    this.oldPswWA = ''
    this.pswWA = ''
    this.pswConfirmWA = ''
    return true
  }

}


// 旧密码
root.methods.testOldPsw = function () {
  if (this.oldPsw === '') {
    this.oldPswWA = ''
    return false
  }
  this.oldPswWA = ''
  return true
}
// 表单验证密码
root.methods.testPswPc = function () {
  if (this.pswConfirm !== '' || this.pswConfirm === this.psw) {
    this.testPswConfirm()
  }
  if (this.psw === '') {
    this.pswWA = ''
    return false
  }
  if (!this.$globalFunc.testPsw(this.psw)) {
    this.pswWA = '密码不符合规范，请输入8到16位数字、字母或特殊字符'
    return false
  }
  this.pswWA = ''
  return true
}
// 表单验证确认
root.methods.testPswConfirm = function () {
  if (this.psw !== this.pswConfirm) {
    this.pswConfirmWA = '密码输入不一致'
    return false
  }
  if (this.pswConfirmWA === '') {
    this.pswConfirmWA = ''
    return false
  }
  this.pswConfirmWA = ''
  return true
}

// 验证手机验证码
root.methods.testVerificationCode = function () {
  if (this.verificationCode === '') {
    this.verificationCodeWA = ''
    return false
  }
  this.verificationCodeWA = ''
  return true
}
// 验证谷歌验证码
root.methods.testGACode = function () {
  if (this.GACode === '') {
    this.GACodeWA = ''
    return false
  }
  this.GACodeWA = ''
  return true
}


// 提交
root.methods.commit = function () {
  let canSend = true
  canSend = this.testPsw() && canSend
  //todo commit
  // canSend = this.testPswPc() && canSend
  // canSend = this.testPswConfirm() && canSend

  // this.verificationType === 0 && (canSend = this.testVerificationCode() && canSend)
  // this.verificationType === 1 && (canSend = this.testGACode() && canSend)


  let email = this.$store.state.authMessage.email

  if (!canSend) {
    return
  }

  this.sending = true
  this.popType = 2
  this.popOpen = true

  if (this.userType == 0) {
    this.$http.send('POST_CHANGE_PASSWORD_BY_MOBILE', {
      bind: this,
      params: {
        oldPassword: this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.oldPsw).toString(),
        newPassword: this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.psw).toString(),
      },
      callBack: this.re_commit,
      errorHandler: this.error_commit,
    })
    return
  }

  this.$http.send('POST_CHANGE_PASSWORD', {
    bind: this,
    params: {
      oldPassword: this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.oldPsw).toString(),
      newPassword: this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.psw).toString(),
    },
    callBack: this.re_commit,
    errorHandler: this.error_commit,
  })


}

root.methods.re_commit = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.sending = false
  this.popClose()
  if (data.errorCode) {
    data.errorCode === 1 && (this.oldPswWA = '请登陆后修改密码')
    data.errorCode === 2 && (this.oldPswWA = '原密码输入错误')
    return
  }
  this.popOpen = true
  this.popType = 1
  this.popText = '修改成功'
  setTimeout(() => {
    this.popOpen = false
    this.oldPsw = ''
    this.psw = ''
    this.pswConfirm = ''
    if (this.isMobile) {
      this.$router.push('/index/personal/auth/authentication')
    } else {
      this.$router.push('/index/personal/securityCenter')
    }
  }, 1000)
}

root.methods.error_commit = function () {
  this.sending = false
  this.popOpen = false
  this.popType = 0
  this.popText = '系统繁忙'
  setTimeout(() => {
    this.popOpen = true
  }, 100)
}

// 关闭弹窗
root.methods.popClose = function () {
  this.popOpen = false
}

export default root
