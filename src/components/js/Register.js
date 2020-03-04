import '../../../static/gt'


const root = {}
root.name = 'Register'

/*------------------------------ 组件 -------------------------------*/


root.components =  {
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'MobileCheckbox': resolve => require(['../mobileVue/MobileCompentsVue/MobileCheckbox'], resolve),
  'RegisterTopBar': resolve => require(['../vue/RegisterTopBar'], resolve),
  // 'dropdown': resolve => require(['../dropdown/dropdown'], resolve),
}


/*------------------------------ data -------------------------------*/

root.data = function () {
  return {
    loading: false,


    userType: '',
    userName: '',
    userNamePlaceholderShow: true,
    userNameWA: '',
    mobileWA: '',

    verificationCode: '',
    verificationCodePlaceholderShow: true,
    clickVerificationCodeButton: false,
    getVerificationCode: false,
    getVerificationCodeCountdown: 60,
    verificationCodeWA: '',
    getVerificationCodeInterval: null,

    psw: '',
    pswPlaceholderShow: true,
    pswWA: '',

    pswConfirm: '',
    pswConfirmPlaceholderShow: true,
    pswConfirmWA: '',

    referee: '',
    refereePlaceholderShow: true,
    refereeWA: '',

    // 渠道来源
    channel: '',


    agreement: false,
    agreementWA: '',

    // verifying: false,
    // verifyingWA: '',

    sending: false,


    popType: 0,
    popOpen: false,
    popText: '系统繁忙',

    captcha: null,
    captchaReady: false,

    // 2019-5-10 新注册
    // registerType: 1, // 0为手机注册，1为邮箱注册

    // 绑定的城市
    cities: [],
    value: '',
    // state:false,
    // 搜索内容
    searchCities:'',
    // 城市列表
    cityList:[],
    searchResult:'',
    label:'+ 86'

  }
}

/*------------------------------ 生命周期 -------------------------------*/

root.created = function () {
  if (this.$route.query.uid) {
    this.referee = this.$route.query.uid
  }

  // 如果有渠道query，就传渠道query值
  if (this.$route.query.channel) {
    this.channel = this.$route.query.channel
  }
  // 如果没有渠道query，就传默认值
  if (!this.$route.query.channel) {
    this.channel = 'default'
  }

  this.getGeetest()
  this.getMobileInfo()
}

root.mounted = function () {
  // 监听键盘事件
  document.onkeydown = (event) => {
    if (event.keyCode === 13) {
      this.registerCommit()
    }
  }
}
root.beforeDestroy = function () {
  // 取消监听键盘事件
  document.onkeydown = (event) => {
  }
}

/*------------------------------ 计算 -------------------------------*/
root.computed = {}
root.computed.registerType = function () {
  return this.$store.state.registerType
}
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

/*------------------------------ 观察 -------------------------------*/
root.watch = {}

// 监听搜索框输入的数据
root.watch.searchCities = function(v){
  // console.log(v)
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


/*------------------------------ 方法 -------------------------------*/


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
  // console.log(data)
  this.cities = data
},

root.methods.error_getMobileInfo = function(err){
  console.log(err)
}
//返回后端的数据
root.methods.clickItem = function(code){
  this.$store.commit('SET_AREA_CODE',code);
  console.log("clickItem code",code)
  window.history.go(-1)
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

  if(type == 'verificationCode'){
    this.verificationCodePlaceholderShow = false;
  }

  if(type == 'pswConfirm'){
    this.pswConfirmPlaceholderShow = false;
  }

  if(type == 'referee'){
    this.refereePlaceholderShow = false;
  }


}

