const root = {}
const Ip = require('public-ip')
root.name = 'SignPageLogin'

// import '../../../static/verify-master/js/verify'
// import '../../../static/verify-master/css/verify.css'
import '../../../static/gt'

/*------------------------------ 组件 -------------------------------*/


root.components = {
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
}

/*------------------------------ data -------------------------------*/

root.data = function () {
  return {
    loading: false,

    userName: '',
    userNameWA: '',

    psw: '',
    pswWA: '',

    mobile: '', // 手机号
    mobileWA: '', // 手机号的错误码

    mobilePsw: '',
    mobilePswWA: '',

    // 用户网段ip
    userAddressIp: '',
    // 用户所在地址
    userAddress: '',

    addressInterval: null, //获取地址的循环请求
    intervalTime: 0, //请求次数


    sending: false,

    popType: 0,
    popOpen: false,
    popText: '系统繁忙',

    captcha: null, //极验
    captchaReady: false,//极验完成

    // 2018-5-4
    popWindowOpen: false, //弹窗开关
    frequency: 0,        // 剩余次数
    hours: 0,            // 冻结几小时
    total_frequency: 0,  // 累计多少次
    pop_tips1: '',
    pop_tips2: '',
    toast_tips: '',

    // 2018-7-27 新登录注册
    loginType: 0, // 0为手机登录，1为邮箱登录

    // 2018-07-30 h5增加focus效果
    mobileFocus: false,
    mobilePswFocus: false,
    mobileUserNameFocus: false,

    userNamePlaceholderShow:true,
    pswPlaceholderShow:true
  }
}

/*------------------------------ 生命周期 -------------------------------*/

root.created = function () {
  this.$store.commit('changeMobileHeaderTitle', '');

  //做这一步是为了GET_COOKIES接口获取后能正常处理toUrl
  this.toUrl = this.$route.query.toUrl

  this.SHOW_POP(1, 2, 3);
  let that = this;
  Ip.v4().then(ip => {
    that.userAddressIp = ip;
  })
  this.userAddress = 'unknown-unknown'
  this.getGeetest();
}


root.mounted = function () {
  // 监听键盘事件
  document.onkeydown = (event) => {
    if (event.keyCode === 13) {
      // this.clickGeetest()
      // this.loginIn();
    }
  }
}

root.beforeDestroy = function () {
  this.addressInterval && clearInterval(this.addressInterval)
  // 取消监听键盘事件
  document.onkeydown = (event) => {
  }
}

/*------------------------------ 计算 -------------------------------*/

root.computed = {}
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
// 语言
root.computed.lang = function () {
  return this.$store.state.lang
}
// 极验
root.computed.geetestType = function () {
  return this.$store.state.isMobile ? 'h5' : 'web'
}

/*------------------------------ 方法 -------------------------------*/

root.methods = {}
// 去注册
root.methods.RE_PASSWORD = function () {
  this.$router.push({name: 'findBackPsw'});
}
// 重试
root.methods.TRY_AGAIN = function () {
  this.popWindowOpen = false;
}
// 提示弹框错误
root.methods.SHOW_POP = function (frequency, total_frequency, hours) {
  this.frequency = frequency;
  this.hours = hours;
  this.total_frequency = total_frequency;
  if (this.lang == 'CH') {
    this.pop_tips1 = this.$t('psd_1') + this.frequency + this.$t('psd_2');
    this.pop_tips2 = this.$t('psd_3') + this.total_frequency + this.$t('psd_4') + this.hours + this.$t('hour');
  } else {
    this.pop_tips1 = this.$t('psd_1') + this.frequency + this.$t('psd_2');
    this.pop_tips2 = this.total_frequency + this.$t('psd_3') + this.hours + this.$t('hour') + this.$t('psd_4');
  }
}

// 提示toast错误
root.methods.SHOW_TIPS = function (hours) {
  this.hours = hours;
  if (this.lang == 'CH') {
    this.popText = this.$t('psd_error1') + this.hours + this.$t('psd_error2');
  } else {
    this.popText = this.$t('psd_error1') + this.hours + this.$t('hour');
  }
}

root.methods.closePrompt = function () {
  this.popOpen = false;
}

// 选择登录方式
root.methods.choseLoginType = function (type) {
  this.loginType = type
}

// 获取焦点后关闭placheholder
root.methods.closePlaceholder = function (type) {
  // alert(type);
  if(type == 'userName'){
    this.userNamePlaceholderShow = false;
  }

  if(type == 'psw'){
    this.pswPlaceholderShow = false;
  }

}


/*----------------- 极验 ------------------*/
// 获取极验
root.methods.getGeetest = function () {
  this.$http.send('GET_GEETEST_INIT', {
    params: {client_type: this.geetestType},
    bind: this,
    callBack: this.re_getGeetest,
    errorHandler: this.error_getGeetest
  })
}

