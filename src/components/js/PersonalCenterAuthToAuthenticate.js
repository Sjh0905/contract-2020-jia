import logo from '../../assets/二维码logo.png'
import axios from 'axios'
import store from "../../configs/storeConfigs/StoreConfigs";

/*------------------- 组件名称 ---------------------*/

const root = {}

root.name = 'PersonalCenterAuthToAuthenticate'


// ------------------------------------ 引用组件 --------------------------------------

root.components = {
  'PopAlert': resolve => require(['../vue/PopAlert'], resolve),
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
  'Qrcode': resolve => require(['qrcode-vue'], resolve),
}


/*------------------- props ---------------------*/
root.props = {}

/*------------------- 生命周期 ---------------------*/

root.created = function () {
  this.getUSDThl();

}

root.mounted = function () {
  // this.value = this.staticUrl + '/AppDownload'
  this.value = 'https://download.2020.exchange/'
  this.size = 124 /  window.devicePixelRatio

  window.addEventListener('scroll', this.appScroll)
}



// root.name = 'PersonalCenterAuthToAuthenticate'
// 身份证校验
import IDValidator from 'id-validator'
// import logo from '../../assets/qrcode_icon_logo.png'


/*--------------------------------- data -------------------------------------*/

root.data = function () {
  return {
    loading: true,

    commitType: 1,//提交认证方式

    logo: logo,
    size: 124,
    bgColor: '#fff',
    fgColor: '#000',
    value: '',
    backtophui:false,
    backtopzi:false,
    appHover: false,
    dollar_usdt: '',
    showewm:false,

    // 搜索内容
    searchCities:'',

    // 城市列表
    cityList:[],
    searchResult:'',

    // 绑定的城市
    cities: [],

    authType: 0, //认证状态，0表示通过，2表示待审核，1表示驳回，3表示未认证

    imgSize: 5000, //5M
    minZipSize: 500, // 500k以上就压缩


    // WA 0代表输入错误 1代表返回审核错误，2代表返回审核正确
    country: '0',

    countryWA_0: '0',
    countryMsg_0: '',

    countryWA_1: '0',
    countryMsg_1: '',


    gender: '0',
    genderWA_0: '0',
    genderMsg_0: '',

    genderWA_1: '0',
    genderMsg_1: '',


    surname_0: '',
    surname_1: '',

    surnameWA_0: '0',
    surnameMsg_0: '',

    surnameWA_1: '0',
    surnameMsg_1: '',

    name_0: '',
    name_1: '',
    nameWA_0: '0',
    nameMsg_0: '',

    nameWA_1: '0',
    nameMsg_1: '',

    idCode_0: '',
    idCode_1: '',
    idCodeWA_0: '0',
    idCodeMsg_0: '',
    idValidator: null, //身份证校验器

    idCodeWA_1: '0',
    idCodeMsg_1: '',


    frontImg_0: '',
    frontImg_1: '',
    frontImgWA_0: '0',
    frontImgMsg_0: '',

    frontImgWA_1: '0',
    frontImgMsg_1: '',


    backImg_0: '',
    backImg_1: '',
    backImgWA_0: '0',
    backImgMsg_0: '',

    backImgWA_1: '0',
    backImgMsg_1: '',


    holdImg_0: '',
    holdImg_1: '',
    holdImgWA_0: '0',
    holdImgMsg_0: '',

    holdImgWA_1: '0',
    holdImgMsg_1: '',

    sending: false,
    popShow: this.$cookies.get("popShow") ? false : true,

    // 被驳回的照片回显路径-正面
    certificate_positive_url_0: '',
    certificate_positive_url_1: '',
    // 被驳回的照片回显路径-反面
    certificate_negative_url_0: '',
    certificate_negative_url_1: '',
    // 被驳回的照片回显路径-手持
    held_certificate_url_0: '',
    held_certificate_url_1: '',

    identityAuthWAReason_0: '',
    identityAuthWAReason_1: '',

    popOpen: false,
    popType: 0,
    popText: '系统繁忙',

    sendFrontImg: null,
    sendBackImg: null,
    sendHoldImg: null,

    //弹窗
    popWindowOpen: false,
    popWindowWord: '',

    options: [{
      value: '0',
      label: '中国大陆地区'
    }, {
      value: '1',
      label: '其他国家地区'
    }],
    value2: '0',
    optionsgender: [{
      value: '0',
      label: this.$t('gender_1')
    }, {
      value: '1',
      label: this.$t('gender_2')
    }],
    // valuegender: this.gender === '0' ? '男' : '女',
    valuegender: '',

    register: false,
    nameEn:""

    // 错误提示

  }
}

/*--------------------------------- 生命周期 -------------------------------------*/

root.created = function () {

  // 判断是否关闭过
  this.isClosed();
  //获取国籍信息
  this.getMobileInfo()
  // 判断认证状态
  this.getAuthState()

  // 生成身份证校验器
  this.idValidator = new IDValidator()
  // console.warn('this is idValidator',this.idValidator)

}
root.mounted = function () {
  this.value = this.staticUrl + '/AppDownload/'
  this.size = 127 / window.devicePixelRatio
}



/*--------------------------------- 计算 -------------------------------------*/
root.computed = {}
root.computed.staticUrl = function () {
  return this.$store.state.static_url
}


// 是否打开了api
// root.computed.open_api = function () {
//   if (!this.$store.state.authState.apikey) {
//     return false
//   }
//   return true
// }
/*----------------------------- 监听 ------------------------------*/

root.watch = {}


root.watch.searchResult = function(v){
  console.log('this is searchResult',v)

  if(v.indexOf('中国大陆地区') > -1){
    this.country = '0'
  }else{
    this.country = '1'
  }
}

