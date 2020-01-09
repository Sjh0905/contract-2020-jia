const root = {}
root.name = 'SignPageVerification'

/*----------------------------- 组件 ------------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),

}

/*----------------------------- data ------------------------------*/

root.data = function () {
  return {
    loading: false,

    getVerificationCode: false,
    getVerificationCodeInterval: null,
    getVerificationCodeCountdown: 60,
    clickVerificationCodeButton: false,

    verificationCode: '',
    verificationCodeWA: '',

    bindGA: false,
    bindMobile: false,
    picked: '',

    GACode: '',
    GACodeWA: '',

    sending: false,

    popType: 0,
    popOpen: false,
    popText: '系统繁忙',

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
  if (!this.$route.query.email && !this.$route.query.mobile) {
    this.$router.push({name: 'login'})
    return
  }

  //做这一步是为了GET_COOKIES接口获取后能正常处理toUrl
  this.toUrl = this.$route.query.toUrl

  this.getLoginAuthState()
}
root.mounted = function () {
  // 监听键盘事件
  document.onkeydown = (event) => {
    // console.warn('this is kye',event.keyCode)
    if (event.keyCode === 13) {
      this.click_send()
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

root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
root.computed.showPicker = function () {
  // console.log(this.showPicker)
  return this.bindGA && this.bindMobile
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

root.methods.closePrompt = function () {
  this.popOpen = false;
}
// 关闭弹框
root.methods.popWindowClose = function () {
  this.popWindowOpen = false;
}
// 获取验证状态
root.methods.getLoginAuthState = function () {

  this.$http.send('VERIFYING_LOGIN_STATE', {
    bind: this,
    params: {
      email: this.$route.query.email,
      mobile: this.$route.query.mobile
    },
    callBack: this.re_getLoginAuthState,
    errorHandler: this.error_getLoginAuthState,
  })
}
root.methods.re_getLoginAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.bindGA = data.dataMap.ga
  this.bindMobile = data.dataMap.sms

  this.bindMobile && (this.picked = 'bindMobile')
  this.bindGA && (this.picked = 'bindGa')

  this.loading = false
}
root.methods.error_getLoginAuthState = function (err) {
  // console.warn("获取验证状态请求出错！", err)
  this.$router.push({name: 'login'})
}

// 开始发送验证码倒计时
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

// 结束发送验证码倒计时
root.methods.endCountDownVerification = function () {
  this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
  this.getVerificationCode = false
  this.getVerificationCodeCountdown = 60
}


// 点击获取验证码
root.methods.click_getVerificationCode = function () {
  this.clickVerificationCodeButton = true

  this.beginCountDownVerification()

  // 发送
  let params = {
    "type": "mobile",
    "mun": this.$route.query.email ? this.$route.query.email : this.$route.query.mobile,
    "purpose": "login"
  }


  this.$http.send('POST_VERIFICATION_CODE', {
    bind: this,
    params: params,
    callBack: this.re_getVerificationCode,
    errorHandler: this.error_getVerificationCode
  })
}

// 验证码回复
root.methods.re_getVerificationCode = function (data) {
  if (typeof data === 'string') data = JSON.parse(data)
  if (data.errorCode) {
    switch (data.errorCode) {
      case 1:
        this.verificationCodeWA = this.$t('verificationCodeWA_0')
        break;
      case 2:
        this.verificationCodeWA = this.$t('verificationCodeWA_1')
        break;
      case 4:
        this.verificationCodeWA = this.$t('verificationCodeWA_3')
        break;
      case 8:
        this.verificationCodeWA = this.$t('verificationCodeWA_82')
        break;
      case 16:
        this.verificationCodeWA = this.$t('verificationCodeWA_16')
        break;
      default:
        this.verificationCodeWA = '暂不可用'
    }
    this.endCountDownVerification()
  }
}
// 验证码回复出错
root.methods.error_getVerificationCode = function (err) {
  this.$router.push({name: 'login'})
}

// 测试绑定谷歌验证码
root.methods.testGACode = function () {
  if (this.GACode === '') {
    this.GACodeWA = ''
    return false
  }
  this.GACodeWA = ''
  return true
}
// 测试手机短信
root.methods.testVerificationCode = function () {
  if (this.verificationCode === '') {
    this.verificationCodeWA = ''
    return false
  }
  this.verificationCodeWA = ''
  return true
}


// 可以提交
root.methods.canCommit = function () {
  let canSend = true

  if (this.picked === 'bindGa') {
    canSend = this.testGACode() && canSend
    if (this.GACode === '') {
      this.GACodeWA = this.$t("GACodeWA_2")
      canSend = false
    }
  }

  if (this.picked === 'bindMobile') {
    canSend = this.testVerificationCode() && canSend
    if (this.verificationCode === '') {
      this.verificationCodeWA = this.$t('verificationCodeWA_4')
      canSend = false
    }
  }

  return canSend
}

root.methods.click_send = function () {
  if (this.sending) return

  if (!this.canCommit()) {
    return
  }

  this.popType = 2
  this.popOpen = true
  this.sending = true

  this.$http.send('POST_COMMON_AUTH', {
    bind: this,
    params: {
      type: this.picked === 'bindGa' ? 'ga' : 'mobile',
      code: this.picked === 'bindGa' ? this.GACode : this.verificationCode,
      purpose: 'login',
      examinee: this.$route.query.email ? this.$route.query.email : this.$route.query.mobile,
      'source': this.isMobile ? 'H5' : 'WEB'
    },
    errorHandler: this.error_commit,
    callBack: this.re_commit
  })
}

root.methods.re_commit = function (data) {
  this.popOpen = false
  this.sending = false

  typeof data === 'string' && (data = JSON.parse(data))
  // console.warn(data)

  if (data.errorCode || data.result === 'FAIL') {
    if (this.picked === 'bindGa') {
      if (data.errorCode === '1') {
        window.reload()
      }
      switch (data.errorCode) {
        case 3:
          this.GACodeWA = this.$t('GACodeWA_5')
          break;
        case 4:
          this.GACodeWA = this.$t('GACodeWA_6')
          break;
        default:
          this.GACodeWA = '暂不可用'
      }
    }
    if (this.picked === 'bindMobile') {
      switch (data.errorCode) {
        case 1:
          this.verificationCodeWA = this.$t('verificationCodeWA_5')
          break;
        case 2:
          this.verificationCodeWA = this.$t('verificationCodeWA_6')
          break;
        case 3:
          this.verificationCodeWA = this.$t('verificationCodeWA_7')
          break;
        case 4:
          this.verificationCodeWA = this.$t('verificationCodeWA_8')
          break;
        case 8:
          this.verificationCodeWA = this.$t('verificationCodeWA_82')
          break;
        case 16:
          this.verificationCodeWA = this.$t('verificationCodeWA_16')
          break;
        case 100:
          this.verificationCodeWA = this.$t('verificationCodeWA_100')
          break;
        default:
          this.verificationCodeWA = '暂不可用'
      }

    }
    if (data.errorCode == '2' && !!data.dataMap.times && this.picked === 'bindMobile') {
      let res = data.dataMap;
      this.SHOW_TIPS_FREQUENCY((res.times - res.wrong), res.times, (res.lock / 60));
      setTimeout(() => {
        this.popType = 0;
        this.popOpen = true;
      }, 200);
    }
    if (data.errorCode == '100' && !!data.dataMap.lock && this.picked === 'bindMobile') {
      let res = data.dataMap;
      this.SHOW_TIPS(res.lock / 60);
      setTimeout(() => {
        this.popType = 0;
        this.popOpen = true;
      }, 200);
    }

    return false;
  }

  // 获取cookie
  this.GET_COOKIE();

  this.$store.commit('SET_AUTH_MESSAGE', data.dataMap.userProfile)

  // this.$http.send('SHOW_FLOAT_LAYER', {
  //   bind: this,
  //   callBack: function (res) {
  //     // if (res.trade) {
  //     //   this.$router.push({name: 'FloatingLayerTradingHall'})
  //     //   return;
  //     // }
  //     // if (res.share) {
  //     //   this.$router.push({name: 'FloatingLayerRecommend'})
  //     //   return;
  //     // }
  //   }
  // })

  if (!!this.$route.query.name) {
    this.$router.push({name: this.$route.query.name})
  } else {
    if(this.$route.query.toUrl && this.$route.query.toUrl == "c2c_url"){
      this.GO_OTC();
      // return;
    }

    this.$router.push({name: 'tradingHall'})
  }


  this.$http.send('GET_AUTH_STATE', {
    bind: this,
    callBack: this.re_get_auth_state
  })
}
// 跳到C2C页面
root.methods.GO_OTC = function () {
  let paras = this.$store.state.save_cookie;
  if (!paras) return;
  let c2c_url = process.env.DOMAIN;
  console.log(c2c_url)
  window.open(c2c_url);
}
// 跳到GRC页面
root.methods.GO_GRC = function () {
  let paras = this.$store.state.save_cookie;
  typeof paras == 'string' && (paras = JSON.parse(paras))
  let _bitsession_ =paras.cookies && paras.cookies.value || '';
  let isApp = false;
  let userId = this.$store.state.authMessage.userId;
  let lang = this.$store.state.lang;
  let GRC_URL = this.$store.state.GRC_URL+'?'+'isApp='+isApp+'&_bitsession_='+_bitsession_+'&userId='+userId+'&lang='+lang;
  window.open(GRC_URL);
}
;
// 返回用户状态
root.methods.re_get_auth_state = function (data) {
  let dataObj = JSON.parse(data)
  this.$store.commit('SET_AUTH_STATE', dataObj.dataMap)
}


root.methods.error_commit = function (err) {
  // console.warn('提交出错！', err)
  this.sending = false
  this.popOpen = false
  this.popType = 0
  this.popText = this.$t('popText_0')
  setTimeout(() => {
    this.popOpen = true
  }, 200)
}

// 关闭弹窗
root.methods.popClose = function () {
  this.popOpen = false
}

// 获取cookie
root.methods.GET_COOKIE = function () {
  this.$http.send('GET_COOKIES', {
    bind: this,
    params: {},
    callBack: this.RE_GET_COOKIE
  })
}
root.methods.RE_GET_COOKIE = function (res) {
  let data = res.cookies;
  let params = {};
  for (let name in data) {
    if (name == 'value' || name == 'name' || name == 'maxAge' || name == 'secure' || name == 'httpOnly') {
      params[name] = data[name];
    }
  }
  let paras = JSON.stringify({cookies: params});
  this.$store.commit('SAVE_COOKIE', paras);

  if(this.toUrl && this.toUrl == "GRC"){
    this.GO_GRC();
    // return;
  }
}


export default root