// 开始极验
root.methods.re_getGeetest = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data));
  if (!data || !data.dataMap || data.result === 'FAIL') {
    return
  }
  this.captchaReady = true
  let res = JSON.parse(data.dataMap.resStr)
  initGeetest({
    gt: res.gt,
    challenge: res.challenge,
    offline: !res.success,
    new_captcha: true,
    product: 'bind',
    width: '20rem',
    lang: this.lang === 'CH' ? 'zh-cn' : 'en',
  }, (captchaObj) => {
    this.initVerification(captchaObj)
  })
}

// 初始化极验
root.methods.initVerification = function (captchaObj) {
  this.captcha = captchaObj
  this.captcha.onReady(() => {
  }).onClose(() => {
  }).onSuccess(this.loginIn)
}

// 获取极验出错
root.methods.error_getGeetest = function (err) {
  console.warn('获取极验出错', err)
}

// 点击验证极验
root.methods.clickGeetest = function () {
  // 登录验证
  if (!this.canSend()) {
    return
  }
  console.warn('haha')
  this.captcha.verify();
}


/*----------------- 极验 end ------------------*/
// 表单验证
root.methods.canSend = function () {
  let canSend = true
  // 如果是手机
  // if (this.loginType == 0) {
  //   canSend = this.testMobilePsw() && canSend
  //   canSend = this.testMobile() && canSend
  //   if (this.mobile === '') {
  //     this.mobileWA = this.$t('mobileWA_1')
  //     canSend = false
  //   }
  //   if (this.mobilePsw === '') {
  //     this.mobilePswWA = this.$t('pswWA_0')
  //     canSend = false
  //   }
  // }
  // 如果是邮箱
  // if (this.loginType == 1) {
    canSend = this.testPsw() && canSend
    canSend = this.testUserName() && canSend
    if (this.userName === '') {
      this.userNameWA = this.$t('userNameWA_0')
      canSend = false
    }
    if (this.psw === '') {
      this.pswWA = this.$t('pswWA_0')
      canSend = false
    }
  // }
  return canSend
}


// 根据ip获取详细地址  接入新浪接口
root.methods.getAddress = function (cb) {
  this.addressInterval && clearInterval(this.addressInterval)
  var script = document.createElement("script"),
    s = document.getElementsByTagName("script")[0];
  script.src = "http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=jsonp";
  s.parentNode.insertBefore(script, s);
  this.intervalTime = 0
  this.addressInterval = setInterval(
    () => {
      this.intervalTime++
      if (!!remote_ip_info) {
        cb(remote_ip_info);
        remote_ip_info = null;
        this.addressInterval && clearInterval(this.addressInterval)
      }
      if (this.intervalTime > 2) {
        this.addressInterval && clearInterval(this.addressInterval)
      }
    }, 1000);
}

root.methods.loginIn = function () {   // 点击登录

  // let result = this.captcha.getValidate()

  // 登录验证
  if (!this.canSend()) {
    return
  }

  // 如果是手机登录
  if (this.loginType == 0) {
    let params = {
      // geetest_challenge: result.geetest_challenge,
      // geetest_seccode: result.geetest_seccode,
      // geetest_validate: result.geetest_validate,
      client_type: this.geetestType,
      "mobile": this.userName.trim(),
      "password": this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.psw).toString(),
      "ip": this.userAddressIp,
      "address": this.userAddress,
      'source': this.isMobile ? 'H5' : 'WEB'
    }

    this.sending = true
    this.popType = 2
    this.popOpen = true

    this.$http.send('LOGIN_BY_MOBILE', {
      params: params
    }).then(({data}) => {
      return this.re_login(data)
    }).catch(err => {
      this.sending = false
      this.popOpen = false
      this.popType = 0
      this.popText = this.$t('popText_0')
      setTimeout(() => {
        this.popOpen = true
      }, 200)
    })

    return
  }

  // 如果是邮箱登录
  //如果通过验证
  let params = {
    // geetest_challenge: result.geetest_challenge,
    // geetest_seccode: result.geetest_seccode,
    // geetest_validate: result.geetest_validate,
    client_type: this.geetestType,
    "email": this.userName.trim(),
    "password1": this.$globalFunc.CryptoJS.SHA1(this.userName.trim().toLowerCase() + ':' + this.psw).toString(),
    "password2": this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.psw).toString(),
    "ip": this.userAddressIp,
    "address": this.userAddress,
    'source': this.isMobile ? 'H5' : 'WEB'
  }

  this.sending = true
  this.popType = 2
  this.popOpen = true

  // 发送登录请求
  this.$http.send('LOGIN', {
    params: params
  }).then(({data}) => {
    return this.re_login(data)
  }).catch(err => {
    this.sending = false
    this.popOpen = false
    this.popType = 0
    this.popText = this.$t('popText_0')
    setTimeout(() => {
      this.popOpen = true
    }, 200)
  })
}