root.watch.valuegender = function(v){
  console.log('this is valuegender',v)

  if(v.indexOf('男') > -1){
    this.gender = '0'
  }else{
    this.gender = '1'
  }
}
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
    this.cityList = this.cities.filter(v=>v.nameCn.includes(this.searchCities))
  }

  this.cityList.length == 0 && (this.cityList = [{
    "areaCode": '',
    "countryId": '-1',
    "nameCn": "暂无数据",
    "nameEn": ""
  }])
  return this.cityList;
}

//在审核不通过的情况下，改变输入框的值，清空不通过信息
root.watch.gender = function (newValue, oldValue) {
  this.genderWA_0 == '1' && (this.genderWA_0 = '0')
  this.genderWA_1 == '1' && (this.genderWA_1 = '0')
}

//在审核不通过的情况下，改变输入框的值，清空不通过信息
root.watch.country = function (newValue, oldValue) {
  this.countryWA_0 == '1' && (this.countryWA_0 = '0')
  this.countryWA_1 == '1' && (this.countryWA_1 = '0')
}

/*--------------------------------- 方法 -------------------------------------*/


root.methods = {}


// 切换认证方式
root.methods.toggleRadios = function(){
  this.register = !this.register
},
root.methods.getMobileInfo = function(){
  console.log("-----getMobileInfo----", this.getMobileInfo)
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


// 获取认证状态
root.methods.getAuthState = function () {
  this.$http.send("GET_IDENTITY_AUTH_STATUS", {
    bind: this,
    callBack: this.re_getAuthState,
    errorHandler: this.error_getAuthState,
  })
}
// 获取认证状态成功
root.methods.re_getAuthState = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data.dataMap) return
  console.log('获取状态', data)

  // SET_AUTH_TYPE
  let status = data.dataMap.status
  // 如果是通过(2)和待审核(0,5,6)状态，不让进
  if (status === '0' || status === '2' || status == '5' || status == '6') {
    this.authType = parseInt(status)
    this.$router.push('/index/personal')
    return
  }
  // 如果是未认证状态，直接进
  if (status === '3') {
    this.loading = false
    this.authType = 3
    return
  }
  // 如果是被驳回状态，请求下认证状态
  if (status === '1') {
    this.authType = 1
    this.$http.send('GET_IDENTITY_INFO', {
      bind: this,
      callBack: this.re_getIdentityInfo,
      errorHandler: this.error_getIdentityInfo,
    })
  }

}
// 获取认证失败
root.methods.error_getAuthState = function (err) {
  console.warn("拿不到认证数据！", err)
}

// 获取审核中的认证
root.methods.re_getIdentityInfo = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data.dataMap) return
  console.warn('拿到了驳回的数据!', data)
  let name, nameWA,
    country, countryWA,
    gender, genderWA,
    idCode, idCodeWA,
    certificate_positive_url, certificate_positive_url_WA,
    certificate_negative_url, certificate_negative_url_WA,
    held_certificate_url, held_certificate_url_WA,
    surname, surnameWA,
    identityAuth, identityAuthWA
  let arr = data.dataMap.identityAuths
  console.info('arr=====',arr)
  for (let i = 0; i < arr.length; i++) {

    if(arr[i].type === 'area'){
      // this.$store.commit('SET_AREA_NAMECN',arr[i].value)
      country = arr[i].value === '中国大陆地区' ? '0' : '1';
      this.searchResult = arr[i].value
      // country = arr[i].value === 'ChineseMainland' ? 0 : 1;
      countryWA = arr[i].authResult;
    }
    if(arr[i].type === 'gender'){
      // this.$store.commit('SET_AREA_NAMECN',arr[i].value)
      // gender = arr[i].value === 'MALE' ? '0' : '1';
      this.valuegender = arr[i].value === 'MALE' ? '0' : '1';
      // country = arr[i].value === 'ChineseMainland' ? 0 : 1;
      genderWA = arr[i].authResult;
    }
    arr[i].type === 'name' && (name = arr[i].value) && (nameWA = arr[i].authResult)
    // arr[i].type === 'area' && (country = arr[i].value === '中国大陆地区' ? '0' : '1') && (countryWA = arr[i].authResult)
    // arr[i].type === 'gender' && (gender = arr[i].value === 'MALE' ? '0' : '1') && (genderWA = arr[i].authResult)
    arr[i].type === 'idCode' && (idCode = arr[i].value) && (idCodeWA = arr[i].authResult)
    arr[i].type === 'certificate_positive_url' && (certificate_positive_url = arr[i].value) && (certificate_positive_url_WA = arr[i].authResult)
    arr[i].type === 'certificate_negative_url' && (certificate_negative_url = arr[i].value) && (certificate_negative_url_WA = arr[i].authResult)
    arr[i].type === 'held_certificate_url' && (held_certificate_url = arr[i].value) && (held_certificate_url_WA = arr[i].authResult)
    arr[i].type === 'surname' && (surname = arr[i].value) && (surnameWA = arr[i].authResult)
    arr[i].type === 'identityAuth' && (identityAuth = arr[i].value) && (identityAuthWA = arr[i].authResult)
  }
  // 如果是身份证reader.onload
  if (country === '0') {
    this.name_0 = name
    this.nameWA_0 = nameWA
    this.country = country
    this.countryWA_0 = countryWA
    this.gender = gender
    this.genderWA_0 = genderWA
    this.idCode_0 = idCode
    this.idCodeWA_0 = idCodeWA
    // this.certificate_positive_url_0 = certificate_positive_url
    // this.frontImgWA_0 = '2'
    this.certificate_positive_url_0 = ''
    this.frontImgWA_0 = ''
    // this.certificate_negative_url_0 = certificate_negative_url
    // this.backImgWA_0 = '2'
    this.certificate_negative_url_0 = ''
    this.backImgWA_0 = ''
    // this.held_certificate_url_0 = held_certificate_url
    // this.holdImgWA_0 = '2'
    this.held_certificate_url_0 = ''
    this.holdImgWA_0 = ''
    this.identityAuthWAReason_0 = identityAuth
  }
  // 如果是护照
  if (country === '1') {
    this.name_1 = name
    this.nameWA_1 = nameWA
    this.country = country
    this.countryWA_1 = countryWA
    this.gender = gender
    this.genderWA_1 = genderWA
    this.idCode_1 = idCode
    this.idCodeWA_1 = idCodeWA
    // this.certificate_positive_url_1 = certificate_positive_url
    // this.frontImgWA_1 = '2'
    this.certificate_positive_url_1 = ''
    this.frontImgWA_1 = ''
    // this.frontImgWA_1 = certificate_positive_url_WA

    // this.certificate_negative_url_1 = certificate_negative_url
    // this.backImgWA_1 = '2'
    this.certificate_negative_url_1 = ''
    this.backImgWA_1 = ''
    // this.backImgWA_1 = certificate_negative_url_WA

    // this.held_certificate_url_1 = held_certificate_url
    // this.holdImgWA_1 = '2'
    this.held_certificate_url_1 = ''
    this.holdImgWA_1 = ''
    // this.holdImgWA_1 = held_certificate_url_WA

    this.identityAuthWAReason_1 = identityAuth
    this.surname_1 = surname
    this.surnameWA_1 = surnameWA
  }
  this.loading = false
}
// 获取审核中的认证失败
root.methods.error_getIdentityInfo = function (err) {
  console.warn('获取审核中的认证失败', err)
}


