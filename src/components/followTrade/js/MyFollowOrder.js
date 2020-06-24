const root = {}
root.name = 'MyFollowOrder'
/*------------------------------ 组件 ------------------------------*/
root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
  'PopupPrompt': resolve => require(['../../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../../vue/PopupWindow'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    followType:'',
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

    // 信息弹框
    popWindowOpen:false,

    fixedAmountLot:'',//修改输入的固定金额

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

root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}

/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
// 关闭修改策略弹框
root.methods.popWindowClose= function () {
  this.popWindowOpen = false
}
// 打开修改策略弹框
root.methods.openFollowWindow = function (item) {
  this.followId=item.followId
  this.followType = item.followType
  if(item.followType == 'LOT'){
    this.fixedAmountLot = item.lot || '0'
  }
  this.popWindowOpen = true
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

//我的镜像交易
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
// 点击切换自动续费成功
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
    //系统错误
    this.openPop(this.$t('systemError'),0)
    return
  }
  if(data.errorCode == 0){
    this.openPop(this.$t('cancelFollowSuccess'),1)
    this.postMyDocumentary()
  }
  this.delFollowClose()
}
// 取消跟随
root.methods.error_delFollowList = function (err) {
  console.warn('点击切换自动续费', err)
}

// 切换固定金额和固定比例
root.methods.fixedType = function (type) {
  this.followType = type
}

// 确认修改
root.methods.commitModify = function (){
  this.$http.send('POST_UPDATE_RATEORLOT', {
    bind: this,
    params: {
      followId: this.followId,
      followType: this.followType,
      val: this.followType == 'LOT' ? this.fixedAmountLot:this.fixedAmountRate,
    },
    callBack: this.re_commitModify,
    errorHandler: this.error_commitModify
  })
}
root.methods.re_commitModify = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if(data.errorCode == 0) {
    this.openPop(this.$t('updateFollowSuccess'),1)
    this.popWindowClose()
    this.postMyDocumentary()
  }
  if(data.errorCode == 1) {
    this.openPop(this.$t('systemError'),0)
  }
}
root.methods.error_commitModify = function (err) {
  console.log('err======',err)
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

// 鼠标移上去显示开启续费的框
root.methods.closeRenew= function () {
  $(".descript").attr("style","display:none");
}

root.methods.openRenew = function () {
  $(".descript").attr("style","display:block");
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