// 判断输入用户
root.methods.testUserName = function () {

  this.userNamePlaceholderShow = true

  /*let userNameFlag = this.$globalFunc.testEmail(this.userName);
  let mobileFlag = this.$globalFunc.testMobile(this.userName);*/

  if (this.userName === '') {
    this.userNameWA = ''
    return true
  }
  if (this.registerType == 0 && !this.$globalFunc.testMobile(this.userName)) {
    this.userNameWA = this.$t('register.userNameWA_0_M')
    // this.userNameWA = '请输入正确的手机号'
    return false
  }
  if (this.registerType == 1 && !this.$globalFunc.testEmail(this.userName)) {
    this.userNameWA = this.$t('register.userNameWA_0')
    return false
  }

  /*//如果既不是邮箱格式也不是手机格式
  if (!userNameFlag && !mobileFlag) {
    this.userNameWA = this.$t('register.userNameWA_0')
    return false
  }

  //如果是手机
  mobileFlag && (this.registerType = 0)
  //如果是邮箱
  userNameFlag && (this.registerType = 1)*/

  this.userNameWA = ''
  return true
}
// 输入密码中
root.methods.testInputIngPsw = function () {
  if (this.psw.length > 16) {
    this.pswWA = this.$t('register.pswWA_0')
  }
  this.psw = this.psw.slice(0, 16)
}
// 输入确认密码中
root.methods.testInputIngPswConfirm = function () {
  if (this.pswConfirm.length > 16) {
    this.pswConfirmWA = this.$t('register.pswConfirmWA_0')
  }
  this.pswConfirm = this.pswConfirm.slice(0, 16)
}

// 判断推荐人
root.methods.testReferee = function () {
  this.refereePlaceholderShow = true
  if (this.referee === '') {
    this.refereeWA = ''
    return true
  }
  // if (!this.$globalFunc.testReferee(this.referee)) {
  //   this.refereeWA = this.$t('register.refereeWA_0')
  //   return false
  // }
  this.refereeWA = ''
  return true
}
// 选择注册方式
root.methods.choseRegisterType = function (type) {
  // this.registerType = type

  this.$store.commit("REGISTER_TYPE",type);
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
  // console.warn("获取极验！", data)
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
    // console.info('geetest is ready')
  }).onClose(() => {
    // showError($('#btnGetVerfycode'), '请完成验证操作');
    this.verificationCodeWA = '请完成验证操作'
  }).onSuccess(this.postVerificationCode)
}
// 获取极验出错
root.methods.error_getGeetest = function (err) {
  console.warn('获取极验出错', err)
  // this.getVerificationCode = true
  // this.verificationCodeWA = ''
  // this.getVerificationCodeCountdown = '暂不可用'
}

// 点击验证极验
root.methods.clickGeetest = function () {
  // 验证邮箱
  if (!this.testUserName()) {
    return
  }

  if (this.userName === '' && this.registerType == 0) {
    this.mobileWA = this.$t('register.userNameWA_1_M')
  }

  if (this.userName === '' && this.registerType == 1) {
    this.userNameWA = this.$t('register.userNameWA_1')
    return
  }

  this.captcha.verify();
}


// 验证成功
root.methods.postVerificationCode = function () {
  let areaCode = this.isMobile ? this.$store.state.areaCode : this.searchResult;
  // let result = this.captcha.getValidate()
  if (this.userName === '' && this.registerType == 0) {
    this.mobileWA = this.$t('register.userNameWA_1_M')
    return
  }

  if (this.userName === '' && this.registerType == 1) {
    this.userNameWA = this.$t('register.userNameWA_1')
    return
  }

  // 发送，目的是register注册
  let params = {
    // geetest_challenge: result.geetest_challenge,
    // geetest_seccode: result.geetest_seccode,
    // geetest_validate: result.geetest_validate,
    client_type: this.geetestType,
    "type": this.registerType == 0 ? "mobile" : "email",
    "mun": this.userName,
    "purpose": "register",
    "areaCode":areaCode
  }

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

  this.$http.send('POST_VERIFICATION_CODE', {
    bind: this, params: params, callBack: this.re_postVerificationCode, errorHandler: this.error_postVerificationCode
  })
}