// 关闭提示
root.methods.closeClick = function () {
  this.popShow = false;
  this.$cookies.set("popShow", true, 60 * 60 * 12);
}
root.methods.isClosed = function () {

}


// 检测图片
root.methods.testImg = function (file) {
  if (!file) {
    return this.$t('testImg_1')
  }
  if (!/image\/\w+/.test(file.type)) {
    // alert("请传图片！");
    return this.$t('testImg_1')
  }
  if (file.type.split('/')[1] !== 'jpg' && file.type.split('/')[1] !== 'jpeg' && file.type.split('/')[1] !== 'png') {
    return this.$t('imageMsg_0')
  }
  // console.warn("file type", file.type)
  // if ((file.size / 1024) > this.imgSize) {
  //   return this.$t('testImg_2')
  // }
  return ''

}


// 点击正面照
root.methods.click_front = function () {
  this.country === '0' && this.$refs.imgFront_0.click()
  this.country === '1' && this.$refs.imgFront_1.click()

}
root.methods.click_back = function () {
  this.country === '0' && this.$refs.imgBack_0.click()
  this.country === '1' && this.$refs.imgBack_1.click()
}
root.methods.click_hold = function () {
  this.country === '0' && this.$refs.imgHold_0.click()
  this.country === '1' && this.$refs.imgHold_1.click()
}


//身份证正面照
root.methods.frontOnChange = function () {
  if (this.country === '0') {
    this.frontImgWA_0 = '0'
    let file = this.$refs.imgFront_0.files[0]
    let text = this.testImg(file)
    console.warn('this is text', text)
    if (text !== '') {

      this.popType = 0
      this.popText = text
      this.popOpen = true

      document.getElementById('imgFrontContainer_0').innerHTML = ''
      let $file = $(".imgFront_0").eq(0);
      $file.after($file.clone().val(""));
      $file.remove();
      this.frontImgMsg_0 = text
      console.warn("what", this.frontImgMsg_0)
      return false
    }
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (e) {
      let src = e.target.result
      document.getElementById('imgFrontContainer_0').innerHTML = `<img src="${this.result}" width="100%" height="100%">`
    }
    this.frontImgMsg_0 = ''
  }
  if (this.country === '1') {
    this.frontImgWA_1 = '0'
    let file = this.$refs.imgFront_1.files[0]
    let text = this.testImg(file)
    if (text !== '') {

      this.popType = 0
      this.popText = text
      this.popOpen = true

      document.getElementById('imgFrontContainer_1').innerHTML = ''
      let $file = $(".imgFront_0").eq(0);
      $file.after($file.clone().val(""));
      $file.remove();
      this.frontImgMsg_1 = text
      return false
    }
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (e) {
      document.getElementById('imgFrontContainer_1').innerHTML = `<img src="${this.result}" width="100%" height="100%">`
    }
    this.frontImgMsg_1 = ''
  }
}

