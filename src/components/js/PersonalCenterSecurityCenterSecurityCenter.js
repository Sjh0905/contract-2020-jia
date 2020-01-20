const root = {}
root.name = 'PersonalCenterSecurityCenterSecurityCenter'
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupT': resolve => require(['../vue/PopupT'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PersonalCenterSecurityCenterBindEmail': resolve => require(['../vue/PersonalCenterSecurityCenterBindEmail'], resolve),
  'PersonalCenterSecurityCenterReleaseEmail': resolve => require(['../vue/PersonalCenterSecurityCenterReleaseEmail'], resolve),
}

root.data = function () {
  return {
    loading: true,
    // 弹框
    promptOpen: false,
    popWindowOpen: false,
    popWindowOpen1:false,
    popWindowOpen2:false,

    popOpen: false,
    popType: 0,
    popText: '系统繁忙',

    getVerificationCode: false,
    getVerificationCodeInterval: null,
    getVerificationCodeCountdown: 60,
    clickVerificationCodeButton: false,
    offset: 0, //
    limit: 3,

    logRecord: [], //记录
    loadingMoreShow: true, //是否显示加载更多
    loadingMoreIng: false, //是否正在加载更多

    uid:'',
    lastTime:0, // 最后登录时间
    ip:'',

    popWindowTitle: '', //弹出提示标题
    popWindowPrompt: '',//弹出样式提示
    popWindowStyle: 0,//跳转 0表示实名认证，1表示手机或谷歌，2只有确定

    //ssss======
    oldPsw: '',
    oldPswWA: '',

    psw: '',
    pswWA: '',

    pswConfirm: '',
    pswConfirmWA: '',

    pswge: '',
    pswWAge: '',
    GACodege: '',
    GACodeWAge: '',
    // testPswge: '',
    // testGACodege: '',
    showBindEmail: false,
    showReleaseEmail: false,
  }
}

root.computed = {}

// 是否绑定了谷歌
root.computed.bindGA = function () {
  if (!this.$store.state.authState.ga) {
    return false
  }
  return true
}
// 是否绑定了手机
root.computed.bindPhone = function () {
  if (!this.$store.state.authState.sms) {
    return false
  }
  return true
}
// 是否绑定了邮箱
root.computed.bindEmail = function () {
  if (!this.$store.state.authState.email) {
    return false
  }
  return true
}
// 是否绑定了资金密码
root.computed.bindCapital = function () {
  if (!this.$store.state.authState.capital) {
    return false
  }
  return true
}
// 是否打开了api
root.computed.open_api = function () {
  if (!this.$store.state.authState.apikey) {
    return false
  }
  return true
}
// 用户类型，如果是手机用户，为0，如果是邮箱用户，为1
root.computed.isUserType = function () {
  return this.$store.state.authMessage && this.$store.state.authMessage.province === 'mobile' ? 0 : 1
}

// 用户名
root.computed.userName = function () {
  if (this.userType === 0) {
    return this.$globalFunc.formatUserName(this.$store.state.authMessage.mobile)
  }
  if (!this.$store.state.authMessage.email) {
    return '****@****'
  }
  return this.$globalFunc.formatUserName(this.$store.state.authMessage.email)
}

// 用户类型，如果是手机用户，为0，如果是邮箱用户，为1
root.computed.userType = function () {
  return this.$store.state.authMessage && this.$store.state.authMessage.province === 'mobile' ? 0 : 1
}

// uid
root.computed.uuid = function () {
  if(this.$store.state.authMessage.uuid == undefined){
    return this.$store.state.authMessage.userId
  }
  return this.$store.state.authMessage.uuid
}


root.created = function () {
 this.getAuthState()
  this.getLogRecord()
}

root.methods = {}
root.methods.getAuthState = function (){
  this.$http.send('GET_AUTH_STATE', {
    bind: this,
    callBack: this.re_getAuthState
  })
}

root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  let dataObj = data
  console.log("获取了状态！", dataObj)
  this.$store.commit('SET_AUTH_STATE', dataObj.dataMap)
  this.loading = false
}

// 关闭弹窗
root.methods.closePrompt = function () {
  this.promptOpen = false
}

