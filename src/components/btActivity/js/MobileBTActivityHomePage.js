const root = {}

root.name = 'MobileBTActivityHomePage'

root.data = function () {
  return {
    loading: true,

    // 弹框
    popType: 0,
    popText: '',
    popOpen: false,

    // todo 玄学cookie
    cookieTimes: 0,


    // ios是否显示回退按钮
    iosGoBackIsShow: true,

    // 设5分钟请求的setInterval
    setIntervalTimerFiveMinutes: '',

    // 个人挖矿收益
    userProfitsData: {
      usdt: 0,
      items: {
        feeBonus:0, // bdb燃烧额外奖励
        sum:0,// 昨日总计获得bt
        invite: 0, // 邀请好友奖励
        mining: 0, // 挖矿收益
      }

    },

    // 平台挖矿收益
    platformProfitsData: {
      dividend: 0,
      items: {
        mining: 0, // 昨日挖矿产出
        sumAmount: 0, // 昨日分配利益折合
        grand: 0, // 今日总流通量
      }
    },

    // 个人资产信息
    userHaveAccount: {
      balance: 0,
      fee: 0,
      btLeft: 0,
    },

    // 控制loading

    // 登录后的请求

    // 登录后获取顶部个人当前BT资产
    loginGetUserAccountInfoAjaxFlag: false,
    // 获取个人收益折合usdt值
    loginGetUserMiningInformationAjaxFlag: false,
    // 获取个人收益其他值
    loginGetUserRewardAjaxFlag: false,

    // 登录前的请求
    // 获取平台分配信息
    nlGetPlatformDataAjaxFlag: false,
    // 轮询平台今日分配折合
    nlGetFeeDividentAjaxFlag: false,
    // 轮询平台今日可挖bt数量
    nlGetPlatformBTDataAjaxFlag: false,

    // 轮询登录后看到的今日剩余可挖BT数量
    userBTRestTodayAmount: 0,
    userBTInterval: '',

    // 轮询今日可挖bt数量和今日剩余可挖bt数量
    platformBTData: {
      btTotalLimit: 0,
      btLeft: 0,
    },
    platformBTInterval: '',








  }
}

root.components = {
  'PopupPrompt': resolve => require(['../../vue/PopupPrompt'], resolve),
  'Loading': resolve => require(['../../vue/Loading'], resolve),
}

root.created = function () {


  if (this.$route.query.isApp) {
    window.android.goneTitile();
  }


  if (this.$route.query.isIOS) {
    window.postMessage(JSON.stringify({
      method: 'transparentHeader',
      parameters: 'transparent'
    }))
    window.postMessage(JSON.stringify({
        method: 'setTitle',
        parameters: ''
      })
    )

    let that = this
    document.addEventListener('message',
      async function ({data}) {
        that.loading = true
        that.$store.commit('LOGIN_OUT')
        data = JSON.parse(data)
        if (!data.parameters) {
          that.initMethods()
          return
        }
        that.loginGetUserAccountInfoAjaxFlag = false;
        that.loginGetUserMiningInformationAjaxFlag = false;
        that.loginGetUserRewardAjaxFlag = false;
        await that.getCookie(data.parameters)
        that.initMethods()
      }
    )
    this.clientLoad()
    return
  }
  this.initMethods()
}

root.mounted = function () {

}

root.destroyed = function () {
  let that = this
  clearInterval(that.setIntervalTimerFiveMinutes);
  clearInterval(that.userBTInterval);
  clearInterval(that.platformBTInterval);


  if (this.$route.query.isIOS) {
    window.postMessage(JSON.stringify({
      method: 'revertHeader'
    }))
  }

  if (this.$route.query.isApp) {
    window.android.showTitile();
  }

}

root.watch = {};

root.computed = {};

// 检验是否登录
root.computed.is_login = function () {
  return this.$store.state.isLogin;
}

// 检验是否是ios
root.computed.ios_query = function () {
  return this.$route.query.isIOS
}

root.methods = {};