// 身份证背面照
root.methods.backOnChange = function () {
  if (this.country === '0') {
    this.backImgWA_0 = '0'
    let file = this.$refs.imgBack_0.files[0]
    let text = this.testImg(file)
    if (text !== '') {

      this.popType = 0
      this.popText = text
      this.popOpen = true

      document.getElementById('imgBackContainer_0').innerHTML = ''
      let $file = $(".imgBack_0").eq(0);
      $file.after($file.clone().val(""));
      $file.remove();
      this.backImgMsg_0 = text
      return false
    }
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (e) {
      document.getElementById('imgBackContainer_0').innerHTML = `<img src="${this.result}" width="100%" height="100%">`
    }
    this.backImgMsg_0 = ''
  }
  if (this.country === '1') {
    this.backImgWA_1 = '0'
    let file = this.$refs.imgBack_1.files[0]
    let text = this.testImg(file)
    if (text !== '') {

      this.popType = 0
      this.popText = text
      this.popOpen = true

      document.getElementById('imgBackContainer_1').innerHTML = ''
      let $file = $(".imgBack_1").eq(0);
      $file.after($file.clone().val(""));
      $file.remove();
      this.backImgMsg_1 = text
      return false
    }
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (e) {
      document.getElementById('imgBackContainer_1').innerHTML = `<img src="${this.result}" width="100%" height="100%">`
    }
    this.backImgMsg_1 = ''
  }
}
// 手持身份证
root.methods.holdOnChange = function () {
  if (this.country === '0') {
    this.holdImgWA_0 = '0'
    let file = this.$refs.imgHold_0.files[0]
    let text = this.testImg(file)
    if (text !== '') {

      this.popType = 0
      this.popText = text
      this.popOpen = true

      document.getElementById('imgHoldContainer_0').innerHTML = ''
      let $file = $(".imgHold_0").eq(0);
      $file.after($file.clone().val(""));
      $file.remove();
      this.holdImgMsg_0 = text
      return false
    }
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (e) {
      document.getElementById('imgHoldContainer_0').innerHTML = `<img src="${this.result}" width="100%" height="100%">`
    }
    this.holdImgMsg_0 = ''
  }
  if (this.country === '1') {
    this.holdImgWA_1 = '0'
    let file = this.$refs.imgHold_1.files[0]
    let text = this.testImg(file)
    if (text !== '') {

      this.popType = 0
      this.popText = text
      this.popOpen = true

      document.getElementById('imgHoldContainer_1').innerHTML = ''
      let $file = $(".imgHold_1").eq(0);
      $file.after($file.clone().val(""));
      $file.remove();
      this.holdImgMsg_1 = text
      return false
    }
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (e) {
      document.getElementById('imgHoldContainer_1').innerHTML = `<img src="${this.result}" width="100%" height="100%">`
    }
    this.holdImgMsg_1 = ''
  }
}


// 表单验证
// 判断性别
root.methods.testGender = function () {
  this.genderWA_0 = 0
  this.genderWA_1 = 0
}

// 判断名字0
root.methods.testName_0 = function () {
  this.nameWA_0 = '0'
  if (this.name_0 === '') {
    this.nameMsg_0 = ''
    return false
  }
  if (this.$globalFunc.testSpecial(this.name_0)) {
    this.nameMsg_0 = this.$t('nameMsg_1')
    return false
  }
  this.nameMsg_0 = ''
  return true
}
// 判断名字1
root.methods.testName_1 = function () {
  this.nameWA_1 = '0'
  if (this.name_1 === '') {
    this.nameMsg_1 = ''
    return false
  }
  if (this.$globalFunc.testSpecial(this.name_1)) {
    this.nameMsg_1 = this.$t('nameMsg_1')
    return false
  }
  this.nameMsg_1 = ''
  return true
}

// 判断名字0
root.methods.testGender_0 = function () {
  this.genderMsg_0 = '0'
  if (this.valuegender === '') {
    this.genderMsg_0 = ''
    return false
  }
  this.genderMsg_0 = ''
  return true
}
// 判断名字1
root.methods.testGender_1 = function () {
  this.genderMsg_1 = '0'
  if (this.valuegender === '') {
    this.genderMsg_1 = ''
    return false
  }
  this.genderMsg_1 = ''
  return true
}


// 判断SurName
root.methods.testSurName_1 = function () {
  this.surnameWA_1 = '0'
  if (this.surname_1 === '') {
    this.surnameMsg_1 = ''
    return false
  }
  this.surnameMsg_1 = ''
  return true
}
// 判断身份证0
root.methods.testIdCode_0 = function () {
  this.idCodeWA_0 = '0'
  if (this.idCode_0 === '') {
    this.idCodeMsg_0 = ''
    return false
  }

  let idCodeInfo = this.idValidator && this.idValidator.getInfo(this.idCode_0)

  if (!idCodeInfo) {
    this.idCodeMsg_0 = this.$t('idCodeMsg_0')
    return false
  }
  console.warn('测试身份证！！', idCodeInfo)

  let date = new Date()
  let year = date.getFullYear()

  let birthYear = idCodeInfo.birth.split('-')[0]

  //不能小于18岁
  // if (year - birthYear < 18) {
  //   this.idCodeMsg_0 = '您的年龄不符合平台注册要求18-65周岁！'
  //   return false
  // }

  this.idCodeMsg_0 = ''
  return true
}
// 判断身份证1
root.methods.testIdCode_1 = function () {
  this.idCodeWA_1 = '0'
  if (this.idCode_1 === '') {
    this.idCodeMsg_1 = ''
    return false
  }
  // if (this.idCode_1.length > 18){
  //   this.idCodeMsg_1 = '超过最长位数'
  //   return false
  // }
  this.idCodeMsg_1 = ''
  return true
}


