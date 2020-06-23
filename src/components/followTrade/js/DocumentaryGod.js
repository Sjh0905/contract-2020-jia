const root = {}
root.name = 'mobileDocumentaryGod'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../../vue/PopupWindow'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading:true,
    fixedFollow:1,
    followType:'LOT',
    godHistorList:[],
    godInfo:{},
    followUserList:[],

    // 弹框
    popType: 0,
    popText: '',
    popOpen: false,
    waitTime: 2000,

    fixedAmountLot:'',


    popWindowOpen: false
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  console.info('params: {item:item}',this.$route.query.userId ,this.$route.query.fee)

  this.postBigBrotherHistory()
  this.postFollowUser()
  if(this.$route.query.isApp) {
    // window.postMessage(JSON.stringify({
    //     method: 'setTitle',
    //     parameters: '区块恋' // TODO     这里需要大神的UID，最新方案先不要这段代码了
    //   })
    // );
    window.postMessage(JSON.stringify({
      method: 'setH5Back',
      parameters: {
        canGoH5Back:true
      }
    }))
  }
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
// 切换历史跟单和跟随者
root.methods.toggleType = function (type) {
  this.fixedFollow = type
}
// 返回跟单首页
root.methods.jumpToFollowTrade = function () {
  this.$router.push({name:'mobileFollowTrade'})
}
// 点击跟单
root.methods.jumpToFollowDocumentary = function () {
  this.popWindowOpen = true
  // this.$router.push({name:'mobileMyFollowOrder'})
  // this.$router.push({name:'mobileDocumentary',query:{userId:this.$route.query.userId,fee:this.$route.query.fee,days:this.$route.query.days}})
}
// 关闭跟单弹框
root.methods.popWindowClose= function () {
  this.popWindowOpen = false
}

// 切换固定金额和固定比例
root.methods.fixedType = function (type) {
  this.followType = type
}


//立即跟单postDocumentaryImmediately
root.methods.postDocumentaryImmediately = function () {
  this.follow = false
  let canSend = true
  if (this.followType == 'LOT' && this.fixedAmountLot == '') {
    this.openPop(this.$t('cannotBeEmpty'))
    this.follow = true
    return
  }
  if (!canSend) {
    return
  }

  let params = {
    followId: this.$route.query.userId,
    followType: this.followType ,    //固定金额LOT   固定比例RATE
    val: this.followType == 'LOT' ? this.fixedAmountLot : this.fixedAmountRate,
  }
  this.$http.send('POST_ADDFOLLOWER', {
    bind: this,
    params: params,
    callBack: this.re_postDocumentaryImmediately,
    errorHandler: this.error_postDocumentaryImmediately
  })
}
root.methods.re_postDocumentaryImmediately = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.follow = true
  // this.success = data.data.success
  // console.log("re_postJoinGroup + data=====",data)
  //

  if (data.errorCode == 3) {
    this.openPop(this.$t('canNotFollowMyself'))
    return;
  }
  if (data.errorCode != 0) {
    this.openPop(this.$t('systemError'))
    return;
  }
  if (data.errorCode == 0) {
    this.openPop(this.$t('followSuccess'),1)
    setTimeout(() => {
      this.popWindowOpen = false
      this.postBigBrotherHistory()
      this.postFollowUser()
      this.$route.query.isFollow = true
    }, 1000)
    return;
  }

  // if (data.errorCode) {
  //   if (
  //     data.errorCode == 1 && (this.popText = this.$t('exist')) ||//账户不存在
  //     data.errorCode == 2 && (this.popText = this.$t('资产')) || // 团长剩余比例不足
  //     data.errorCode == 3 && (this.popText = this.$t('modified')) || // 团长职位不能修改
  //     data.errorCode == 4 && (this.popText = this.$t('Wrong')) || // 成员类型有误
  //     data.errorCode == 5 && (this.popText = this.$t('changed')) || // 联席团长职位不可更换
  //     data.errorCode == 6 && (this.popText = this.$t('Setting')) || // 设置比例折扣不能为0
  //     data.errorCode == 400 && (this.popText = this.$t('parameter_error')) //参数有误
  //   ) {
  //     this.popOpen = true
  //     this.popType = 0
  //     setTimeout(() => {
  //       this.popOpen = true
  //     }, 100)
  //     return;
  //   }
  // }



}
root.methods.error_postDocumentaryImmediately = function (err) {
  console.log("this.err=====",err)
}




//大神历史持仓
root.methods.postBigBrotherHistory = function () {
  let params = {
    followId: this.$route.query.userId,
  }
  this.$http.send('POST_BROTHER_ORDER', {
    bind: this,
    params: params,
    callBack: this.re_postBigBrotherHistory,
    errorHandler: this.error_postBigBrotherHistory
  })
}
root.methods.re_postBigBrotherHistory = function (data) {
  console.log("this.res=====",data)
  typeof data === 'string' && (data = JSON.parse(data))
  console.info('data',data)
  this.loading = false
  this.godInfo = data.dataMap.godInfo || {}
  this.godHistorList = data.dataMap.list || []
}
root.methods.error_postBigBrotherHistory = function (err) {
  console.log("this.err=====",err)
}


//大佬跟随者
root.methods.postFollowUser = function () {
  let params = {
    followId: this.$route.query.userId ,
  }
  this.$http.send('POST_FOLLOWUSER', {
    bind: this,
    params: params,
    callBack: this.re_postFollowUser,
    errorHandler: this.error_postFollowUser
  })
}
root.methods.re_postFollowUser = function (data) {
  console.log("this.res=====",data)
  typeof data === 'string' && (data = JSON.parse(data))
  console.info('data',data)
  this.followUserList = data.dataMap.list || []
}
root.methods.error_postFollowUser = function (err) {
  console.log("this.err=====",err)
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



/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/


export default root
