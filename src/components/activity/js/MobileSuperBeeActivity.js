const root = {};

root.name = 'MobileSuperBeeActivity';

root.data = function () {
  return {
    loading: true,

    // 弹框
    popType: 0,
    popText: '',
    popOpen: false,
    popWaitTime: 2000,

    // 页面数据
    pageInfo: '',

    // 是否是超级为蜜
    isSuperBee: false,
    // 是否是机构为蜜
    isMechanismSuperBee: false,

    // 兼容ios
    // todo 玄学cookie
    cookieTimes: 0,


  }
}

root.components = {
  'PopupPrompt': resolve => require(['../../vue/PopupPrompt'], resolve),
  'Loading': resolve => require(['../../vue/Loading'], resolve),
}

root.created = function () {
  // 获取页面信息
  this.getPageInfo()

  window.addEventListener('scroll',this.scrollPage)

  // 如果是app进入,先隐藏头部
  if(this.iosQuery) {
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
      function({data}){
        that.loading = true;
        data = JSON.parse(data);
        if (!data.parameters) {
          that.loading = false
          that.$store.commit('LOGIN_OUT')
          return
        }
        that.getCookie(data.parameters)
      }
    )
    // alert('load开始')
    this.clientLoad()




  }


}

root.mounted = function () {

}

root.beforeDestroy = function() {

}

root.destroyed = function () {
  if (this.iosQuery) {
    window.postMessage(JSON.stringify({
      method: 'revertHeader'
    }))
  }

  window.removeEventListener('scroll',this.scrollPage)
}

root.watch = {};

root.computed = {};






// 检验是否登录
root.computed.isLogin = function () {
  return this.$store.state.isLogin;
}

// 检验是否是ios
root.computed.iosQuery = function () {
  return this.$route.query.isIOS
}

root.computed.iosLogin = function () {
  return this.$route.query.iosLogin
}

// root.computed.viewSuperBeeActivityAddress = function () {
//   if(this.iosQuery) {
//     // window.postMessage(JSON.stringify({
//     //   method: 'revertHeader',
//     //   parameters: '111'
//     // }))
//     return 'https://www.btcdo.com/index/mobileNoticeDetail?id=100310&isIOS=true'
//   }
//   if(!this.iosQuery) {
//     return 'https://www.btcdo.com/index/mobileNoticeDetail?id=100310'
//   }
// }


root.methods = {};

// 检测是不是顶部滑动
root.methods.scrollPage = function () {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop

  let box = ''
  let pageHeaderHeight = 0
  let boxText = $('.super-bee-activity-header-title-text');

  if (this.iosQuery) {
    pageHeaderHeight = 64

    box = $('.super-bee-activity-header');
  }
  if (!this.iosQuery) {
    pageHeaderHeight = 44

    box = $('.super-bee-activity-header');
  }

  let color = 'transparent'

  let boxShadow = 'none'

  let textColor = '0'

  if (scrollTop > pageHeaderHeight) {
    color = '#262E57'
    boxShadow = '0 4px 16px rgba(0,0,0,0.2)'
    textColor = '1'
  } else {
    color = 'rgba(38,46,87,'+ this.toFixed(scrollTop/pageHeaderHeight,2) +')'
    boxShadow = '0 4px 16px rgba(0,0,0,'+this.toFixed(0.2*scrollTop/pageHeaderHeight,2)+')'
    textColor = this.toFixed(scrollTop/pageHeaderHeight,2)
  }

  box.css("background-color",color);
  box.css("box-shadow",boxShadow);

  boxText.css("opacity",textColor)
}


// -------------------------------------- 兼容ios begin --------------------------------------
// 当ios进入此页才执行此方法
root.methods.clientLoad = function () {
  window.postMessage(JSON.stringify({
    method: 'clientLoad',
    parameters: ''
  }))
}

// IOS请求putCookie
root.methods.getCookie = function (data) {
  this.$http.send('PUT_COOKIE', {
    params: data,
    bind: this,
    callBack: this.re_getCookie,
    errorHandler: this.error_getCookie
  })
}

root.methods.re_getCookie = function (data) {
  // todo 玄学cookie
  if(this.cookieTimes < 0){
    this.checkLoginRequest()
  } else {
    this.getCookie()
    this.cookieTimes = this.cookieTimes -1;
  }
}

root.methods.checkLoginRequest = function () {
  this.$http.send('CHECKLOGININ', {
    bind: this,
    callBack: this.re_checkLogin,
    errorHandler: this.error_checkLogin
  })
}
root.methods.re_checkLogin = function (data) {
  let dataObj = JSON.parse(data)
  if (dataObj.result === 'FAIL' || dataObj.errorCode) {
    return
  }
  this.$store.commit('SET_AUTH_MESSAGE', dataObj.dataMap.userProfile)

  this.getBeeInfo()
}
root.methods.error_checkLogin = function (err) {
  // alert(err)
  console.warn("出错了！", err)

}



// -------------------------------------- 兼容ios end --------------------------------------