// 点击提交
root.methods.commit = function () {

  let canSend = true


  if (this.country === '0') {
    canSend = this.testName_0() && canSend
    canSend = this.testIdCode_0() && canSend
    canSend = this.testGender_0() && canSend
    if (this.idCode_0 === '') {
      this.idCodeMsg_0 = this.$t('idCodeMsg_0_1') //请输入身份证号
      canSend = false
    }
    if (this.name_0 === '') {
      this.nameMsg_0 = this.$t('nameMsg_0')
      canSend = false
    }
    if (this.valuegender === '') {
      this.genderMsg_0 = this.$t('genderMsg_0')
      canSend = false
    }


    let file = this.$refs.imgFront_0.files[0]

    if (this.frontImgWA_0 !== '2') {
      let text = this.testImg(file)
      if (text !== '') {
        this.frontImgWA_0 = '0'
        //sss====Start
        this.frontImgMsg_0 = text
        //sss========End
        canSend = false
      }
    }

    file = this.$refs.imgBack_0.files[0]

    if (this.backImgWA_0 !== '2') {
      let text = this.testImg(file)
      if (text !== '') {
        this.backImgWA_0 = '0'
        //sss====Start
        this.backImgMsg_0 = text
        //sss========End
        canSend = false
      }
    }


    file = this.$refs.imgHold_0.files[0]

    if (this.holdImgWA_0 !== '2') {
      let text = this.testImg(file)
      if (text !== '') {
        this.holdImgWA_0 = '0'
        //sss====Start
        this.holdImgMsg_0 = text
        //sss========End
        canSend = false
      }
    }

  }


  if (this.country === '1') {
    canSend = this.testName_1() && canSend
    canSend = this.testGender_1() && canSend

    //sss=======S
    // canSend = this.testSurName_1() && canSend
    //sss=======E

    canSend = this.testIdCode_1() && canSend
    if (this.idCode_1 === '') {
      this.idCodeMsg_1 = this.$t('idCodeMsg_0_2')
      canSend = false
    }
    if (this.name_1 === '') {
      this.nameMsg_1 = this.$t('nameMsg_0')
      canSend = false
    }

    if (this.valuegender === '') {
      this.genderMsg_1 = this.$t('genderMsg_0')
      canSend = false
    }

    //sss=======S
    // if (this.surname_1 === '') {
    //   this.surnameMsg_1 = this.$t('surnameMsg_0')
    //   canSend = false
    // }
    //sss========E

    let file = this.$refs.imgFront_1.files[0]
    if (this.frontImgWA_1 !== '2') {
      let text = this.testImg(file)
      if (text !== '') {
        this.frontImgWA_1 = '0'
        //sss====Start
        this.frontImgMsg_1 = text
        //sss========End
        canSend = false
      }
    }

    file = this.$refs.imgBack_1.files[0]

    if (this.backImgWA_1 !== '2') {
      let text = this.testImg(file)
      if (text !== '') {
        this.backImgWA_1 = '0'
        //sss========Start
        this.backImgMsg_1 = text
        //sss========End
        canSend = false
      }
    }


    file = this.$refs.imgHold_1.files[0]

    if (this.holdImgWA_1 !== '2') {
      let text = this.testImg(file)
      if (text !== '') {
        this.holdImgWA_1 = '0'
        //sss========Start
        this.holdImgMsg_1 = text
        //sss========End
        canSend = false
      }
    }


  }

  if (!canSend) {
    console.log('不能发送！')
    return
  }

  this.sending = true
  this.popType = 2
  this.popOpen = true

  this.sendFrontImg = null
  this.sendBackImg = null
  this.sendHoldImg = null


  if (this.country === '0') {
    let frontImg = this.$refs.imgFront_0.files[0]
    if (this.frontImgWA_0 !== '2') {
      if ((frontImg.size / 1024) > this.minZipSize) {
        this.handleImg(frontImg, (data) => {
          this.sendFrontImg = data
          // console.warn('压缩前')
          this.sendInfo()
        })
      } else {
        this.sendFrontImg = frontImg
        this.sendInfo()

      }
    }

    let backImg = this.$refs.imgBack_0.files[0]
    if (this.backImgWA_0 !== '2') {
      // console.warn('what?')
      if ((backImg.size / 1024) > this.minZipSize) {
        this.handleImg(backImg, (data) => {
          this.sendBackImg = data
          // console.warn('压缩中')
          this.sendInfo()
        })
      } else {
        this.sendBackImg = backImg
        this.sendInfo()

      }
    }

    let holdImg = this.$refs.imgHold_0.files[0]
    if (this.holdImgWA_0 !== '2') {

      if ((holdImg.size / 1024) > this.minZipSize) {
        this.handleImg(holdImg, (data) => {
          this.sendHoldImg = data
          // console.warn('压缩后')
          this.sendInfo()
        })
      } else {
        this.sendHoldImg = holdImg
        this.sendInfo()

      }
    }
  }


  if (this.country === '1') {
    let frontImg = this.$refs.imgFront_1.files[0]
    if (this.frontImgWA_1 !== '2') {
      if ((frontImg.size / 1024) > this.minZipSize) {
        this.handleImg(frontImg, (data) => {
          this.sendFrontImg = data
          // console.warn('压缩前')
          this.sendInfo()
        })
      } else {
        this.sendFrontImg = frontImg
        this.sendInfo()

      }
    }

    let backImg = this.$refs.imgBack_1.files[0]
    if (this.backImgWA_1 !== '2') {
      if ((backImg.size / 1024) > this.minZipSize) {
        this.handleImg(backImg, (data) => {
          this.sendBackImg = data
          // console.warn('压缩中')
          this.sendInfo()
        })
      } else {
        this.sendBackImg = backImg
        this.sendInfo()

      }
    }
    let holdImg = this.$refs.imgHold_1.files[0]
    if (this.holdImgWA_1 !== '2') {
      if ((holdImg.size / 1024) > this.minZipSize) {
        this.handleImg(holdImg, (data) => {
          this.sendHoldImg = data
          // console.warn('压缩后')
          this.sendInfo()
        })
      } else {
        this.sendHoldImg = holdImg
        this.sendInfo()

      }
    }
  }

  //sss=========Start

  if ((this.country === '0') && (this.frontImgWA_0 === '2') && (this.backImgWA_0 === '2') && (this.holdImgWA_0 === '2')) {
    this.sendInfo()
  }

  if ((this.country === '1') && (this.frontImgWA_1 === '2') && (this.backImgWA_1 === '2') && (this.holdImgWA_1 === '2')) {
    this.sendInfo()
  }

  //sss=========End

  // 可以发送，压缩图片！



  // let formData = new FormData()
  // if (this.country === '0') {
  //
  //   let frontImgInfo = this.$refs.imgFront_0.value
  //   let frontImgTypeArr = frontImgInfo.split('.')
  //   let frontImgType = frontImgTypeArr[frontImgTypeArr.length - 1].toLocaleLowerCase()
  //
  //   let backImgInfo = this.$refs.imgBack_0.value
  //   let backImgTypeArr = backImgInfo.split('.')
  //   let backImgType = backImgTypeArr[backImgTypeArr.length - 1].toLocaleLowerCase()
  //
  //   let holdImgInfo = this.$refs.imgHold_0.value
  //   let holdImgTypeArr = holdImgInfo.split('.')
  //   let holdImgType = holdImgTypeArr[holdImgTypeArr.length - 1].toLocaleLowerCase()
  //
  //
  //   formData.append('identityStr', JSON.stringify({
  //     'name': this.name_0,
  //     'idCode': this.idCode_0,
  //     'area': 'ChineseMainland',
  //     'gender': this.gender === '0' ? 'MALE' : 'FEMALE',
  //   }))
  //   formData.append('file', this.$refs.imgFront_0.files[0], 'certificate_positive.' + frontImgType)
  //   formData.append('file', this.$refs.imgBack_0.files[0], 'certificate_negative.' + backImgType)
  //   formData.append('file', this.$refs.imgHold_0.files[0], 'held_certificate.' + holdImgType)
  // }
  //
  // if (this.country === '1') {
  //
  //   let frontImgInfo = this.$refs.imgFront_1.value
  //   let frontImgTypeArr = frontImgInfo.split('.')
  //   let frontImgType = frontImgTypeArr[frontImgTypeArr.length - 1].toLocaleLowerCase()
  //
  //   let backImgInfo = this.$refs.imgBack_1.value
  //   let backImgTypeArr = backImgInfo.split('.')
  //   let backImgType = backImgTypeArr[backImgTypeArr.length - 1].toLocaleLowerCase()
  //
  //   let holdImgInfo = this.$refs.imgHold_1.value
  //   let holdImgTypeArr = holdImgInfo.split('.')
  //   let holdImgType = holdImgTypeArr[holdImgTypeArr.length - 1].toLocaleLowerCase()
  //
  //   formData.append('identityStr', JSON.stringify({
  //     'name': this.name_1,
  //     'surname': this.surname_1,
  //     'idCode': this.idCode_1,
  //     'area': 'other',
  //     'gender': this.gender === '0' ? 'MALE' : 'FEMALE',
  //   }))
  //   formData.append('file', this.$refs.imgFront_1.files[0], 'certificate_positive.' + frontImgType)
  //   formData.append('file', this.$refs.imgBack_1.files[0], 'certificate_negative.' + backImgType)
  //   formData.append('file', this.$refs.imgHold_1.files[0], 'held_certificate.' + holdImgType)
  // }
  //
  //
  // this.sending = true
  // this.popType = 2
  // this.popOpen = true
  // this.$http.sendFile('SEND_IDENTITY', formData, {
  //   bind: this,
  //   callBack: this.re_commit,
  //   errorHandler: this.error_commit
  // })
}
root.methods.sendInfo = function () {

  let canSend = true
  if (this.country === '0') {
    if ((this.frontImgWA_0 !== '2' && !this.sendFrontImg)
      || (this.backImgWA_0 !== '2' && !this.sendBackImg)
      || (this.holdImgWA_0 !== '2' && !this.sendHoldImg)
    ) {

      return
    }

    if (this.sendFrontImg && this.sendFrontImg.size / 1024 > this.imgSize) {
      this.frontImgMsg_0 = this.$t('testImg_2')
      canSend = false
    }
    if (this.sendBackImg && this.sendBackImg.size / 1024 > this.imgSize) {
      this.backImgMsg_0 = this.$t('testImg_2')
      canSend = false
    }
    if (this.sendHoldImg && this.sendHoldImg.size / 1024 > this.imgSize) {
      this.holdImgMsg_0 = this.$t('testImg_2')
      canSend = false
    }

  }
  if (this.country === '1') {
    if ((this.frontImgWA_1 !== '2' && !this.sendFrontImg)
      || (this.backImgWA_1 !== '2' && !this.sendBackImg)
      || (this.holdImgWA_1 !== '2' && !this.sendHoldImg)
    ) {

      return
    }

    if (this.sendFrontImg && this.sendFrontImg.size / 1024 > this.minZipSize) {
      this.frontImgMsg_1 = this.$t('testImg_2')
      canSend = false
    }
    if (this.sendBackImg && this.sendBackImg.size / 1024 > this.minZipSize) {
      this.backImgMsg_1 = this.$t('testImg_2')
      canSend = false
    }
    if (this.sendHoldImg && this.sendHoldImg.size / 1024 > this.minZipSize) {
      this.holdImgMsg_1 = this.$t('testImg_2')
      canSend = false
    }
  }

  if (!canSend) {
    this.sending = false
    this.popOpen = false
    return
  }

  console.warn("要发送了！！")


  // return

  let formData = new FormData()
  if (this.country === '0') {

    let frontImgInfo = this.$refs.imgFront_0.value
    let frontImgTypeArr = frontImgInfo.split('.')
    let frontImgType = frontImgTypeArr[frontImgTypeArr.length - 1].toLocaleLowerCase()

    let backImgInfo = this.$refs.imgBack_0.value
    let backImgTypeArr = backImgInfo.split('.')
    let backImgType = backImgTypeArr[backImgTypeArr.length - 1].toLocaleLowerCase()

    let holdImgInfo = this.$refs.imgHold_0.value
    let holdImgTypeArr = holdImgInfo.split('.')
    let holdImgType = holdImgTypeArr[holdImgTypeArr.length - 1].toLocaleLowerCase()

    formData.append('identityStr', JSON.stringify({
      'name': this.name_0,
      'idCode': this.idCode_0,
      // 'area': 'ChineseMainland',
      'area': this.searchResult || "中国大陆地区",
      'gender': this.valuegender == '0' ? 'MALE' : 'FEMALE',
      // 'gender': this.gender == '0' ? 'MALE' : 'FEMALE',
    }))

    //sss=====S
    // formData.append('file', this.sendFrontImg, 'certificate_positive.' + frontImgType)
    // formData.append('file', this.sendBackImg, 'certificate_negative.' + backImgType)
    // formData.append('file', this.sendHoldImg, 'held_certificate.' + holdImgType)
    //sss=====E
    this.sendFrontImg && formData.append('file', this.sendFrontImg, 'certificate_positive.' + frontImgType)
    this.sendBackImg && formData.append('file', this.sendBackImg, 'certificate_negative.' + backImgType)
    this.sendHoldImg && formData.append('file', this.sendHoldImg, 'held_certificate.' + holdImgType)
  }

  if (this.country === '1') {

    let frontImgInfo = this.$refs.imgFront_1.value
    let frontImgTypeArr = frontImgInfo.split('.')
    let frontImgType = frontImgTypeArr[frontImgTypeArr.length - 1].toLocaleLowerCase()

    let backImgInfo = this.$refs.imgBack_1.value
    let backImgTypeArr = backImgInfo.split('.')
    let backImgType = backImgTypeArr[backImgTypeArr.length - 1].toLocaleLowerCase()

    let holdImgInfo = this.$refs.imgHold_1.value
    let holdImgTypeArr = holdImgInfo.split('.')
    let holdImgType = holdImgTypeArr[holdImgTypeArr.length - 1].toLocaleLowerCase()



    formData.append('identityStr', JSON.stringify({
      'name': this.name_1,
      'surname': this.surname_1,
      'idCode': this.idCode_1,
      // 'area': 'other',
      'area': this.searchResult,
      'gender': this.valuegender == '0' ? 'MALE' : 'FEMALE',
    }))


    // sss=====S
    // formData.append('file', this.sendFrontImg, 'certificate_positive.' + frontImgType)
    // formData.append('file', this.sendBackImg, 'certificate_negative.' + backImgType)
    // formData.append('file', this.sendHoldImg, 'held_certificate.' + holdImgType)
    // sss=========E

    // this.sendFrontImg && formData.append('file', this.sendFrontImg, 'certificate_positive.' + frontImgType)
    // this.sendBackImg && formData.append('file', this.sendBackImg, 'certificate_negative.' + backImgType)
    // this.sendHoldImg && formData.append('file', this.sendHoldImg, 'held_certificate.' + holdImgType)
  }

  // if(this.authType == 1){
  //   this.frontOnChange()
  //   this.backOnChange()
  //   this.holdOnChange()
  //   return
  // }


  this.$http.sendFile('SEND_IDENTITY', formData, {
    bind: this,
    callBack: this.re_commit,
    errorHandler: this.error_commit
  })
}


