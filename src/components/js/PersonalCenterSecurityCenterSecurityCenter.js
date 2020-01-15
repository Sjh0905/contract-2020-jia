const root = {}
root.name = 'PersonalCenterSecurityCenterSecurityCenter'
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupT': resolve => require(['../vue/PopupT'], resolve),
}

root.data = function () {
  return {
    loading: true,
    // 弹框
    promptOpen: false,
    popWindowOpen: false,
    popWindowOpen1:false,
    popWindowOpen2:false,
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
  this.$http.send('GET_AUTH_STATE', {
    bind: this,
    callBack: this.re_getAuthState
  })
  this.getLogRecord()
}

root.methods = {}
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
  this.$router.push({name: 'bindEmail'})
  // this.popWindowTitle = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleRecharge')
  // this.popWindowPrompt = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleBindGaRecharge')
  // this.popWindowStyle = '1'
  // this.popWindowOpen = true
}
// 解绑邮箱验证
root.methods.click_release_email = function () {
  // this.$router.push({name: 'releaseEmail'})
  this.popWindowTitle = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleRecharge')
  this.popWindowPrompt = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleBindGaRecharge')
  this.popWindowStyle = '1'
  this.popWindowOpen = true
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
  console.log(topInfo)

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

export default root
