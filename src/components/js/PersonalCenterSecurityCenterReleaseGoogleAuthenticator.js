const root = {}
root.name = 'PersonalCenterSecurityCenterReleaseGoogleAuthenticator'

/*--------------------------- 组件 -----------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}

/*--------------------------- data -----------------------------*/

root.data = function () {
  return {
    loading: true,
    psw: '',
    pswWA: '',

    GACode: '',
    GACodeWA: '',

    popType: 0,
    popOpen: false,
    popText: '系统繁忙',

    sending: false,

  }
}

/*--------------------------- 生命周期 -----------------------------*/


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

/*--------------------------- 方法 -----------------------------*/


root.methods = {}

// 判断密码
root.methods.testPsw = function () {
  if (this.psw === '') {
    this.pswWA = ''
    return false
  }
  this.pswWA = ''
  return true
}

// 判断谷歌验证码
root.methods.testGACode = function () {
  if (this.GACode === '') {
    this.GACodeWA = ''
    return false
  }
  this.GACodeWA = ''
  return true
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
  if (!this.$store.state.authState.ga) {
    this.$router.push('/index/personal/securityCenter')
    return
  }
  this.loading = false
}
// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
  if (!data.dataMap.ga) {
    this.$router.push('/index/personal/securityCenter')
  }
  this.loading = false
}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
  console.warn("获取验证状态出错！", err)
  this.$router.push('/index/personal/securityCenter')
}
// 点击提交
root.methods.commit = function () {
  if (this.sending) return
  this.popType = 2
  let canSend = true
  canSend = this.testPsw() && canSend
  canSend = this.testGACode() && canSend
  if (this.psw === '') {
    this.pswWA = this.$t('personalCenterSecurityCenterReleaseGoogleAuthenticator.pswWA_0')
    canSend = false
  }
  if (this.GACode === '') {
    this.GACodeWA = this.$t('personalCenterSecurityCenterReleaseGoogleAuthenticator.GACodeWA_0')
    canSend = false
  }
  if (!canSend) {
    return
  }
  let email = this.$store.state.authMessage.email
  this.$http.send("POST_COMMON_AUTH_UNBIND", {
    bind: this,
    params: {
      type: 'ga',
      code: this.GACode,
      examinee: this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.psw).toString(),
      purpose: 'bind'
    },
    callBack: this.re_commit,
    errorHandler: this.error_commit,
  })
  this.popOpen = true
  this.sending = true
}
// 提交返回
root.methods.re_commit = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.sending = false
  this.popOpen = false
  if (!data) return
  console.warn('data', data)
  if (data.errorCode) {
    data.errorCode === 1 && (this.pswWA = this.$t('personalCenterSecurityCenterReleaseGoogleAuthenticator.pswWA_1'))
    data.errorCode === 2 && (this.pswWA = this.$t('personalCenterSecurityCenterReleaseGoogleAuthenticator.pswWA_2'))
    data.errorCode === 3 && (this.GACodeWA = this.$t('personalCenterSecurityCenterReleaseGoogleAuthenticator.GACodeWA_1'))
    data.errorCode === 4 && (this.GACodeWA = this.$t('personalCenterSecurityCenterReleaseGoogleAuthenticator.GACodeWA_2'))
    return
  }
  this.$router.push('/index/personal/securityCenter')
}
// 提交出错
root.methods.error_commit = function (err) {
  console.warn("绑定谷歌出错！", err)
  this.sending = false
  this.popOpen = false
  this.popType = 0
  this.popText = this.$t('personalCenterSecurityCenterReleaseGoogleAuthenticator.popText_0')
  setTimeout(() => {
    this.popOpen = true
  }, 200)
}
// 关闭
root.methods.popClose = function () {
  this.popOpen = false
}


export default root