// 登录回调
root.methods.re_login = async function (data) {
  this.sending = false
  this.popOpen = false
  typeof(data) === 'string' && (data = JSON.parse(data))
  let dataMap = data.dataMap


  if (data.errorCode || data.result === 'FAIL') {
    let wrongAns = ''
    switch (data.errorCode) {
      case 1:
        if (dataMap && dataMap.times && dataMap.wrong && dataMap.times - dataMap.wrong > 0) {
          this.SHOW_POP(dataMap.times - dataMap.wrong, dataMap.times, dataMap.lock / 60);
          this.popWindowOpen = true;
          break;
        }
        wrongAns = this.$t('userNameWA_1');
        break;
      case 2:
        wrongAns = this.$t('userNameWA_2');
        break;
      case 3:
        this.$router.push({
          name: 'verification',
          query: {
            email: this.loginType == 1 ? this.userName.trim() : '',
            mobile: this.loginType == 0 ? this.userName.trim() : '',
            name: this.$route.query.name,
            toUrl: this.$route.query.toUrl
          }
        });
        break;
      case 4:
        wrongAns = this.$t('mobileWA_2')
        break;
      case 5:
        wrongAns = this.$t('userNameWA_5');
        break;
      case 6:
        wrongAns = this.$t('mobileWA_3')
        break;
      case 101:
        this.SHOW_TIPS(dataMap.lock / 60);
        setTimeout(() => {
          this.popType = 0;
          this.popOpen = true;
        }, 200);
        break;
      case 10000:
        wrongAns = this.$t('mobileWA_5')+'"'+this.$t('mobileWA_6')+'"'+this.$t('mobileWA_7');
            break;
      default:
        wrongAns = this.$t('canNotUse')
    }

    // // 如果选择的手机
    // if (this.loginType == 0) {
    //   this.mobileWA = wrongAns
    // }
    // 如果选择的邮箱
    // if (this.loginType == 1) {
      this.userNameWA = wrongAns
    // }
    return
  }

  this.$store.commit('SET_AUTH_MESSAGE', data.dataMap.userProfile)

  // 获取登录状态
  this.$globalFunc.getAuthState(this)


  let layerShow = false

  // 获取cookie
  this.GET_COOKIE();

  // await this.$http.send('SHOW_FLOAT_LAYER', {
  //   bind: this,
  //   callBack: function (res) {
  //     // if (res.trade) {
  //     //   this.$router.push({name: 'FloatingLayerTradingHall'})
  //     //   layerShow = true
  //     // }
  //     if (res.share) {
  //       this.$router.push({name: 'FloatingLayerRecommend'})
  //       layerShow = true
  //     }
  //   }
  // })
  //
  // if (layerShow) return

  if (!!this.$route.query.name) {
    this.$router.push({name: this.$route.query.name})
    return
  }

  if(this.$route.query.toUrl && this.$route.query.toUrl == "c2c_url"){
    this.GO_OTC();
    // return;
  }

  // if(this.$route.query.toUrl && this.$route.query.toUrl == "GRC"){
  //   this.GO_GRC();
  //   // return;
  // }
  this.$router.push({name: 'tradingHall'})
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


// 检测邮箱格式
root.methods.testUserName = function (color) {
  this.inputColor = color
  this.userNamePlaceholderShow = true;
  this.mobileUserNameFocus = false
  return this.inputTestUserName()
}

root.methods.inputTestUserName = function () {

  let userNameFlag = this.$globalFunc.testEmail(this.userName);
  let mobileFlag = this.$globalFunc.testMobile(this.userName);

  if (this.userName === '') {
    this.userNameWA = ''
    return false
  }
  //如果既不是邮箱格式也不是手机格式
  if (!userNameFlag && !mobileFlag) {
    this.userNameWA = this.$t('userNameWA_3')
    return false
  }

  //如果是手机
  mobileFlag && (this.loginType = 0)
  //如果是邮箱
  userNameFlag && (this.loginType = 1)

  this.userNameWA = ''
  return true
}

root.methods.closeTestUserName = function () {
  this.mobileUserNameFocus = true
  this.userNameWA = ''
}

// 检测手机
root.methods.testMobile = function () {
  this.mobileFocus = false
  return this.inputTestMobile()
}

// 检测手机
root.methods.inputTestMobile = function () {
  if (this.mobile === '') {
    this.mobileWA = ''
    return false
  }
  if (!this.$globalFunc.testMobile(this.mobile)) {
    this.mobileWA = this.$t('mobileWA_4')
    return false
  }
  this.mobileWA = ''
  return true
}

root.methods.closeTestMobile = function () {
  this.mobileWA = ''
  this.mobileFocus = true
}

// 检测密码格式
root.methods.testPsw = function () {
  this.pswPlaceholderShow = true;
  this.mobilePswFocus = false
  if (this.psw === '') {
    this.pswWA = ''
    return false
  }
  this.pswWA = ''
  return true
}

root.methods.closeTestPsw = function () {
  this.mobilePswFocus = true
}

// 检测手机密码格式
root.methods.testMobilePsw = function () {
  this.mobilePswFocus = false
  if (this.mobilePsw === '') {
    this.mobilePswWA = ''
    return false
  }
  this.mobilePswWA = ''
  return true
}

root.methods.closeTestMobilePsw = function () {
  this.mobilePswFocus = true
}

// 关闭弹框
root.methods.popWindowClose = function () {
  this.popWindowOpen = false;
}


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
