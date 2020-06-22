const root = {}
root.name = 'MobileMyFollowOrder'
/*------------------------------ 组件 ------------------------------*/
root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
  'PopupPrompt': resolve => require(['../../vue/PopupPrompt'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    followType:1,
    isAutomatic:false,
    isAutomaticing:false,
    followUserList:[],
    profit:{}, // 总金额+总收益
    followId:'',

    // 弹框
    popType: 0,
    popText: '',
    popOpen: false,
    waitTime: 2000,

    delFollowOpen:false,

    fromPageType : ''//进入此页面的3种情况：1.从策略跟单直接进入 '' 2.修改跟单后进入'' 3.添加跟单后进入 addFollower，只有3需要go（-3）
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  if(this.$route.query.isApp) {
    // window.postMessage(JSON.stringify({
    //     method: 'setTitle',
    //     parameters: '跟单'
    //   })
    // );
    window.postMessage(JSON.stringify({
      method: 'setH5Back',
      parameters: {
        canGoH5Back:true
      }
    }))
  }
  // 我的跟随
  this.postMyDocumentary()
}

//检测从哪个路由进来的
root.beforeRouteEnter = function (to, from, next) {
  next(vm => {
    vm.fromPageType = to.params.fromPageType || ''
    if (vm.fromPageType == 'addFollower') {
      //由于this.$router.go(-2)导致不能通过postMessage设置canGoH5Back:false，所以干脆隐藏返回按钮，直接用H5的返回按钮
      window.postMessage(JSON.stringify({
        method: 'setHeaderWithTo0'
      }))
    }
  })
}

root.mounted = function () {
  // if (window.history && window.history.pushState) {
    // 向历史记录中插入了当前页
    // history.pushState(null, null, document.URL);
    window.addEventListener('popstate', this.goBack, false);
  // }
}
root.destroyed = function () {
  // 由于退出本页面后才触发监听，所以不能在这里删除监听，否则不能执行
  // window.removeEventListener('popstate',this.goBack,false)
}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 检验是否是APP
root.computed.isApp = function () {
  return this.$route.query.isApp ? true : false
}
// 检验是否是安卓
root.computed.isAndroid = function () {
  return this.$store.state.isAndroid
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

root.methods.isFollowId = function (item) {
  return this.followId = item.followId
}
// 取消跟随
root.methods.delFollow = function (item){
  this.followId = item.followId
  this.delFollowOpen = true
}
// 关闭取消跟随弹窗
root.methods.delFollowClose = function () {
  this.delFollowOpen = false
}
// 点击修改跟单
root.methods.modifyDocumentary = function (item) {
  this.removeEventPopstate();
  this.$router.push({name:'mobileDocumentary',query:{item:JSON.stringify(item)}})
}

//我的跟单
root.methods.postMyDocumentary = function () {
  this.$http.send('POST_MY_USER', {
    bind: this,
    callBack: this.re_postMyDocumentary,
    errorHandler: this.error_postMyDocumentary
  })
}
root.methods.re_postMyDocumentary = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.followUserList = data.dataMap.list || []
  this.profit = data.dataMap.profit || {}
  if(data.dataMap.followSetting.autoType=="YES"){
    this.isAutomatic = true
    return
  }
  if(data.dataMap.followSetting.autoType=="NO"){
    this.isAutomatic = false
    return
  }
}
root.methods.error_postMyDocumentary = function (err) {
  console.log("this.err=====",err)
}

// 点击切换自动续费
root.methods.clickToggle = function () {
  this.isAutomatic = !this.isAutomatic
  this.$http.send('POST_AUTO_RENEW', {
    bind: this,
    params: {
      val:this.isAutomatic ? 'YES':'NO'
    },
    callBack: this.re_clickToggle,
    errorHandler: this.error_clickToggle
  })
}
// 点击切换自动续费
root.methods.re_clickToggle = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if(!data) return
  if(data.errorCode == 0) {
    this.isAutomatic = data.dataMap.followSetting.autoType=='YES'? true:false
  }
}
// 点击切换自动续费失败
root.methods.error_clickToggle = function (err) {
  console.warn('点击切换自动续费', err)
}

// 取消跟随
root.methods.delFollowList = function () {
  this.$http.send('POST_DEL_FOLLOWER', {
    bind: this,
    params: {
      followId: this.followId
    },
    callBack: this.re_delFollowList,
    errorHandler: this.error_delFollowList
  })
}
// 取消跟随
root.methods.re_delFollowList = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if(!data) return
  if(data.errorCode != 0){
    this.openPop('系统错误',0)
    return
  }
  if(data.errorCode == 0){
    this.openPop('取消跟随成功',1)
    this.postMyDocumentary()
  }
  this.delFollowClose()
}
// 取消跟随
root.methods.error_delFollowList = function (err) {
  console.warn('点击切换自动续费', err)
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

// 切换历史跟单和跟随者
root.methods.toggleType = function (type) {
  this.followType = type
}
// 返回跟单首页
root.methods.jumpToFollowTrade = function () {
  this.removeEventPopstate();
  if (this.fromPageType == 'addFollower') {
    this.$router.go(-3)
    return
  }
  this.$router.go(-1)
}
// 监听事件返回跟单首页
root.methods.goBack = function () {
  // return
  this.removeEventPopstate();

  if (this.fromPageType == 'addFollower') {
    // window.postMessage(JSON.stringify({
    //   method: 'setH5Back',
    //   parameters: {
    //     canGoH5Back:false
    //   }
    // }))
    // history.pushState(null, null, document.URL);
    //由于点击浏览器回退键后才会触发回调，相当于已经执行了go(-1)才进入回调，所以这里是-2，正常情况不作处理
    this.$router.go(-2)
    return
  }
  // history.pushState(null, null, document.URL);
}
root.methods.removeEventPopstate = function () {
  window.removeEventListener('popstate',this.goBack,false)
}
// 个人设置
root.methods.personalSetting = function () {
  console.info('personalSetting=======个人设置',)
}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

/*---------------------- 格式化时间 begin ---------------------*/
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD hh:mm:ss')
}
/*---------------------- 格式化时间 end ---------------------*/
export default root
