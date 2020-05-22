// import toCanvas from '../../../../static/js/circle'
import GlobalFunction from "../../../configs/globalFunctionConfigs/GlobalFunction";

const root = {};

root.name = 'MobileForecastHomePage';

root.components = {
  'PopupPrompt': resolve => require(['../../vue/PopupPrompt'], resolve),
  'Loading': resolve => require(['../../vue/Loading'], resolve),
}

root.data = function () {
  return {
    loading: true,

    // 弹框
    popType: 0,
    popText: '',
    popOpen: false,
    waitTime: 2000,

    popIdenOpen: false,

    // 获取pageInfoInterval
    pageInfoInterval: '',

    headerTitle: '',

    titleList: [

    ],

    pageInfoList: [],

    // 现显示的containerList
    containerList: [
    ],

    selectedIndex: 0,

    // 点击确认参与弹框
    toastFlag: false,

    toastSubmitFlag: false,
    // 弹框内容
    toastInfo: '',
    toastInfo2: '',

    // 活动规则弹窗
    ruleToastFlag: false,
    // 是否已同意过
    viewAgreement: false,
    // 活动规则是否同意
    ruleAgreement: false,
    // 活动规则点击ajax控制
    ruleAgreementFlag: false,

    // 活动规则错误提示
    ruleAgreementWA: '',

    // 参与预测input框内
    inputUserAmount: '',
    // 每人限投多少份
    limitEveryOneNum: 0,
    // 错误框提示错误
    wrongWA: '',

    // todo 玄学cookie
    cookieTimes: 0,


    popWindowText: '',
    remainingShares:0 // 剩余份数
  }
}

root.created = function () {

  // 监听windows高度
  window.addEventListener('scroll', this.scrollPage)


  // 获取页面信息
  this.getActivityInfo()

  let that = this

  // TODO:上线时打开(轮询)
  that.pageInfoInterval = setInterval(function () {
    that.getActivityInfo()
  }, 3000);


  if (this.iosQuery) {
    window.postMessage(JSON.stringify({
      method: 'transparentHeader',
      parameters: {
        color:'transparent',
        hiddenRight:true
      }
    }))
    window.postMessage(JSON.stringify({
        method: 'setTitle',
        parameters: ''
      })
    )


    if (this.iosLogin) {
      this.initNeedLoginMethods()
    } else {
      this.ruleToastFlag = false
      this.viewAgreement = true
    }

    let that = this
    document.addEventListener('message',
      function ({data}) {
        that.loading = true
        that.$store.commit('LOGIN_OUT')



        data = JSON.parse(data)
        if (!data.parameters) {
          that.loading = false
          this.ruleToastFlag = false
          this.viewAgreement = true
          return
        }
        that.getCookie(data.parameters)
      }
    )
    this.clientLoad()


    return
  }


  if (this.isLogin) {
    this.initNeedLoginMethods()
  } else {
    this.viewAgreement = true
  }
}

root.mounted = function () {

}

root.beforeDestroy = function () {
  window.removeEventListener('scroll', this.scrollPage)

  clearInterval(this.pageInfoInterval);

  if (this.$route.query.isIOS) {
    window.postMessage(JSON.stringify({
      method: 'revertHeader'
    }))
  }


}

root.computed = {};

root.computed.isLogin = function () {
  return this.$store.state.isLogin;
}

root.computed.userId = function () {
  return this.$store.state.authMessage.userId ? this.$store.state.authMessage.userId : 0
}

// 检验是否是ios
root.computed.iosQuery = function () {
  return this.$route.query.isIOS
}

// 检验ios是否登录
root.computed.iosLogin = function () {
  return this.$route.query.iosLogin
}

// 获取屏幕宽度
root.computed.windowWidth = function () {
  return window.innerWidth
}

// 是否实名认证
root.computed.bindIdentify = function () {
  return this.$store.state.authState.identity
}

root.computed.staticUrl = function () {
  return this.$store.state.static_url
}


root.watch = {};


root.methods = {};

// 开奖时间的增加
root.methods.timeAddition = function (item) {
  let addTime = 30 * 60 * 1000
  let nowTime = (new Date()).valueOf();
  console.info(item.openTime)
  // 当前时间大于开奖时间 显示开奖中
  // if(nowTime > item.openTime) return '正在开奖中'
  if (true) {
    let nextTime = item.openTime + addTime
    // setTimeout( console.info('nextTime ======',nextTime),1000)
    return this.$globalFunc.formatDateUitl(nextTime, 'MM-DD hh:mm') + ' 开奖'
  }
  return this.$globalFunc.formatDateUitl(item.openTime,'MM-DD hh:mm') + ' 开奖'
}