// 获取验证码的回复
root.methods.re_postVerificationCode = function (dataObj) {
  typeof (dataObj) === 'string' && (dataObj = JSON.parse(dataObj));
  if (dataObj.errorCode) {
    dataObj.errorCode === 1 &&
    (this.verificationCodeWA = this.registerType == 0 ? this.$t('register.verificationCodeWA_0_M') : this.$t('register.verificationCodeWA_0'))
    dataObj.errorCode === 2 &&
    (this.verificationCodeWA = this.registerType == 0 ? this.$t('register.verificationCodeWA_1_M') : this.$t('register.verificationCodeWA_1'))
    dataObj.errorCode === 3 && (this.verificationCodeWA = this.$t('register.verificationCodeWA_2'))
    dataObj.errorCode === 4 && (this.verificationCodeWA = this.$t('register.verificationCodeWA_7'))

    this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
    this.getVerificationCode = false
    this.getVerificationCodeCountdown = 60
  }
}
// 获取验证码出错
root.methods.error_postVerificationCode = function (err) {
  console.warn('获取验证码出错了！！', err)
}

/*----------------- 极验 end ------------------*/


// 验证码输入
root.methods.testVerificationCode = function () {
  this.verificationCodePlaceholderShow = true
  if (this.verificationCode === '') {
    this.verificationCodeWA = ''
    return false
  }
  this.verificationCodeWA = ''
  return true
}

// 密码输入
root.methods.testPsw = function () {
  this.pswPlaceholderShow = true
  if (this.pswConfirm !== '' || this.pswConfirm === this.psw) {
    this.testPswConfirm()
  }
  if (this.psw === '') {
    this.pswWA = ''
    return false
  }
  if (!this.$globalFunc.testPsw(this.psw)) {
    this.pswWA = this.$t('register.pswWA_1')
    return false
  }
  this.pswWA = ''
  return true
}

// 确认密码
root.methods.testPswConfirm = function () {
  this.pswConfirmPlaceholderShow = true
  if (this.psw !== this.pswConfirm) {
    this.pswConfirmWA = this.$t('register.pswWA_2')
    return false
  }
  this.pswConfirmWA = ''
  return true
}

// 确认同意协议
root.methods.testAgreement = function () {
  // this.agreement = !this.agreement
  this.agreementWA = ''
}

// 确认同意协议
root.methods.changeAgreement = function () {
  this.agreement = !this.agreement
  this.agreementWA = ''
}

