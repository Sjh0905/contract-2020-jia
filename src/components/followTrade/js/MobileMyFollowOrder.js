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

    fromName : 'mobileFollowTrade'
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
    vm.fromName = from.name
  });
}

root.mounted = function () {}
root.beforeDestroy = function () {}
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
  console.info('item====','执行啦几次呢？？?')
  return this.followId = item.followId
}
// 取消跟随
root.methods.delFollow = function (){
  this.delFollowOpen = true
}
// 关闭取消跟随弹窗
root.methods.delFollowClose = function () {
  this.delFollowOpen = false
}
// 点击修改跟单
root.methods.modifyDocumentary = function (item) {
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

  if (this.fromName != 'mobileFollowTrade') {
    this.$router.go(-3)
    console.info('LLLLLLLLLLLLLLLLLLL')
    return
  }
   this.$router.go(-1)
    console.info('ssssssssssss')
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
