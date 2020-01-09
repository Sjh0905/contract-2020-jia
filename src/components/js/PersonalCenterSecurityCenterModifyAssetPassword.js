const root = {}
root.name = 'PersonalCenterSecurityCenterModifyAssetPassword'
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}
root.data = function () {
  return {
    loading: true,

    oldPsw: '',
    oldPswWA: '',

    psw: '',
    pswWa: '',

    pswConfirm: '',
    pswConfirmWA: '',

    verificationCode: '',
    verificationCodeWA: '',

    GACode: '',
    GACodeWA: '',


  }
}
root.created = function () {

}

root.methods = {}

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
// 获取认证状态
root.methods.re_getAuthState = function () {

}
// 获取认证状态出错
root.methods.error_getAuthState = function () {

}

export default root