root.methods.re_commit = function (data) {
  this.sending = false
  this.popOpen = false
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data) return
  console.warn('提交表单', data)


  if (data.errorCode) {
    //用户未登录
    if (data.errorCode == 1) {
      this.popType = 0
      this.popText = this.$t('popText_1')
      setTimeout(() => {
        this.popOpen = true
      }, 1000)
      return
    }
    //图片过大
    if (data.errorCode == 2) {
      this.popType = 0
      this.popText = this.$t('popText_2')
      setTimeout(() => {
        this.popOpen = true
      }, 1000)
      return
    }
    // 用户身份证或护照号已存在
    if (data.errorCode == 3) {
      // this.popType = 0
      // this.popText = '上传失败'
      // setTimeout(() => {
      //   this.popOpen = true
      // }, 200t)
      this.country === '0' && (this.idCodeWA_0 = '0', this.idCodeMsg_0 = ' ')
      this.country === '1' && (this.idCodeWA_1 = '0', this.idCodeMsg_1 = ' ')
      this.popWindowWord = this.$t('popText_3')
      this.popWindowOpen = true
      return
    }
    // if (data.errorCode == 4) {
    //   this.country === '0' && (this.idCodeWA_0 = '0', this.idCodeMsg_0 = ' ')
    //   this.country === '1' && (this.idCodeWA_1 = '0', this.idCodeMsg_1 = ' ')
    //   this.popWindowWord = this.$t('popText_4')
    //   this.popWindowOpen = true
    //   return
    // }
    // 认证中
    if (data.errorCode == 5) {
      this.openPop(this.$t('popText_5'))
      return
    }
    // 该用户认证已通过
    if (data.errorCode == 6) {
      this.openPop(this.$t('popText_6'))
      return
    }
    // 7 请选择国籍
    if (data.errorCode == 7) {
      this.popType = 0
      this.popText = this.$t('popText_7')
      setTimeout(() => {
        this.popOpen = true
      }, 1000)
      return
    }
    // 8 用户上传身份证照片不是人像面
    if (data.errorCode == 8) {
      this.popType = 0
      this.popText = this.$t('popText_8')
      setTimeout(() => {
        this.popOpen = true
      }, 1000)
      return
    }
    // 9 身份证输入不对活上传照片数据部分有遮挡导致抓取错误
    // if (data.errorCode == 9) {
    //   this.popType = 0
    //   this.popText = this.$t('popText_9')
    //   setTimeout(() => {
    //     this.popOpen = true
    //   }, 1000)
    //   return
    // }
    // 10 姓名输入不对或上传照片数据部分有遮挡导致抓取错误
    // if (data.errorCode == 10) {
    //   this.popType = 0
    //   this.popText = this.$t('popText_10')
    //   setTimeout(() => {
    //     this.popOpen = true
    //   }, 1000)
    //   return
    // }
    // 11 性别输入不对或上传照片数据部分有遮挡导致抓取错误
    // if (data.errorCode == 11) {
    //   this.popType = 0
    //   this.popText = this.$t('popText_11')
    //   setTimeout(() => {
    //     this.popOpen = true
    //   }, 500)
    //   return
    // }
    // 12 用户上传的不是真实身份证照片
    // if (data.errorCode == 12) {
    //   this.popType = 0
    //   this.popText = this.$t('popText_12')
    //   setTimeout(() => {
    //     this.popOpen = true
    //   }, 1000)
    //   return
    // }
    // 13 身份证不在有效时间内
    // if (data.errorCode == 13) {
    //   this.popType = 0
    //   this.popText = this.$t('popText_13')
    //   setTimeout(() => {
    //     this.popOpen = true
    //   }, 1000)
    //   return
    // }
    // 14 和身份证不是同一人
    // if (data.errorCode == 14) {
    //   this.popType = 0
    //   this.popText = this.$t('popText_14')
    //   setTimeout(() => {
    //     this.popOpen = true
    //   }, 1000)
    //   return
    // }
    // 100 上传的图片不是身份证正面
    // if (data.errorCode == 100) {
    //   this.popType = 0
    //   this.popText = this.$t('popText_100')
    //   setTimeout(() => {
    //     this.popOpen = true
    //   }, 1000)
    //   return
    // }
    // 102 上传的图片不是身份证反面
    // if (data.errorCode == 102) {
    //   this.popType = 0
    //   this.popText = this.$t('popText_102')
    //   setTimeout(() => {
    //     this.popOpen = true
    //   }, 1000)
    //   return
    // }
    // 201 身份证号码无效
    if (data.errorCode == 201) {
      this.popType = 0
      this.popText = this.$t('popText_201')
      setTimeout(() => {
        this.popOpen = true
      }, 1000)
      return
    }
    // 202 姓名无效
    if (data.errorCode == 202) {
      this.popType = 0
      this.popText = this.$t('popText_202')
      setTimeout(() => {
        this.popOpen = true
      }, 1000)
      return
    }
    // 203 身份证和姓名不匹配
    if (data.errorCode == 203) {
      this.popType = 0
      this.popText = this.$t('popText_203')
      setTimeout(() => {
        this.popOpen = true
      }, 1000)
      return
    }
    // 204 图像不清晰
    if (data.errorCode == 204) {
      this.popType = 0
      this.popText = this.$t('popText_204')
      setTimeout(() => {
        this.popOpen = true
      }, 1000)
      return
    }
    // 205 其他参数错误
    if (data.errorCode == 205) {
      this.popType = 0
      this.popText = this.$t('popText_205')
      setTimeout(() => {
        this.popOpen = true
      }, 1000)
      return
    }
    // 206 手持照片和身份证不匹配
    if (data.errorCode == 206) {
      this.popType = 0
      this.popText = this.$t('popText_206')
      setTimeout(() => {
        this.popOpen = true
      }, 1000)
      return
    }
    // 207 其他错误
    if (data.errorCode == 207) {
      this.popType = 0
      this.popText = this.$t('popText_207')
      setTimeout(() => {
        this.popOpen = true
      }, 1000)
      return
    }
    // 208 系统错误
    if (data.errorCode == 208) {
      this.popType = 0
      this.popText = this.$t('popText_208')
      setTimeout(() => {
        this.popOpen = true
      }, 1000)
      return
    }
    // 209 返回结果为空
    if (data.errorCode == 209) {
      this.popType = 0
      this.popText = this.$t('popText_209')
      setTimeout(() => {
        this.popOpen = true
      }, 1000)
      return
    }
    // 210 手持照片为空
    if (data.errorCode == 210) {
      this.popType = 0
      this.popText = this.$t('popText_210')
      setTimeout(() => {
        this.popOpen = true
      }, 1000)
      return
    }
    return
  }
  this.$eventBus.notify({key:'REFRESH_AUTHENTICATE'});//this.$eventBus.notify 最好不要bind this，作用域容易出错
  this.$router.push('/index/personal')
}


