const root = {}
root.name = 'PersonalCenterSecurityCenterBindGoogleAuthenticator'

/*----------------------------- 组件 ------------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'QRCodeVue': resolve => require(['qrcode.vue'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}

/*----------------------------- data ------------------------------*/


root.data = function () {
  return {
    loading: true,
    secretKey: '',
    verificationCode: '',
    verificationCodeWA: '',
    psw: '',
    pswWA: '',
    uri: '',

    popType: 0,
    popOpen: false,
    popText: '系统繁忙',

    getAuthReady: false,
    getGAReady: false,


    sending: false,

  }
}

/*----------------------------- 生命周期 ------------------------------*/

root.created = function () {
  this.getAuthState()
  // 发送请求获取
  this.$http.send('POST_VERIFICATION_CODE',
    {
      bind: this,
      params: {
        type: 'ga',
        mun: this.$store.state.authMessage.email,
        purpose: 'bind'
      },
      callBack: this.re_bind_google,
      errorHandler: this.error_bind_google,
    })
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

/*----------------------------- 方法 ------------------------------*/

root.methods = {}
// 获取认证状态
root.methods.getAuthState = function () {
  if (!this.$store.state.authState) {
    this.$http.send('GET_AUTH_STATE', {
      bind: this,
      callBack: this.re_getAuthState,
      errorHandler: this.error_getAuthState
    })
    return
  }
  if (this.$store.state.authState.ga) {
    this.$router.push('/index/personal/securityCenter')
    return
  }
  this.getAuthReady = true
  this.loading = !(this.getAuthReady && this.getGAReady)
}
// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  // console.warn("获取验证状态")
  if (!data) return
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
  if (data.dataMap.ga) {
    this.$router.push('/index/personal/securityCenter')
  }
  this.getAuthReady = true
  this.loading = !(this.getAuthReady && this.getGAReady)

}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
  console.warn("获取验证状态出错！", err)
  this.$router.push('/index/personal/securityCenter')
}

// 检查密码
root.methods.testPsw = function () {
  if (this.psw === '') {
    this.pswWA = ''
    return false
  }
  this.pswWA = ''
  return true
}

// 检查验证码
root.methods.testVerificationCode = function () {
  if (this.verificationCode === '') {
    this.verificationCodeWA = ''
    return false
  }
  this.verificationCodeWA = ''
  return true
}

// 获取谷歌码
root.methods.re_bind_google = function (data) {
  // console.log('data')
  typeof data === 'string' && (data = JSON.parse(data))
  // console.warn('返回谷歌验证url data', data)

  this.uri = data.dataMap.uri
  this.secretKey = data.dataMap.secretKey
  this.getGAReady = true
  this.loading = !(this.getAuthReady && this.getGAReady)
}
root.methods.error_bind_google = function (err) {
  console.warn("返回出错", err)
}

// 点击发送
root.methods.commit = function () {
  if (this.sending) return
  let canSend = true
  canSend = this.testPsw() && canSend
  canSend = this.testVerificationCode() && canSend

  if (this.psw === '') {
    this.pswWA = this.$t('personalCenterSecurityCenterBindGoogleAuthenticator.pswWa')
    canSend = false
  }
  if (this.verificationCode === '') {
    this.verificationCodeWA = this.$t('personalCenterSecurityCenterBindGoogleAuthenticator.verificationCodeWA')
    canSend = false
  }
  if (!canSend) {
    return
  }

  this.sending = true
  this.popType = 2
  this.popOpen = true
  this.$http.send('POST_COMMON_AUTH', {
    bind: this,
    params: {
      "type": "ga",
      "code": this.verificationCode,
      "examinee": this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.psw).toString(),
      "purpose": 'bind'
    },
    callBack: this.re_commit,
    errorHandler: this.error_commit
  })
}
root.methods.re_commit = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.sending = false
  this.popOpen = false
  // console.warn("提交返回！", data)

  if (data.errorCode) {
    data.errorCode === 1 && (this.pswWA = this.$t('personalCenterSecurityCenterBindGoogleAuthenticator.pswWa_1'))
    data.errorCode === 2 && (this.pswWA = this.$t('personalCenterSecurityCenterBindGoogleAuthenticator.pswWa_2'))
    data.errorCode === 3 && (this.pswWA = this.$t('personalCenterSecurityCenterBindGoogleAuthenticator.pswWa_3'))
    data.errorCode === 4 && (this.verificationCodeWA = this.$t('personalCenterSecurityCenterBindGoogleAuthenticator.verificationCodeWA_1'))
    data.errorCode === 5 && (this.pswWA = this.$t('personalCenterSecurityCenterBindGoogleAuthenticator.pswWa_4'))
    return
  }
  this.$router.push('/index/personal/securityCenter')
}
root.methods.error_commit = function (err) {
  console.warn("绑定谷歌验证码失败！", err)
  this.sending = false
  this.popOpen = false
  this.popType = 0
  this.popText = this.$t('personalCenterSecurityCenterBindGoogleAuthenticator.popText')
  setTimeout(() => {
    this.popOpen = true
  }, 200)
}
// 关闭提示窗
root.methods.popClose = function () {
  this.popOpen = false
}
// 点击复制
root.methods.clickCopy = function () {
  // console.log("this is ref", this.$refs.address)
  let input = this.$refs.address
  input.select()
  document.execCommand("copy")

  this.popType = 1
  this.popText = this.$t('personalCenterSecurityCenterBindGoogleAuthenticator.copyRight')

  this.popOpen = true

}

export default root