// 弹窗关闭
root.methods.popWindowClose = function () {
  this.popWindowOpen = false
}
// 弹窗关闭
root.methods.popWindowClose1 = function () {
  this.popWindowOpen1 = false
}
// 弹窗关闭
root.methods.popWindowClose2 = function () {
  this.popWindowOpen2 = false
}
//
// // 设置资金密码
// root.methods.click_set_asset_psw = function () {
//   this.$router.push('/index/personal/securityCenter/setAssetPassword')
// }
// // 修改资金密码
// root.methods.click_modify_asset_psw = function () {
//   this.$router.push('/index/personal/securityCenter/modifyAssetPassword')
// }
// // 找回资金密码
// root.methods.click_retrieve_asset_psw = function () {
//   this.$router.push('/index/personal/securityCenter/retrieveAssetPassword')
// }
// 绑定谷歌验证
root.methods.click_bind_GA = function () {
  this.$router.push({name: 'bindGoogleAuthenticator'})
    // this.popWindowTitle = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleRecharge')
    // this.popWindowPrompt = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleBindGaRecharge')
    // this.popWindowStyle = '1'
    // this.popWindowOpen = true
}
// 解绑谷歌验证
root.methods.click_release_GA = function () {
  // this.$router.push({name: 'releaseGoogleAuthenticator'})
  // this.$router.push({name: 'modifyLoginPassword'})
  this.popWindowTitle = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleRecharge')
  this.popWindowPrompt = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleBindGaRecharge')
  this.popWindowStyle = '1'
  this.popWindowOpen2 = true
}
// 修改登录密码
root.methods.click_change_login_psw = function () {
  // this.$router.push({name: 'modifyLoginPassword'})
  this.popWindowTitle = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleRecharge')
  this.popWindowPrompt = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleBindGaRecharge')
  this.popWindowStyle = '1'
  this.popWindowOpen1 = true
}

// 绑定手机验证
root.methods.click_bind_mobile = function () {
  this.$router.push({name: 'bindMobile'})
}
// 解绑手机验证
root.methods.click_release_mobile = function () {
  this.$router.push({name: 'releaseMobile'})
}
// 绑定邮箱验证
root.methods.click_bind_email = function () {
  // this.$router.push({name: 'bindEmail'})
  this.showBindEmail = true
  // this.popWindowTitle = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleRecharge')
  // this.popWindowPrompt = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleBindGaRecharge')
  // this.popWindowStyle = '1'
  // this.popWindowOpen = true
}
// 解绑邮箱验证
root.methods.click_release_email = function () {
  // this.$router.push({name: 'releaseEmail'})
  this.showReleaseEmail = true
  // this.popWindowTitle = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleRecharge')
  // this.popWindowPrompt = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleBindGaRecharge')
  // this.popWindowStyle = '1'
  // this.popWindowOpen = true
}
root.methods.click_rel_em = function () {
  this.popWindowOpen = false
  this.popWindowOpen1 = false
  this.popWindowOpen2 = false
}


//临时绑定机器人
root.methods.click_ai = function () {
  this.$router.push('/index/personal/securityCenter/templateApi')
}
// 启用API
root.methods.click_bind_API = function () {
  if (!this.bindEmail) {
    this.promptOpen = true;
    // this.popText = '请先绑定邮箱';
    this.popText = this.$t('api_prompt_1')
    return false;
  }
  if (!this.bindGA && !this.bindPhone) {
    this.promptOpen = true;
    this.popText = this.$t('api_prompt_2')
    return false;
  }
  this.$router.push({name: 'openApi'})
}
// 管理API
root.methods.click_manage_API = function () {
  this.$router.push({name: 'manageApi'})
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

// 获取安全日志记录
root.methods.getLogRecord = function () {
  this.$http.send('POST_LOG_RECORD', {
    bind: this,
    params: {
      offset: this.offset,
      maxResults: this.limit,
    },
    callBack: this.re_getLogRecord,
    errorHandler: this.error_getLogRecord,
  })
}
// 获取安全日志记录回调
root.methods.re_getLogRecord = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.warn('获取安全日志记录', data)
  this.logRecord.push(...data.dataMap.loginRecords)
  let topInfo = data.dataMap.loginRecords[0]
  console.log(this.logRecord)

  this.uid = topInfo.userId
  this.lastTime = topInfo.createdAt
  this.ip = topInfo.ip


  // console.log(this.logRecord)

  // if (data.dataMap.loginRecords.length < this.limit) {
  //   this.loadingMoreShow = false
  // }
  //
  // this.offset = this.offset + this.limit
  // this.loading = false
  // this.loadingMoreIng = false
}
// 获取安全日志记录出错
root.methods.error_getLogRecord = function (err) {
  console.warn('安全日志记录出错', err)
}

// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD hh:mm:ss')
}

// 跳转安全日志
root.methods.clickToLoadMore = function () {
  this.$router.push('/index/personal/securityLog')
}

// 跳转身份认证页面
root.methods.toAuthentication = function () {
  this.$router.push('/index/personal/auth/authenticate')
}

//sss============= 修改登陆密码St
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
    this.popWindowOpen1 = false
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

//sss============= 修改登陆密码En

//sss============= 解绑谷歌验证St

// 判断密码
root.methods.testPswge = function () {
  if (this.pswge === '') {
    this.pswWAge = ''
    return false
  }
  this.pswWAge = ''
  return true
}

// 判断谷歌验证码
root.methods.testGACodege = function () {
  if (this.GACodege === '') {
    this.GACodeWAge = ''
    return false
  }
  this.GACodeWAge = ''
  return true
}

// 判断验证状态
root.methods.getAuthStatege = function () {
  if (!this.$store.state.authState) {
    this.$http.send('GET_AUTH_STATE', {
      bind: this,
      callBack: this.re_getAuthStatege,
      errorHandler: this.error_getAuthStatege
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
root.methods.re_getAuthStatege = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
  if (!data.dataMap.ga) {
    this.$router.push('/index/personal/securityCenter')
  }
  this.loading = false
}
// 判断验证状态出错
root.methods.error_getAuthStatege = function (err) {
  console.warn("获取验证状态出错！", err)
  this.$router.push('/index/personal/securityCenter')
}

// 点击提交
root.methods.commitge = function () {
  if (this.sending) return
  let canSend = true
  canSend = this.testPswge() && canSend
  canSend = this.testGACodege() && canSend
  if (this.pswge === '') {
    this.pswWAge = this.$t('personalCenterSecurityCenterReleaseGoogleAuthenticator.pswWA_0')
    canSend = false
  }
  if (this.GACodege === '') {
    this.GACodeWAge = this.$t('personalCenterSecurityCenterReleaseGoogleAuthenticator.GACodeWA_0')
    canSend = false
  }
  if (!canSend) {
    return
  }
  this.sending = true
  this.popType = 2
  this.popOpen = true
  let email = this.$store.state.authMessage.email
  this.$http.send("POST_COMMON_AUTH_UNBIND", {
    bind: this,
    params: {
      type: 'ga',
      code: this.GACodege,
      examinee: this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.pswge).toString(),
      purpose: 'bind'
    },
    callBack: this.re_commitge,
    errorHandler: this.error_commitge,
  })

}
// 提交返回
root.methods.re_commitge = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))

  if (!data) return
  this.sending = false
  this.popClose()
  console.warn('data', data)
  if (data.errorCode) {
    data.errorCode === 1 && (this.pswWAge = this.$t('personalCenterSecurityCenterReleaseGoogleAuthenticator.pswWA_1'))
    data.errorCode === 2 && (this.pswWAge = this.$t('personalCenterSecurityCenterReleaseGoogleAuthenticator.pswWA_2'))
    data.errorCode === 3 && (this.GACodeWAge = this.$t('personalCenterSecurityCenterReleaseGoogleAuthenticator.GACodeWA_1'))
    data.errorCode === 4 && (this.GACodeWAge = this.$t('personalCenterSecurityCenterReleaseGoogleAuthenticator.GACodeWA_2'))
    return
  }
  this.popOpen = true
  this.popType = 1
  this.popText = '解绑成功'
  // this.bindGA()
  setTimeout(() => {
    this.popOpen = false
    this.popWindowOpen2 = false
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
// 提交出错
root.methods.error_commitge = function (err) {
  console.warn("绑定谷歌出错！", err)
  this.sending = false
  this.popOpen = false
  this.popType = 0
  this.popText = this.$t('personalCenterSecurityCenterReleaseGoogleAuthenticator.popText_0')
  setTimeout(() => {
    this.popOpen = true
  }, 200)
}

// 关闭弹窗
root.methods.closeReleaseEmail = function (type,callApi) {
  if(callApi){
    this.getAuthState();
  }
  this.showBindEmail = type
  this.showReleaseEmail = type
}

//sss============= 解绑谷歌验证En
// 关闭弹窗
root.methods.popClose = function () {
  this.popOpen = false
}

export default root