// 点击注册
root.methods.registerCommit = function () {
  // console.log("this.$globalFunc.CryptoJS.SHA1('btcdo:123admin').toString(),",this.$globalFunc.CryptoJS.SHA1('btcdo:123admin').toString(),)
  if (this.sending) return
  let canSend = true
  // 判断用户名
  canSend = this.testUserName() && canSend
  canSend = this.testVerificationCode() && canSend
  canSend = this.testPswConfirm() && canSend
  canSend = this.testPsw() && canSend
  canSend = this.testReferee() && canSend
  // 请输入用户名
  if (this.userName === '') {
    this.userNameWA = this.$t('register.userNameWA_2')
    canSend = false
  }
  // 发送异常
  if (this.psw === '') {
    this.pswWA = this.$t('register.pswWA_3')
    canSend = false
  }
  // 请确认密码
  if (this.pswConfirm === '') {
    this.pswConfirmWA = this.$t('register.pswConfirmWA_1')
    canSend = false
  }
  // 验证码过期
  if (this.verificationCode === '') {
    this.verificationCodeWA = this.$t('register.verificationCodeWA_3')
    canSend = false
  }
  // 发送异常
  if (!this.clickVerificationCodeButton) {
    this.verificationCodeWA = this.$t('register.verificationCodeWA_4')
    canSend = false
  }
  // 请阅读并同意《用户协议》
  if (!this.agreement) {
    this.agreementWA = this.$t('register.agreementWA')
    canSend = false
  }
  // if (!this.verifying) {
  //   this.verifyingWA = this.$t('register.verifyingWA')
  //   canSend = false
  // }

  if (!canSend) {
    // console.log("不能发送！")
    return
  }
  let source = this.$route.query.source || (this.isMobile ? 'H5' : 'WEB')
  let regsource = this.isMobile ? 'H5' : 'WEB';
  let areaCode = this.isMobile ? this.$store.state.areaCode : this.searchResult;

  let params = this.registerType == 0 ? {
    "mobile": this.userName,
    "password": this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.psw).toString(),
    "code": this.verificationCode,
    'source': source,
    'inviteduserId': this.referee,
    'channel': this.channel,
    'regsource':regsource,
    "areaCode":areaCode
  } : {
    "email": this.userName,
    "password1": this.$globalFunc.CryptoJS.SHA1(this.userName.toLowerCase() + ':' + this.psw).toString(),
    "password2": this.$globalFunc.CryptoJS.SHA1('btcdo:' + this.psw).toString(),
    "code": this.verificationCode,
    'source': source,
    'inviteduserId': this.referee,
    'channel': this.channel,
    'regsource':regsource
  }

  let address = this.registerType == 0 ? 'REGISTER_BY_MOBILE' : 'REGISTER';

  this.$http.send(address, {
    bind: this,
    params: params,
    callBack: this.re_register,
    errorHandler: this.error_register
  })
  this.sending = true
  this.popType = 2
  this.popOpen = true
}

// 注册处理
root.methods.re_register = function (data) {
  this.sending = false
  this.popOpen = false

  // console.warn('注册数据', data)

  typeof(data) === 'string' && (data = JSON.parse(data))

  if (data.result === 'FAIL' || data.errorCode) {

    //手机注册
    if(this.registerType == 0 && data.errorCode != 3){
      data.errorCode === 1 && (this.userNameWA = this.$t('register.userNameWA_3'))
      data.errorCode === 2 && (this.userNameWA = this.$t('register.verificationCodeWA_1_M'))
      data.errorCode === 4 && (this.refereeWA = this.$t('register.verificationCodeWA_6'))
      return
    }
    if(this.registerType == 0 && data.result == 'FAIL' && data.errorCode == 3){
      this.verificationCodeWA = this.$t('register.verificationCodeWA_5')
      return
    }

    //邮箱注册
    if(this.registerType == 1){
      // dataObj.msg
      data.errorCode === 1 && (this.userNameWA = this.$t('register.userNameWA_3'))
      data.errorCode === 2 && (this.userNameWA = this.$t('register.userNameWA_4'))
      data.errorCode === 3 && (this.verificationCodeWA = this.$t('register.verificationCodeWA_5'))
      data.errorCode === 4 && (this.refereeWA = this.$t('register.verificationCodeWA_6'))
      return
    }

  }

  this.$store.commit('SET_AUTH_MESSAGE', data.dataMap.userProfile)

  this.$router.push({name: 'tradingHall'})
  // 判断是否验证
  this.$http.send('GET_AUTH_STATE', {
    bind: this,
    callBack: this.re_get_auth_state
  })

}

// 获得认证状态
root.methods.re_get_auth_state = function (data) {
  let dataObj = JSON.parse(data)
  this.$store.commit('SET_AUTH_STATE', dataObj.dataMap)
  // this.$eventBus.notify({key: 'BIND_AUTH_POP'})


}

// 注册出错
root.methods.error_register = function (err) {
  this.sending = false
  this.popOpen = false
  this.popType = 0
  this.popText = this.$t('register.popText_0')
  setTimeout(() => {
    this.popOpen = true
  }, 200)
}

// 关闭弹窗
root.methods.popClose = function () {
  this.popOpen = false
}
root.methods.goAreaPage = function () {
  this.$router.push({name: 'RegisterMobilePhoneNumberAreaSearch'});
}

export default root
