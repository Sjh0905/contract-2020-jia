const root = {}
root.name = 'MobileLockHouseRecord'
/*------------------------------ 组件 ------------------------------*/
root.components = {
 'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    // 选择的是充值记录还是提现记录 1为充值记录 2为提现记录
    openType: 1,
    // 显示loading true为显示loading
    loading: true,
    // 获取多少条消息
    currentLockLimit: 10,
    historyLockLimit: 10,
    limit: 10,
    // 获取的当前record
    currentRecords: [],
    // 是否Record获取ajax结果 默认为false
    ajaxRecordFlag: false,
    // 是否Withdraw获取ajax结果 默认为false
    ajaxWithdrawFlag: false,
    // 是否Record有数据 true为没有数据，显示没有数据
    isRecordFlag: false,

    // 是否第一次请求withdraw
    isFirstGetWithdrawFlag: true,

    // 是否withdraw有数据 true为没有数据，显示没有数据
    isWithdrawFlag: false,
    // 获取的withdraw
    historyRecords: [],

    // 是否显示充值记录加载更多
    isShowGetMoreRecord: true,

    // 是否显示提现记录加载更多
    isShowGetMoreWithdraw: true,


    // 弹窗
    popOpen: false,
    popType: 0,
    popText: '系统繁忙',

    pageSize:30,
    lastId:0
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  // 修改顶部标题
  this.$store.commit('changeMobileHeaderTitle', '充提记录');
  console.log(this.$route)
  // if(this.)
  this.changeOpenTypeQuery()
  // 获取record值
  // this.getRecord()
  // 获取withdraw值
  // this.getWithdraw()
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}

root.computed.computedRecord = function () {
  return this.currentRecords
}

root.computed.computedWithdraw = function () {
  console.log(this.historyRecords)
  return this.historyRecords
}

// 获取userId
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

root.methods.changeOpenTypeQuery = function () {
  // console.log('location',location.search.substr(1).split("=")[1])
  let num = this.$route.query.id || 1
  this.openType = num

  if(num == 1) {
    this.getLockCur()
  }
  if (num == 2){
    this.getLockHistory()
  }
}

// 切换当前锁仓记录和历史锁仓记录头部
root.methods.changeOpenType = function(num){
  this.openType = num
  // console.log('this is store',this.$store.state.mobileHeaderTitle,this.$store.state.currencyChange)

  if(num === 1){
    this.$router.push({'path':'/index/mobileAsset/MobileLockHouseRecord',query:{id:1,name:this.$route.query.name}})
    // this.$store.commit('changeMobileHeaderTitle', '');
    this.getLockCur()
  }

  if(num===2){
    this.$router.push({'path':'/index/mobileAsset/MobileLockHouseRecord',query:{id:2,name:this.$route.query.name}})

    // this.$store.commit('changeMobileHeaderTitle', '');
    // 获取withdraw值
    if(this.isFirstGetWithdrawFlag === true ){
      this.getLockHistory()
    }
    return
  }

}

// 获取当前锁仓记录
root.methods.getLockCur = function () {
  // if (currency) {
  //
  // }
  if (this.ajaxRecordFlag === true || this.isShowGetMoreRecord === false) {
    return
  }
  this.ajaxRecordFlag = true
  // this.loading = true
  this.$http.send("LOCK_ASSET_RECODE", {
    bind: this,
    query: {
      status:'1',
      // currency: '',
      // limit: this.limit
    },
    callBack: this.re_getLockCur,
    errorHandler: this.error_getLockCur
  })
}
// 获取记录返回，类型为{}
root.methods.re_getLockCur = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.ajaxRecordFlag = false
  console.log('充值记录',data)
  if (!data || data.length === 0) {
    // if(this.ajaxRecordFlag === true){
    this.loading = false
    // }
    this.isRecordFlag = true
    return
  }
  // console.log('进入此步')
  if (data.length < this.currentLockLimit){
    this.isShowGetMoreRecord = false
  } else {
    this.currentLockLimit += 10;
  }

  // console.warn('获取记录', data)
  this.currentRecords = data

  // if(this.ajaxRecordFlag === true){
  this.loading = false
  // }
  this.isRecordFlag = false
}
// 获取记录出错
root.methods.error_getLockCur = function (err) {
  this.ajaxRecordFlag = true
  this.isRecordFlag = true
  this.loading = false
  console.warn("充值获取记录出错！", err)
}

// 初始获取withdraw值
root.methods.getLockHistory = function () {
  if(this.ajaxWithdrawFlag === true){
    return;
  }
  this.ajaxWithdrawFlag = true
  // this.loading = true
  this.$http.send("LOCK_ASSET_RECODE", {
    bind: this,
    query: {
      status:'2',
      // currency: '',
      // limit: this.limit
    },
    callBack: this.re_getLockHistory,
    errorHandler: this.error_getLockHistory
  })
}
// 获取记录返回，类型为{}
root.methods.re_getLockHistory = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.log('提现记录',data)
  this.ajaxWithdrawFlag = false
  this.isFirstGetWithdrawFlag = false
  if (!data || data.length === 0) {
    // console.log('data无',data)
    // if(this.ajaxWithdrawFlag === true){
    this.loading = false
    // }
    this.isWithdrawFlag = false
    return
  }

  if (data.length < this.historyLockLimit){
    this.isShowGetMoreWithdraw = false
  } else {
    this.historyLockLimit += 10;
  }

  console.log('data有', data)
  this.historyRecords = data

  // if(this.ajaxWithdrawFlag === true){
  this.loading = false
  // }
  this.isWithdrawFlag = true
}
// 获取记录出错
root.methods.error_getLockHistory = function (err) {
  this.isWithdrawFlag = true
  this.ajaxWithdrawFlag = true
  if(this.ajaxWithdrawFlag === true){
    this.loading = false
  }
}

// 点击跳转当前锁仓详情页
root.methods.toRechargeDetailPath = function (type) {
  console.log(123123123,type)
  this.$store.commit('changeMobileRechargeRecordData',type)
  this.$router.push("/index/mobileAsset/mobileAssetcurLockRecordDetail/")
}
// 点击跳转历史锁仓详情页
root.methods.toWithdrawDetailPath = function (type) {
  this.$store.commit('changeMobileRechargeRecordData',type)
  this.$router.push("/index/mobileAsset/mobileAssetHisLockRecordDetail/")
}

// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}

// 保留小数点后8位
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
export default root
