const root = {}
root.name = 'StaticH5RecommendedMaid'

import Clipboard from "clipboard";

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}

root.data = function () {
  return {
    // loading
    loading: true,

    //分享链接
    shareUrl: '',

    limit: 10,

    // 获取的列表
    records: [],
    // 已推荐的朋友
    size: 0,
    // 已获得的交易返佣
    totalRebate: 0,

    // 分页
    selectIndex: 1,

    // ajax请求开关
    ajaxFlag: true,


    // 弹窗
    popType: 0,
    popText: '',
    popOpen: false,

    // todo 玄学cookie
    cookieTimes: 0,
  }
}

root.created = function () {



  if(this.$route.query.isIOS){
    let that = this
    that.$store.commit('LOGIN_OUT')
    document.addEventListener('message',
      function({data}){
        // that.$store.commit('LOGIN_OUT')
        that.loading = true;
        // alert(data);
        data = JSON.parse(data);
        // alert('登录cookie 开始获取')
        if(!data.parameters){
          that.$store.commit('LOGIN_OUT')
          that.initData()
        }
        else {
          that.$store.commit('LOGIN_OUT')
          that.getCookie(data.parameters)
        }
      }
    )
    // alert('load开始')
    this.clientLoad()
  }

  this.initData()

}

root.mounted = function () {

}


root.computed = {}

root.computed.isMobile = function () {
  return this.$store.state.isMobile
}

root.computed.userId = function () {
  return this.$store.state.authMessage.userId ? this.$store.state.authMessage.userId : 0
}

root.computed.is_login = function () {
  return this.$store.state.isLogin;
}

root.methods = {}

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
  this.$http.send('PUT_COOKIE', {
    params: data,
    bind: this,
    callBack: this.re_getCookie,
    errorHandler: this.error_getCookie
  })
}

root.methods.re_getCookie = function (data) {
  // alert('开始checklogin')
  // todo 玄学cookie
  if(this.cookieTimes<0){
    this.checkLogin()
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

  this.ajaxFlag = true

  this.initData()


}
root.methods.error_checkLogin = function (err) {
  // alert(err)
  console.warn("出错了！", err)

}

// ------------------------------------ IOS end ------------------------------------

root.methods.initData = function () {
  this.$store.commit('changeMobileHeaderTitle', '推荐返佣');

  this.shareUrl = document.location.host + '/index/register?uid=' + this.$store.state.authMessage.userId + '&source=share';
  !this.userId && (this.shareUrl = '---')

  this.selectIndex = 1;
  this.records = [];

  if(this.is_login){
    // alert(123)
    this.getRecommend(1);
  } else {
    this.loading = false;
  }

}

// 获取列表
root.methods.getRecommend = function (index) {
  if (this.ajaxFlag === false) return
  this.ajaxFlag = false
  this.selectIndex = index
  let fromIndex = (index - 1) * this.limit + 1
  let toIndex = (index) * this.limit

  this.$http.send('POST_RECOMMEND', {
    bind: this,
    params: {
      fromIndex: fromIndex,
      toIndex: toIndex,
    },
    callBack: this.re_getRecommend,
    errorHandler: this.error_getRecommend
  })
}

// 获取列表成功
root.methods.re_getRecommend = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.loading = false
  console.warn('this is data', data)
  let recordAll = this.records


  for (let i = 0; i < data.dataMap.myInvites.length; i++) {
    recordAll.push(data.dataMap.myInvites[i])
  }

  this.records = recordAll
  this.size = data.dataMap.size
  this.totalRebate = data.dataMap.totalRebate

  this.selectIndex = this.selectIndex + 1
  this.ajaxFlag = true

}
// 获取列表出错
root.methods.error_getRecommend = function (err) {
  console.warn('获取出错！', err)
  this.loading = false
  this.ajaxFlag = true
}

// 用户名修改
root.methods.handleName = function (name) {
  // let nameArr = name.split('@')
  // return `${nameArr[0][0]}****${nameArr[0].length === 0 ? '' : nameArr[0].charAt(nameArr[0].length - 1)}@${nameArr[1]}`
  return this.$globalFunc.listFormatUserName(name)
}


root.methods.getMoreList = function (num) {
  this.getRecommend(num);
}

root.methods.copyShareUrl = function () {
  if (!this.userId) return
  let copyBtn = new Clipboard('.recommended-header-item-right-copy');
  let that = this
  copyBtn.on('success', function (e) {
    e.clearSelection();
    that.popOpen = true
    that.popType = 1
    that.popText = '复制成功'
    copyBtn.destroy()
  })
  copyBtn.on('error', function (e) {
    that.popOpen = true
    that.popType = 0
    that.popText = '复制失败'
    copyBtn.destroy()
  })
}


// 关闭弹窗
root.methods.closePop = function () {
  this.popOpen = false
}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

/*---------------------- 加法运算 begin ---------------------*/
root.methods.accAdd = function (num1, num2) {
  return this.$globalFunc.accAdd(num1, num2)
}
/*---------------------- 加法运算 end ---------------------*/

/*---------------------- 减法运算 begin ---------------------*/
root.methods.accMinus = function (num1, num2) {
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

root.methods.gotoLogin = function () {
  if (this.$route.query.isApp) {
    window.android.toLogin();
    return
  }
  if (this.$route.query.isIOS) {
    window.postMessage(JSON.stringify({
      method: 'toLogin'
    }))
    return
  }
  this.$router.push({name: 'login'})
}

root.methods.gotoReg = function () {
  if (this.$route.query.isApp) {
    window.android.toReg();
    return
  }
  if (this.$route.query.isIOS) {
    window.postMessage(JSON.stringify({
      method: 'toRegister'
    }))
    return
  }
  this.$router.push({name: 'register'})
}


export default root
