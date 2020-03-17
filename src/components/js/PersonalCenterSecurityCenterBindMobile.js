const root = {}
root.name = 'PersonalCenterSecurityCenterBindMobile'

import '../../../static/gt'


/*---------------------- 属性 ---------------------*/
root.props = {}

root.props.show = {
  type: Boolean,
  default: false
}
root.props.close = {
  type: Function,
  default:()=>_
}


/*--------------------------- 组件 -----------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupT': resolve => require(['../vue/PopupT'], resolve),
}

/*--------------------------- data -----------------------------*/

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

    captcha: null, //极验
    captchaReady: false, //极验准备

    // 2018-5-4
    frequency: 0,        // 剩余次数
    hours: 24,            // 冻结几小时
    total_frequency: 0,  // 累计多少次
    pop_tips1: '',
    pop_tips2: '',
    toast_tips: '',
    // 绑定的城市
    cities: [
  //areaCode: (...)
  // countryId: (...)
  // id: (...)
  // nameCn: (...)
  // nameEn: (...)
      /*{
      "areaCode": "0093",
      "countryId": 2,
      "nameCn": "阿富汗",
      "nameEn": "Afghanistan"
    },
      {
        "areaCode": "00355",
        "countryId": 3,
        "nameCn": "阿尔巴尼亚",
        "nameEn": "Albania"
      },
      {
        "areaCode": "00213",
        "countryId": 4,
        "nameCn": "阿尔及利亚",
        "nameEn": "Algeria"
      },
      {
        "areaCode": "00376",
        "countryId": 5,
        "nameCn": "安道尔共和国",
        "nameEn": "Andorra"
      },
      {
        "areaCode": "00244",
        "countryId": 1,
        "nameCn": "安哥拉",
        "nameEn": "Angola"
      },
      {
        "areaCode": "001264",
        "countryId": 6,
        "nameCn": "安圭拉岛",
        "nameEn": "Anguilla"
      },
      {
        "areaCode": "001268",
        "countryId": 7,
        "nameCn": "安提瓜和巴布达",
        "nameEn": "Antigua and Barbuda"
      },
      {
        "areaCode": "0054",
        "countryId": 8,
        "nameCn": "阿根廷",
        "nameEn": "Argentina"
      },
      {
        "areaCode": "00374",
        "countryId": 9,
        "nameCn": "亚美尼亚",
        "nameEn": "Armenia"
      },*/
      ],
    value: '',
    // state:false,
    // 搜索内容
    searchCities:'',
    // 城市列表
    cityList:[],
    searchResult:'',

    hiddenBindMObilePage:false,
    // show:true,
    // show:true,
    // showBind:true

  }
}
/*--------------------------- 生命周期 -----------------------------*/


root.created = function () {
  this.getAuthState()
  this.getGeetest()
  this.getMobileInfo()
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
/*--------------------------- 计算 -----------------------------*/


root.computed = {}
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
// 语言
root.computed.lang = function () {
  return this.$store.state.lang
}
// 极验类型
root.computed.geetestType = function () {
  return this.$store.state.isMobile ? 'h5' : 'web'
}



/*--------------------------- 监听 -----------------------------*/

root.watch = {}

root.watch.searchCities = function(v){
  console.log(v)
  // console.log(this.changeInputValue)
  // console.log(this.computedMarketList.name )
  // console.log('this.searchList====111',this.searchList)
  this.cityList = []

  //不是数字的时候搜索nameCn nameEn
  if(isNaN(this.searchCities)){
    this.cityList = this.cities.filter(v=>v.nameCn.includes(this.searchCities)
      || v.nameEn.includes(this.searchCities)
      || v.nameEn.includes(this.searchCities.toUpperCase())
    )
  }

  //是数字的时候搜索areaCode
  if(!isNaN(this.searchCities)){
    this.cityList = this.cities.filter(v=>v.areaCode.includes(this.searchCities))
  }

  this.cityList.length == 0 && (this.cityList = [{
    "areaCode": '',
    "countryId": '-1',
    "nameCn": "暂无数据",
    "nameEn": ""
  }])
  return this.cityList;
}


/*--------------------------- 方法 -----------------------------*/


root.methods = {}

// 获取电话信息
root.methods.getMobileInfo = function(){
  this.$http.send("REGISTER_BY_MOBILE_INFO",{
    bind: this,
    callBack: this.re_getMobileInfo,
    errorHandler: this.error_getMobileInfo
  })
},

root.methods.re_getMobileInfo = function(data){
  console.log(data)
  this.cities = data
},

root.methods.error_getMobileInfo = function(err){
  console.log(err)
}

// root.methods.throttle = function(){
//   this.cityList=[];
//   //拿到当前input输入框输入的值
//   this.value=this.$refs.input.value;
//   //判断展示ul列表，如果输入了就展示没输入就不展示
//   if(this.value.length>0){
//     this.state=true;
//   }else{
//     this.state=false;
//   }
//
//   //循环模拟数据的数组
//   this.cities.map((msg)=>{
//     //拿当前json的id、name、time去分别跟输入的值进行比较
//     //indexOf 如果在检索的字符串中没有出现要找的值是会返回-1的，所以我们这里不等于-1就是假设输入框的值在当前json里面找到的情况
//     if(msg.areaCode.indexOf(this.input_value)!=-1    || msg.countryId.indexOf(this.input_value)!=-1 ||  msg.nameCn.indexOf(this.input_value)!=-1 ||  msg.nameEn.indexOf(this.input_value)!=-1){
//       //然后把当前json添加到list数组中
//       this.cityList.push(msg);
//     }
//   })
// },

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
  if (this.$store.state.authState.sms) {
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
  if (data.dataMap.sms) {
    this.$router.push('/index/personal/securityCenter')
  }
  this.loading = false
}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
  console.warn("获取验证状态出错！", err)
  this.$router.push('/index/personal/securityCenter')
}

