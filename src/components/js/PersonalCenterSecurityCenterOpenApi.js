const root = {};

root.name = 'PersonalCenterSecurityCenterOpenApi';

root.data = function () {
  return {
    key_name: '',
    api_ip: '',

    // 成功
    send_success: false,

    // 弹框
    promptOpen: false,
    popType: 0,
    popText: '系统繁忙',

    // 展示验证信息框
    show_ga_sms_dialog: false,
    // 验证信息
    verificationCode: '',
    verificationCodeWA: '',

    getVerificationCode: false,
    getVerificationCodeInterval: null,
    getVerificationCodeCountdown: 60,
    clickVerificationCodeButton: false,

    // 是否显示验证
    showPicker: false,
    bindGA: false,
    bindMobile: false,
    picked: '',
    // 短信码/谷歌码
    GACode: '',
    GACodeWA: '',
    sending: false,
  }
}

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}

root.computed = {};

root.computed.lang = function () {
  return this.$store.state.lang;
}


root.created = function () {
  // 获取验证信息
  this.GET_AUTH_STATE();
}


root.methods = {};

root.methods.CREATE_API = function () {
  let ip_test = /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-5][0-5])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/;
  if (!this.key_name) {
    this.promptOpen = true;
    this.popText = this.lang == 'CH' ? '请输入API秘钥' : 'Enter the Key Remark';
    return;
  }
  if (!!this.api_ip && !ip_test.test(this.api_ip)) {
    this.promptOpen = true;
    this.popText = this.lang == 'CH' ? '请输入正确的IP' : 'Enter trust ip';
    return;
  }
  this.show_ga_sms_dialog = true;
}

// 关闭弹窗
root.methods.closePrompt = function () {
  this.promptOpen = false;
}

// 关闭验证框
root.methods.CLOSE_GA_SMS_DIALOG = function () {
  this.show_ga_sms_dialog = false;
}

// 检测验证码
root.methods.testVerificationCode = function () {
  if (this.picked !== 'bindMobile') {
    this.verificationCodeWA = ''
    return true
  }
  if (this.verificationCode === '') {
    this.verificationCodeWA = ''
    return false
  }
  this.verificationCodeWA = ''
  return true
}

// 检测谷歌验证码
root.methods.testGACode = function () {
  if (this.picked !== 'bindGA') {
    this.GACodeWA = ''
    return true
  }
  if (this.GACode === '') {
    this.GACodeWA = ''
    return false
  }
  this.GACodeWA = ''
  return true

}

// 认证状态
root.methods.GET_AUTH_STATE = function () {
  this.$http.send("GET_AUTH_STATE", {
    bind: this,
    callBack: this.RE_GET_AUTH_STATE,
    errorHandler: this.error_getCurrency
  })
}
root.methods.RE_GET_AUTH_STATE = function (res) {
  typeof res === 'string' && (res = JSON.parse(res));
  let data = res.dataMap;
  this.identity_type = data;
  if (res.result == 'SUCCESS' && (data.sms || data.ga)) {
    this.identity = true;
  }
  // 两者都验证了
  this.bindGA = data.ga;
  this.bindMobile = data.sms;
  this.bindMobile && (this.picked = 'bindMobile');
  this.bindGA && (this.picked = 'bindGA');
  if (this.bindGA && this.bindMobile) {
    this.showPicker = true;
  }

  this.loading = false
}

// 点击发送
root.methods.click_send = function () {
  let canSend = true;

  if (this.verificationCode === '' && this.picked === 'bindMobile') {
    this.verificationCodeWA = this.$t('verificationCodeWA_0')
    canSend = false
  }
  if (!this.clickVerificationCodeButton && this.picked === 'bindMobile') {
    this.verificationCodeWA = this.$t('verificationCodeWA_1')
    canSend = false
  }
  if (this.GACode === '' && this.picked === 'bindGA') {
    this.GACodeWA = this.$t('GACodeWA_0')
    canSend = false
  }


  if (!canSend) {
    // console.log("不能发送！")
    return
  }

  let pickedType = ''
  if (this.picked === 'bindMobile') {
    pickedType = 'mobile'
  }
  if (this.picked === 'bindGA') {
    pickedType = 'ga'
  }

  let code = ''
  this.picked === 'bindGA' && (code = this.GACode)
  this.picked === 'bindMobile' && (code = this.verificationCode)
  // console.log('emailemial', this.$route.query.email)

  this.sending = true;

  let params

  console.log(code, 'code')

  if (pickedType === 'mobile') {
    params = {
      "method": pickedType,
      "code": code,
      "description": this.key_name,
      "api_ip": this.api_ip || '0.0.0.0',
      "url": document.location.origin + '/index/personal/securityCenter/manageApi'
    };
    this.$http.send('API_KEY_EMAIL', {
      bind: this,
      params: params,
      callBack: this.RE_API_KEY_EMAIL,
      errorHandler: this.ERROR_LOAD_OPEN_API
    })
    return
  }

  params = {
    "method": pickedType,
    "code": code,
    "description": this.key_name,
    "api_ip": this.api_ip || '0.0.0.0',
    "url": document.location.origin + '/index/personal/securityCenter/manageApi'
  }

  this.$http.send('API_KEY_EMAIL', {
    bind: this,
    params: params,
    callBack: this.RE_API_KEY_EMAIL,
    errorHandler: this.ERROR_LOAD_OPEN_API
  })

}

root.methods.ERROR_LOAD_OPEN_API = function () {
  this.sending = false;
}

root.methods.RE_API_KEY_EMAIL = function (res) {
  if (typeof res === 'string') res = JSON.parse(res);
  if (res.errorCode == 0) {
    this.CLOSE_GA_SMS_DIALOG();
    this.send_success = true;
  }
  if (res.errorCode == 1) {
    this.verificationCodeWA = '用户未登录';
    this.GACodeWA = '用户未登录';
    this.sending = false;
  }
  if (res.errorCode == 2) {
    this.verificationCodeWA = '暂不可用';
    this.GACodeWA = '暂不可用';
    this.sending = false;
  }
  if (res.errorCode == 3) {
    this.verificationCodeWA = '验证码错误';
    this.GACodeWA = '验证码错误';
    this.sending = false;
  }
}

// 点击发送验证码
root.methods.click_getVerificationCode = function () {

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

  this.$http.send('GET_VERIFICATIONCODE', {
    bind: this,
    params: {
      "mun": "create",
      "purpose": "apikey",
      "type": "mobile"
    },
    callBack: this.re_getVerificationCode
  })

}


root.methods.re_getVerificationCode = function (data) {
  if (typeof data === 'string') data = JSON.parse(data);
  let errorCode = data.errorCode;
  if (errorCode > 0) {
    this.getVerificationCode = true;
  }
  if (errorCode == 1) {
    this.verificationCodeWA = '用户未登录';
  }
  if (errorCode == 2) {
    this.verificationCodeWA = '此用户未绑定手机';
  }
  if (errorCode == 3) {
    this.verificationCodeWA = '发送过于频繁';
  }
  if (errorCode == 4) {
    this.verificationCodeWA = '参数错误';
  }
}


export default root;