root.methods.error_commit = function (err) {
  console.warn("提交表单失败！", err)
  this.sending = false
  this.popOpen = false
  this.popType = 0
  this.popText = this.$t('popText_2')
  setTimeout(() => {
    this.popOpen = true
  }, 200)
}

// 压缩图片！！
root.methods.handleImg = function (file, callBack) {
  let that = this
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')
  let img = new Image()
  img.onload = function () {
    let originWidth = this.width;
    let originHeight = this.height;

    canvas.width = originWidth;
    canvas.height = originWidth * (originHeight / originWidth);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    // 压缩比例
    let k = 0.3
    if (file.size / 1000 > 3000) k = 0.2
    if (file.size / 1000 > 4000) k = 0.1

    let base64 = canvas.toDataURL(file.type, k)
    let blob = that.changeBase64(base64)
    callBack && callBack(blob)
  }
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function (e) {
    img.src = e.target.result
  }
}

// 转base64
root.methods.changeBase64 = function (dataURI) {
  let byteString = window.atob(dataURI.split(',')[1])
  let ab = new ArrayBuffer(byteString.length)
  let ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  let bb = new window.Blob([ab])
  return bb
}

// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}

// 打开弹窗
root.methods.openPop = function (text = '', type = 0) {
  this.popText = text
  this.popType = type
  setTimeout(() => {
    this.popOpen = true
  }, 200)
}


// 关闭popWindow
root.methods.popWindowClose = function () {
  this.popWindowOpen = false
}

// 提交工单
root.methods.goToWordOrder = function () {
  this.$router.push({name: 'wordOrder'})
}

// 弹窗联系客服
root.methods.goToCustomerService= function () {
  qimoChatClick();
  this.popWindowOpen = false;
}


//返回后端的数据
root.methods.clickItem = function(code){
  this.$store.commit('SET_AREA_CODE',code);
  console.log("clickItem code",code)
  window.history.go(-1)
}



export default root