// 进入此页,获取页面元素
root.methods.getPageInfo = function () {
  this.$http.send('GET_SUPER_BEE_MECHANISM_INFO',
    {
      bind: this,
      params: {},
      callBack: this.re_getPageInfo
    }
  )
}

root.methods.re_getPageInfo = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.pageInfo = data;

  if(this.isLogin) {
    this.getBeeInfo()
  } else {
    this.loading = false
  }
}

// 登录后，获取登录信息
root.methods.getBeeInfo = function () {
  this.$http.send('GET_SUPER_BEE_USER_STATE',
    {
      bind: this,
      params: {},
      callBack: this.re_getBeeInfo
    }
  )
}

root.methods.re_getBeeInfo = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.isSuperBee = data.dataMap.superBeeCan;
  this.isMechanismSuperBee = data.dataMap.mechanismSuperBeeCan;
  this.loading = false
}

// 点击超级为蜜立即申请
root.methods.viewRight = function () {
  if(this.iosQuery) {
    window.postMessage(JSON.stringify({
      method: 'revertHeader'
    }))
    this.loading = true

    setTimeout(function(){
        window.location.href = 'https://www.btcdo.com/index/mobileNoticeDetail?id=100310&isIOS=true'
    },0)
    return
  }

  window.open('https://www.btcdo.com/index/mobileNoticeDetail?id=100310')
}

// 点击超级为蜜立即申请
root.methods.joinSuperBee = function () {
  if(this.checkLogin() === false){
    return
  }
  if(this.iosQuery) {
    window.postMessage(JSON.stringify({
      method: 'revertHeader'
    }))
    this.loading = true
    setTimeout(function(){
      window.location.href = 'https://jinshuju.net/f/RY11kl'
    },0)

    return
  }

  window.open('https://jinshuju.net/f/RY11kl')
}

// 点击机构超级为蜜立即申请
root.methods.joinMechanismSuperBee = function () {
  if(this.checkLogin() === false){
    return
  }
  if(this.iosQuery) {
    window.postMessage(JSON.stringify({
      method: 'revertHeader'
    }))
    this.loading = true
    setTimeout(function(){
      window.location.href = 'https://jinshuju.net/f/z6oRKU'
    },0)
    return
  }

  window.open('https://jinshuju.net/f/z6oRKU')
}

// 推荐上币
root.methods.recommendGoToken = function () {
  if(this.checkLogin() === false){
    return
  }

  if(this.isSuperBee === false) {
    this.openPromptInfo('请先申请超级为蜜')
    return
  }
  if(this.iosQuery) {
    window.postMessage(JSON.stringify({
      method: 'revertHeader'
    }))
    this.loading = true

    setTimeout(function(){
      window.location.href = 'https://jinshuju.net/f/jhg65X'
    },0)
    return
  }

  window.open('https://jinshuju.net/f/jhg65X')
}

// 机构推荐上币
root.methods.recommendMechanismGoToken = function () {
  if(this.checkLogin() === false){
    return
  }



  if(this.isMechanismSuperBee === false) {
    this.openPromptInfo('请先申请机构超级为蜜')
    return
  }
  if(this.iosQuery) {
    window.postMessage(JSON.stringify({
      method: 'revertHeader'
    }))
    this.loading = true
    setTimeout(function(){
      window.location.href = 'https://jinshuju.net/f/jhg65X'
    },0)
    return
  }

  window.open('https://jinshuju.net/f/jhg65X')
}

// 弹窗方法
root.methods.openPromptInfo = function (text,type,time) {
  this.popType = type || 0;
  this.popText = text;
  this.popWaitTime = time || 2000;
  this.popOpen = true
}








root.methods.checkLogin = function () {
  // console.warn('haha')
  if(this.isLogin === false) {
    if(this.iosQuery){
      window.postMessage(JSON.stringify({
        method: 'toLogin'
      }))
      return false
    }
    this.$router.push({name: 'login', query: {name: 'MobileSuperBeeActivity'}});
    return false
  } else {
    return true
  }
}


// 跳转回首页
root.methods.jumpToHomepage = function () {
  this.$router.push({name: 'NewH5homePage'});
  return false;
}

// 点击查看已锁定BT
root.methods.clickToLockBT = function () {
  if(this.iosQuery) {
    window.location.href = 'https://etherscan.io/token/0xe124d5dc2ffb975b31c7789c71707223098b129b?a=0x41f442aee4e7791c7c807D5910B457b046bA3B32'
    return
  }
  window.open('https://etherscan.io/token/0xe124d5dc2ffb975b31c7789c71707223098b129b?a=0x41f442aee4e7791c7c807D5910B457b046bA3B32')

}

// 点击查看已锁定BDB
root.methods.clickToLockBDB = function () {
  if(this.iosQuery) {
    window.location.href = 'https://etherscan.io/token/0x0fed2aca55338d77438797bdf609252db92313ea?a=0x1a45BB64946126197d749d28967c7aC4E5d52f25'
    return
  }
  window.open('https://etherscan.io/token/0x0fed2aca55338d77438797bdf609252db92313ea?a=0x1a45BB64946126197d749d28967c7aC4E5d52f25')
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

export default root;