root.methods.initMethods = function () {
  // 确认是否为ios或者安卓
  if(this.$route.query.isIOS) {
    this.iosGoBackIsShow = false;
  }

  let that = this;
  // 轮询平台今日分配折合
  that.getFeeDivident();

  this.setIntervalTimerFiveMinutes = setInterval(()=>{
    that.getFeeDivident();
  },300000)

  // 获取平台可挖bt数量
  this.getPlatformBTData();
  this.platformBTInterval = setInterval(()=>{
    that.getPlatformBTData();
  },60000)


  // 获取平台分配信息
  this.getPlatformData();



  // 登录后获取个人算力信息
  if(this.is_login) {
    this.initLoginMethods();
  }


  // 登录获取昨日平台奖励信息
  // this.getAllMiningInformation()

}

root.methods.initLoginMethods = function () {
  let that = this;
  // this.btActivityCurrent();
  // 获取个人收益折合usdt值
  this.getUserMiningInformation();
  // 获取个人收益其他值
  this.getUserReward();
  // 获取我的当前资产
  this.getUserAccountInfo();
  this.userBTInterval = setInterval(()=>{
    that.getUserAccountInfo();
  },60000)

  // this.getUserGrandTotal();
}

root.methods.checkLoading = function () {
  if(this.is_login ) {
    this.loading = !(this.loginGetUserAccountInfoAjaxFlag && this.loginGetUserMiningInformationAjaxFlag && this.loginGetUserRewardAjaxFlag && this.nlGetPlatformDataAjaxFlag && this.nlGetFeeDividentAjaxFlag && this.nlGetPlatformBTDataAjaxFlag)
    // console.log('thisloadingData',this.loading)
  } else {
    this.loading = !(this.nlGetPlatformDataAjaxFlag && this.nlGetFeeDividentAjaxFlag && this.nlGetPlatformBTDataAjaxFlag)
    // console.log('thisloadingData',this.loading)
  }
}


// ------------------------------------ IOS start ------------------------------------

// 当ios进入此页才执行此方法
root.methods.clientLoad = function () {
  window.postMessage(JSON.stringify({
    method: 'clientLoad',
    parameters: ''
  }))
}

// 当ios进入此页才执行此方法
root.methods.toRecharge = function (currency) {
  window.postMessage(JSON.stringify({
      method: 'toRecharge',
      parameters: currency
    })
  );
}

// IOS请求putCookie
root.methods.getCookie = function (data) {
  return this.$http.send('PUT_COOKIE', {
    params: data,
    bind: this,
    callBack: this.re_getCookie,
    errorHandler: this.error_getCookie
  })
}

root.methods.re_getCookie = async function (data) {
  // todo 玄学cookie
  if(this.cookieTimes<0){
    return this.checkLogin()
  } else {
    this.getCookie()
    this.cookieTimes = this.cookieTimes -1;
  }
}

root.methods.error_getCookie = function (err) {
  // alert(err)
}

root.methods.checkLogin = function () {
  this.$http.send('CHECKLOGININ', {
    bind: this,
    callBack: this.re_checkLogin,
    errorHandler: this.error_checkLogin
  })
}
root.methods.re_checkLogin = function (data) {
  // alert(data)
  let dataObj = JSON.parse(data)
  // console.warn('检查登录！', dataObj)

  if (dataObj.result === 'FAIL' || dataObj.errorCode) {
    this.loading = false;
    return
  }
  this.$store.commit('SET_AUTH_MESSAGE', dataObj.dataMap.userProfile)

  this.initLoginMethods()


}
root.methods.error_checkLogin = function (err) {
  // alert(err)
  console.warn("出错了！", err)

}

// ------------------------------------ IOS end ------------------------------------

// 登录后获取bt数量
root.methods.getPlatformBTData = function () {
  this.$http.send('GET_BT_PLATFORM_BT_DATA', {
    bind: this,
    callBack: this.re_getPlatformBTData,
    errorHandler: this.error_getPlatformBTData
  })
}

root.methods.re_getPlatformBTData = function (data){
  // console.log('data',data)
  typeof data === 'string' && (data = JSON.parse(data));
  this.platformBTData = data.dataMap;
  this.nlGetPlatformBTDataAjaxFlag = true
  this.checkLoading();
}

root.methods.error_getPlatformBTData = function (err){
  console.log('err',err)
}



// 登录后获取顶部个人当前BT资产
root.methods.getUserAccountInfo = function () {
  this.$http.send('GET_BT_USER_ACCOUNT_INFO', {
    bind: this,
    callBack: this.re_getUserAccountInfo,
    errorHandler: this.error_getUserAccountInfo
  })
}