// 检测是不是顶部滑动
root.methods.scrollPage = function () {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop

  let box = ''
  let pageHeaderHeight = 0

  if (this.iosQuery) {
    pageHeaderHeight = this.windowWidth * 128 / 375

    box = $('.forecast-activity-homepage-header-title-ios-box');
  }
  if (!this.iosQuery) {
    pageHeaderHeight = this.windowWidth * 88 / 375

    box = $('.forecast-activity-homepage-header-title');
  }

  let color = 'transparent'

  let shadowColor = 'none'


  if (scrollTop > pageHeaderHeight) {
    color = '#243156'
    shadowColor = '0 4px 16px rgba(0,0,0,0.2)'
  } else {
    color = 'rgba(36,49,86,' + this.toFixed(scrollTop / pageHeaderHeight, 2) + ')'
    shadowColor = '0 4px 16px rgba(0,0,0,' + this.toFixed(0.2 * scrollTop / pageHeaderHeight, 2) + ')'
  }


  box.css("background-color", color);
  box.css("box-shadow", shadowColor);

  if (this.titleList.length <= 1) {
    return
  }

  let titleBox = $('.forecast-activity-homepage-header-title-text-hidden');

  let tabHeaderHeight = this.windowWidth * 190 / 375

  let titleOp = 0

  if (scrollTop > tabHeaderHeight) {
    titleOp = 1
  } else {
    titleOp = this.toFixed(1 * scrollTop / tabHeaderHeight, 2)
  }

  titleBox.css("opacity", titleOp + '')

}

// 初始进入页面需要登录才执行的方法
root.methods.initNeedLoginMethods = function () {
  this.getAuthState()
  this.viewActivity()
}


// ------------------------------------ IOS start ------------------------------------