// 判断密码
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
    this.mobileWA = this.$t('personalCenterSecurityCenterBindMobile.mobileWA_0')
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
  // console.warn("获取了极验数据", data)
  if (!data || !data.dataMap || data.result == 'FAIL') {
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
    // this.verificationCodeWA = '请完成验证操作'
  }).onSuccess(this.postVerificationCode)
}

// 获取极验出错
root.methods.error_getGeetest = function (err) {
  console.warn('获取极验出错', err)
}

// 点击验证极验
root.methods.clickGeetest = function () {
  let canSend = true
  canSend = this.testMobile() && canSend
  if (this.mobile === '') {
    this.mobileWA = this.$t('personalCenterSecurityCenterBindMobile.mobileWA_1')
    canSend = false
  }
  if (!canSend) {
    return
  }
  this.captcha.verify();
}

// 验证成功
root.methods.postVerificationCode = function () {

  // console.log('this is searchResult',this.searchResult);

  if(this.searchResult == ''){
    // this.mobileWA = this.$t('personalCenterSecurityCenterBindMobile.mobileWA_6')
    // return
    this.searchResult = '0086'
  }

  if (this.mobile === '') {
    this.mobileWA = this.$t('personalCenterSecurityCenterBindMobile.mobileWA_1')
    return

  }

  this.getVerificationCode = true
  this.verificationCodeWA = ''
  this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
  this.getVerificationCodeCountdown = 60
  this.getVerificationCodeInterval = setInterval(() => {
    this.getVerificationCodeCountdown--
    if (this.getVerificationCodeCountdown <= 0) {
      this.getVerificationCode = false
      this.getVerificationCodeCountdown = 60
      clearInterval(this.getVerificationCodeInterval)
    }
  }, 1000)
  // let result = this.captcha.getValidate()
  let params = {
    // geetest_challenge: result.geetest_challenge,
    // geetest_seccode: result.geetest_seccode,
    // geetest_validate: result.geetest_validate,
    client_type: this.geetestType,
    "type": "mobile",
    "mun": this.mobile,
    "purpose": "bind",
    "areaCode":this.searchResult
  }

  this.$http.send('POST_VERIFICATION_CODE', {
    bind: this,
    params: params,
    callBack: this.re_postVerificationCode,
    errorHandler: this.error_postVerificationCode
  })
}

// 点击验证码回复
root.methods.re_postVerificationCode = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  // console.warn('data', data)
  if (data.errorCode) {
    data.errorCode === 1 && (this.verificationCodeWA = this.$t('personalCenterSecurityCenterBindMobile.mobileWA_2'))
    data.errorCode === 2 && (this.verificationCodeWA = this.$t('personalCenterSecurityCenterBindMobile.mobileWA_3'))
    data.errorCode === 3 && (this.verificationCodeWA = this.$t('personalCenterSecurityCenterBindMobile.mobileWA_4'))
    this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
    this.getVerificationCode = false
    this.getVerificationCodeCountdown = 60
  }
}
// 点击验证码出错
root.methods.error_postVerificationCode = function (err) {
  console.warn('绑定手机号获取手机验证码失败！', err)
}

/*----------------- 极验 end ------------------*/


// 提交
root.methods.commit = function () {
  if (this.sending) return
  let canSend = true
  canSend = this.testMobile() && canSend
  if (this.psw === '') {
    this.pswWA = this.$t('personalCenterSecurityCenterBindMobile.pswWA_0')
    canSend = false
  }
  if (this.mobile === '') {
    this.mobileWA = this.$t('personalCenterSecurityCenterBindMobile.mobileWA_1')
    canSend = false
  }
  if (this.verificationCode === '') {
    this.verificationCodeWA = this.$t('personalCenterSecurityCenterBindMobile.verificationCodeWA_0')
    canSend = false
  }

  if (!canSend) {
    return
  }
  let email = this.$store.state.authMessage.email

  if(this.searchResult == ''){
    // this.mobileWA = this.$t('personalCenterSecurityCenterBindMobile.mobileWA_6')
    // return
    this.searchResult = '0086'
  }

  this.$http.send('POST_COMMON_AUTH', {
    bind: this,
    params: {
      type: 'mobile',
      purpose: 'bind',
      examinee: this.mobile,
      areaCode:this.searchResult,
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
    data.errorCode === 1 && (this.mobileWA = this.$t('personalCenterSecurityCenterBindMobile.mobileWA_2'))
    data.errorCode === 2 && (this.mobileWA = this.$t('personalCenterSecurityCenterBindMobile.mobileWA_5'))
    data.errorCode === 3 && (this.pswWA = this.$t('personalCenterSecurityCenterBindMobile.pswWA_1'))
    return
  }
  if (this.isMobile) {
    this.$router.push('/index/personal/auth/authentication')
  } else {
    this.click_rel_em(true)
    // this.$router.push('/index/personal/securityCenter')
  }

}
root.methods.error_commit = function (err) {
  // console.warn("绑定手机出错", err)
  this.sending = false
  this.popOpen = false
  this.popType = 0
  this.popText = this.$t('personalCenterSecurityCenterBindMobile.popText')
  setTimeout(() => {
    this.popOpen = true
  }, 100)
}


// 弹窗
root.methods.popClose = function () {
  this.popOpen = false
}

root.methods.click_rel_em = function (callApi){
  // this.show = false

  this.$emit('close',false,callApi)
}


export default root