root.methods.re_getUserAccountInfo = function (data){
  typeof data === 'string' && (data = JSON.parse(data));
  this.userHaveAccount = data.dataMap;
  this.loginGetUserAccountInfoAjaxFlag = true;
  this.checkLoading();
}

root.methods.error_getUserAccountInfo = function (err){
  console.log(err)
}

// 登录后获取昨日个人挖矿信息1
root.methods.getUserMiningInformation = function () {
  this.$http.send('GET_BT_MININGINFORMATION_FOR_USER', {
    bind: this,
    callBack: this.re_getUserMiningInformation,
    errorHandler: this.error_getUserMiningInformation
  })
}

root.methods.re_getUserMiningInformation = function (data){
  typeof data === 'string' && (data = JSON.parse(data));

  this.loginGetUserMiningInformationAjaxFlag = true;
  this.checkLoading();
  if(data.errorCode) {
    return
  }
  this.userProfitsData.usdt = data.dataMap.allDividend;
}

root.methods.error_getUserMiningInformation = function (err) {
  console.log(err)
}



// 登录后获取昨日个人挖矿信息2
root.methods.getUserReward = function () {
  this.$http.send('GET_BT_USER_REWARD', {
    bind: this,
    callBack: this.re_getUserReward,
    errorHandler: this.error_getUserReward
  })
}

root.methods.re_getUserReward = function (data){
  typeof data === 'string' && (data = JSON.parse(data));
  this.loginGetUserRewardAjaxFlag = true;
  this.checkLoading();
  if(data.errorCode) {
    return
  }
  this.userProfitsData.items = data.dataMap;

}

root.methods.error_getUserReward = function (err){
  console.log(err)
}

// 获取平台信息1 轮询
root.methods.getFeeDivident = function () {
  this.$http.send('GET_BT_FEE_DIVIDENT', {
    bind: this,
    callBack: this.re_getFeeDivident,
    errorHandler: this.error_getFeeDivident
  })
}

root.methods.re_getFeeDivident = function (data){
  typeof data === 'string' && (data = JSON.parse(data));
  this.nlGetFeeDividentAjaxFlag = true;
  this.checkLoading();
  if(data.errorCode) {
    return
  }
  // console.log('获取平台信息1',data)
  this.platformProfitsData.dividend = data.dataMap.dividend
  // this.userProfitsData.items = data.dataMap;

}

root.methods.error_getFeeDivident = function (err){
  console.log(err)
}

// 获取平台信息2
root.methods.getPlatformData = function () {
  this.$http.send('GET_BT_PLATFORM_DATA', {
    bind: this,
    callBack: this.re_getPlatformData,
    errorHandler: this.error_getPlatformData
  })
}

root.methods.re_getPlatformData = function (data){
  typeof data === 'string' && (data = JSON.parse(data));
  this.nlGetPlatformDataAjaxFlag = true;
  this.checkLoading();
  if(data.errorCode) {
    return
  }
  // console.log('获取平台信息2',data)

  this.platformProfitsData.items = data.dataMap;
  // this.platformProfitsData.dividend = data.dataMap.dividend
  // this.userProfitsData.items = data.dataMap;

}

root.methods.error_getPlatformData = function (err){
  console.log(err)
}




// 跳转回首页
root.methods.jumpToHomepage = function () {
  if (this.$route.query.isApp) {
    window.android.toHome();
    return false;
  }
  this.$router.push({name: 'NewH5homePage'});
  return false;
}

// 跳转去注册
root.methods.jumpToRegister = function () {
  if (!this.is_login && !(this.$route.query.isApp || this.$route.query.isIOS)) {
    this.$router.push({name: 'register'});
    return false;
  }
  if (!this.is_login && this.$route.query.isApp) {
    window.android.toReg();
    return false;
  }
  if (!this.is_login && this.$route.query.isIOS) {
    window.postMessage(JSON.stringify({
      method: 'toRegister'
    }))
    return false;
  }
}

// 跳转去登录后回到此页
root.methods.jumpToLogin = function () {
  if (!this.is_login && !(this.$route.query.isApp || this.$route.query.isIOS)) {
    this.$router.push({name: 'login', query: {name: 'MobileBTActivityHomePage'}});
    return false;
  }
  if (this.$route.query.isApp) {
    window.android.toRecharge();
    return
  }
  if (this.$route.query.isIOS) {
    window.postMessage(JSON.stringify({
      method: 'toAsset'
    }))
    return
  }
}