// 当ios进入此页才执行此方法
root.methods.clientLoad = function () {
  window.postMessage(JSON.stringify({
    method: 'clientLoad',
    parameters: ''
  }))
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

root.methods.re_getCookie = function (data) {
  // todo 玄学cookie
  if (this.cookieTimes < 0) {
    this.checkLogin()
  } else {
    this.getCookie()
    this.cookieTimes = this.cookieTimes - 1;
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
  let dataObj = JSON.parse(data)

  if (dataObj.result === 'FAIL' || dataObj.errorCode) {
    this.loading = false;
    return
  }
  this.$store.commit('SET_AUTH_MESSAGE', dataObj.dataMap.userProfile)

  this.loading = false;
  this.initNeedLoginMethods()


}
root.methods.error_checkLogin = function (err) {
  console.warn("出错了！", err)

}

// ------------------------------------ IOS end ------------------------------------


// 判断验证状态
root.methods.getAuthState = function () {
  this.$http.send('GET_AUTH_STATE', {
    bind: this,
    callBack: this.re_getAuthState,
    errorHandler: this.error_getAuthState
  })
}
// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
  console.warn("获取验证状态出错！", err)
}

// 输入框只能输入数字，小数点只能保留后两位
root.methods.inputNumbers = function (val) {
  let value = val.replace(/\D/g,'');
  if (Number(value) > Number(this.toastInfo2.periodMax)) {
      value = this.toastInfo2.periodMax + '';
  }
  return value
}

// 是否阅读过活动规则
root.methods.viewActivity = function () {
  this.$http.send('ACTIVITY_RULES', {
    bind: this,
    callBack: this.re_viewActivity
  })
}
root.methods.re_viewActivity = function (res) {
  typeof(res) == 'string' && (res = JSON.parse(res));

  if (res.errorCode) {
    switch (res.errorCode) {
      // 未读过是 2
      case 2:
        this.ruleToastFlag = true
        this.viewAgreement = false
        break;
    }
    return
  }

  this.ruleToastFlag = false
  this.viewAgreement = true
}


root.methods.inputUserAmountInput = function () {
  // this.inputUserAmount = this.inputNumbers(this.inputUserAmount)
  this.inputUserAmount = this.inputUserAmount
}
// 幸运抽奖首页列表
// init获取活动信息
root.methods.getActivityInfo = function () {

  this.$http.send('GET_GUESS_INDEX',
    {
      bind: this,
      params: {},
      callBack: this.re_getActivityInfo
    }
  )
}
// 获取页面信息，然后显示几个tab
root.methods.re_getActivityInfo = function (res) {
  typeof(res) == 'string' && (res = JSON.parse(res));

  let data = res.dataMap;
  let titleList = [];
  let pageInfoList = [];

  // this.pageInfoList = res.dataMap;

  if (data.honourGuessList && data.honourGuessList.length != 0) {
    titleList.push('荣耀竞猜')
    pageInfoList.push(data.honourGuessList)
  }
  // if (data.kingGuessList && data.kingGuessList.length != 0) {
  //   titleList.push('王者竞猜')
  //   pageInfoList.push(data.kingGuessList)
  // }
  // if (data.strongestGuessList && data.strongestGuessList.length != 0) {
  //   titleList.push('最强竞猜')
  //   pageInfoList.push(data.strongestGuessList)
  // }
  // console.log('pageInfoList',pageInfoList[this.selectedIndex])

  this.titleList = titleList
  this.pageInfoList = pageInfoList

  this.containerList = pageInfoList[this.selectedIndex]
  console.info('页面数据',this.containerList)

  this.headerTitle = this.titleList[this.selectedIndex]

  this.loading = true

}

// svg在页面上画圆环
root.methods.changeSvg = function (num1, num2) {
  return '' + this.toFixed(Number(num1) * 231 / Number(num2), 0) + ' 251'

}

// 在页面上画圆环
root.methods.drawCanvas = function () {
  // window.cancelAnimationFrame();
  this.containerList && this.containerList.forEach((v) => {
    let residueTicket = v.residueTicket;
    setTimeout(function () {
      toCanvas('canvas_' + v.projectId, residueTicket * 100 / v.eachs, 38, 6)
    }, 0)
  })

}


root.methods.jumpToBack = function () {
  this.$router.replace({name: 'NewH5homePage'})
}


// 点击顶部tab，切换不同的tab选项
root.methods.clickToSelectIndex = function (num) {
  // window.cancelAnimationFrame();
  // console.log('window',window)
  this.selectedIndex = num
  this.containerList = this.pageInfoList[this.selectedIndex]
  this.headerTitle = this.titleList[this.selectedIndex]
  // this.drawCanvas()
}

// 关闭ruleToast弹窗
root.methods.closeRuleToast = function () {
  // console.log('viewAgreement',this.viewAgreement)
  if (!this.viewAgreement) {
    if (this.iosQuery) {
      window.postMessage(JSON.stringify({
        method: 'toHomePage'
      }))
      return
    }
    this.$router.replace({name: 'NewH5homePage'})
  } else {
    this.ruleToastFlag = false
  }

}
// 点击活动规则是否已读
root.methods.changeRuleAgreement = function () {
  this.ruleAgreement = !this.ruleAgreement
  this.ruleAgreementWA = ''
}

// 点击查看规则按钮弹窗
root.methods.jumpToInfo = function () {
  this.ruleToastFlag = true
}

// 关闭toast弹窗
root.methods.closeToast = function () {
  this.toastFlag = false
}

// 点击参与按钮弹框
root.methods.openAmountToast = function (item) {
  this.toastFlag = true
  this.remainingShares = item.eachs - item.residueTicket
  this.openToast(item)
}

// 点击点击参与按钮弹窗
root.methods.openToast = function (item) {
  if (!this.isLogin) {
    this.goToLogin()
    return
  }

  if (!this.bindIdentify) {
    this.goToAuthenticate()
    return
  }

  this.toastInfo = item
  this.$http.send('TO_PARTICIPATE',
    {
      bind: this,
      params: {
        projectId: item.projectId,

      },
      callBack: this.re_openToast,
      errorHandler: this.error_openToast
    }
  )
}

root.methods.re_openToast = function (res) {
  typeof(res) == 'string' && (res = JSON.parse(res));
  console.log(res)
  if (res.errorCode) {
    switch (res.errorCode) {
      case -1:
        this.openPop('参数为空')
        break;
      case 1:
        this.openPop('请登录')
        break;
      case 2:
        this.openPop('未查询到相应的项目')
        break;
      case 3:
        this.openPop('超出每天最大参与次数')
        break;

    }
    return
  }

  this.toastInfo2 = res.dataMap
  // console.log('toastInfo',item)
}


root.methods.error_openToast = function (err) {
  this.openPop('服务器升级中，请稍后再试')
}
// 提示弹框
root.methods.openRuleToastFlag = function () {
  if (!this.ruleAgreement) {
    this.ruleAgreementWA = '提示：请同意活动规则'
    return
  }
  if (this.ruleAgreementFlag) {
    return
  }
  this.ruleToastFlag = false
  this.ruleAgreementFlag = true
  this.joinTheActivity()
}

// 进入活动
root.methods.joinTheActivity = function () {
  this.$http.send('AGREE_ACTIVITY_RULES', {
    bind: this,
    callBack: this.re_joinTheActivity,
    errorHandler: this.error_joinTheActivity
  })
}

root.methods.re_joinTheActivity = function (res) {
  typeof(res) == 'string' && (res = JSON.parse(res));
  this.ruleAgreementFlag = false

  if (res.errorCode == 0) {
    this.ruleToastFlag = false
    this.viewAgreement = true
  }
}

root.methods.error_joinTheActivity = function (err) {
  this.openPop('服务器升级中，请稍后再试');
  this.ruleAgreementFlag = false
}
// 离开活动
root.methods.leaveTheActivity = function () {

  if (this.iosQuery) {
    window.postMessage(JSON.stringify({
      method: 'toHomePage'
    }))
    return
  }
  this.$router.push({name: 'NewH5homePage'})

}


// 点击toast确定按钮
root.methods.submitToastInfo = function () {

  if (!this.inputUserAmount || this.inputUserAmount == 0) {
    this.openPop('请输入参与份数')
    return
  }

  if (this.toastSubmitFlag) {
    return
  }

  console.log(this.toastInfo)

  this.toastSubmitFlag = true
  //
  this.$http.send('LUCK_GUESS',
    {
      bind: this,
      params: {
        projectId: this.toastInfo.projectId,
        periodNumber: this.toastInfo.extPeriod,
        predictNumber: this.inputUserAmount

      },
      callBack: this.re_submitToastInfo,
      errorHandler: this.error_submitToastInfo

    }
  )
}

root.methods.re_submitToastInfo = function (res) {
  typeof(res) == 'string' && (res = JSON.parse(res));

  this.toastSubmitFlag = false

  if (res.errorCode) {

    console.log(res)

    switch (res.errorCode) {
      case -1:
        this.openPop('传递的参数为空')
        break;
      case 1:
        this.openPop('您当前未登录，请先登录')
        break;
      case 2:
        this.openPop('您当前未实名认证，请先前往实名认证')
        break;
      case 3:
        this.openPop('已经不存在这个场景')
        break;
      case 4:
        this.openPop('超出每期可投份数')
        break;
      case 5:
        this.openPop('超出个人每天最大次数')
        break;
      case 6:
        this.openPop('超出可用数量')
        break;
      case 7:
        this.openPop('本期已售完，下期要抓紧哦～')
        break;
      case 8:
        this.openPop('超出本期剩余参与份数')
        break;
      case 9:
        this.openPop('项目已下架')
        break;
      case 10:
        this.openPop('服务器升级中，请稍后再试')
        break;
    }
    return
  }
  this.toastFlag = false

  let successFrequency = res.dataMap.successFrequency;

  this.openPop('您已成功购买'+successFrequency+'份，请前往参与记录查看',1)

  this.inputUserAmount = ''

  // 获取页面信息
  this.getActivityInfo()
}

root.methods.error_submitToastInfo = function (err) {
  this.toastSubmitFlag = false;
  // 超时了
  if((err + '').indexOf('timeout') > '-1') {
    this.openPop('网络连接不稳定，请前往“参与记录”查看参与详情');
    return;
  }
  this.openPop('参与失败，请重试');
}



root.methods.goToLogin = function () {
  if (this.iosQuery) {
    window.postMessage(JSON.stringify({
      method: 'toLogin'
    }))
    return
  } else {
    this.$router.push({name: 'login', query: {name: 'MobileForecastHomePage'}});
  }
}

// 去认证跳转
root.methods.goToAuthenticate = function () {
  // this.popWindowText = '身份认证';
  this.popIdenOpen = true;
  // this.popType = 2;
}


// 点击跳转本期参与
root.methods.goToJoinRecord = function (projectId, periodNumber, currency) {
  if (this.iosQuery) {
    this.$router.push({
      name: 'MobileForecastJoinRecord',
      query: {projectId: projectId, periodNumber: periodNumber, currency: currency, isIOS: true}
    })
  } else {
    this.$router.push({
      name: 'MobileForecastJoinRecord',
      query: {projectId: projectId, periodNumber: periodNumber, currency: currency}
    })
  }
}
// 点击跳转参与记录
root.methods.goToRecord = function () {
  this.$router.push({name: 'Record'})
}

// 点击跳转销毁记录
root.methods.goToDesdroyRecord = function () {
  this.$router.push({name: 'MobileForecastDesdroyRecord'})
}

// 点击跳转开奖记录
root.methods.goToRewardRecord = function (projectId) {
  if (this.iosQuery) {
    this.$router.push({name: 'MobileForecastRewardRecord', query: {projectId: projectId, isIOS: true}})
  } else {
    this.$router.push({name: 'MobileForecastRewardRecord', query: {projectId: projectId}})
  }
}

// 打开toast
root.methods.openPop = function (popText, popType, waitTime) {
  this.popText = popText
  this.popType = popType || 0
  this.popOpen = true
  this.waitTime = waitTime || 2000
}


// 关闭toast
root.methods.closePop = function () {
  this.popOpen = false;
}

// 关闭弹窗
root.methods.popIdenClose = function () {
  this.popIdenOpen = false
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

export default root;