// 跳转去个人收益记录
root.methods.jumpToYouHistory = function () {
  if (!this.is_login && !(this.$route.query.isApp || this.$route.query.isIOS)) {
    this.$router.push({name: 'login', query: {name: 'MobileBTActivityHomePage'}});
    return false;
  }
  if (!this.is_login && this.$route.query.isApp) {
    window.android.toLoginAndBack();
    return false;
  }
  if (!this.is_login && this.$route.query.isIOS) {
    window.postMessage(JSON.stringify({
      method: 'toLogin'
    }))
    return
  }

  this.$router.push({name: 'MobileBTActivityTradingBTRecords'});

  // if (this.$route.query.isApp) {
  //   let address = window.location.origin + '/static/MobileBTActivityProfitRecord/MobileBTActivityTradingBTRecords?isApp=true';
  //   window.android.toBtInfo(address,true);
  // }
  return false;
}

// 跳转去我的推荐页 todo android现跳转至h5页面
root.methods.jumpToRecommend = function () {
  if (!this.$route.query.isIOS) {
    this.$router.push({name: 'H5Recommend'});
    // if (this.$route.query.isApp) {
    //   let address = window.location.origin + '/index/personal/H5Recommend?isApp=true';
    //   window.android.toBtInfo(address);
    // }
    return false;
  }
  if (this.$route.query.isIOS) {
    window.postMessage(JSON.stringify({
      method: 'goMyRecommend'
    }))
    return false;
  }
}

// 跳转去使用bdb燃烧额外奖励页
root.methods.jumpToBDBReward = function () {
  if (!(this.$route.query.isApp || this.$route.query.isIOS)) {
    this.$router.push({name: 'MobileUseBDBBurnRewards'});
    return false;
  }
  if (this.$route.query.isApp) {
    window.android.toBdbBurnReward();
    return false;
  }
  if (this.$route.query.isIOS) {
    window.postMessage(JSON.stringify({
      method: 'goBDBBurnReward'
    }))
    return false;
  }
}

// 跳转去平台收益记录
root.methods.jumpToPlatformHistory = function () {

  this.$router.push({name: 'MobileBTActivityPlatformRecordOutput'});
  // if (this.$route.query.isApp) {
  //   let address = window.location.origin + '/static/MobileBTActivityPlatformRecord/MobileBTActivityPlatformRecordOutput?isApp=true';
  //   window.android.toBtInfo(address,true);
  // }
  return false;
}

// 跳转挖矿分红问题
root.methods.jumpToHelp = function () {
  this.$router.push({name: 'MobileBTActivityHelp'});
  // if (this.$route.query.isApp) {
  //   let address = window.location.origin + '/static/MobileBTActivityHelp?isApp=true';
  //   window.android.toBtInfo(address,true);
  // }
  return false;
}

// 打开弹窗
root.methods.openToast = function () {
  this.toastOpen = true;
}

// 关闭弹窗
root.methods.closeToast = function () {
  this.toastOpen = false;
}

// 关闭toast
root.methods.closePop = function () {
  this.popOpen = false;
}


/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

/*---------------------- 加法运算 begin ---------------------*/
root.methods.accAdd = function (num1, num2) {
  num1 = parseFloat(num1)
  num2 = parseFloat(num2)
  return this.$globalFunc.accAdd(num1, num2)
}
/*---------------------- 加法运算 end ---------------------*/

/*---------------------- 减法运算 begin ---------------------*/
root.methods.accMinus = function (num1, num2) {
  num1 = parseFloat(num1)
  num2 = parseFloat(num2)
  return this.$globalFunc.accMinus(num1, num2)
}
/*---------------------- 减法运算 end ---------------------*/

/*---------------------- 乘法运算 begin ---------------------*/
root.methods.accMul = function (num1, num2) {
  return this.$globalFunc.accMul(num1, num2)
}
/*---------------------- 乘法运算 end ---------------------*/

/*---------------------- 除法运算 begin ---------------------*/
root.methods.accDiv = function (num1, num2) {
  return this.$globalFunc.accDiv(num1, num2)
}
/*---------------------- 除法运算 end ---------------------*/


export default root

