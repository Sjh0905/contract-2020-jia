const root = {}
root.name = 'AssetPageWithdrawalsRecord'

/*--------------------------------- 组件 ----------------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
}

/*--------------------------------- data ----------------------------------*/

root.data = function () {
  return {
    loading: true,
    limit: 10, //一次加载多少条
    limitNum: 10,
    // more: 10,
    loadingMoreShow: true,
    loadingMoreShowing: false,
    records: [],

    popType: 0,
    popText: '',
    popOpen: false,

    cancelId: '',//取消订单的id
    popWindowOpen: false,
    cancelIng: false,

    popWindowState: false, //撤销理由弹窗
    cancelReason: '',//撤销理由

    openAddressFlag : false,
  }
}

/*--------------------------------- 生命周期 ----------------------------------*/

root.created = function () {
  this.getRecord(this.limit)
}

/*--------------------------------- 计算 ----------------------------------*/

root.computed = {}
// 计算后的record
root.computed.computedRecord = function () {
  return this.records
}
// 语言
root.computed.lang = function () {
  return this.$store.state.lang
}

/*--------------------------------- 方法 ----------------------------------*/

root.methods = {}

// 打开地址
root.methods.openAddress = function () {
    if(this.openAddressFlag = true ){
        this.openAddressFlag = false
    }
    this.openAddressFlag = true
}


// 获取记录
root.methods.getRecord = function (limit) {
  this.$http.send("WITHDRAWS_LOG", {
    bind: this,
    params: {
      currency:'',
      limit: limit
    },
    callBack: this.re_getRecord,
    errorHandler: this.error_getRecord
  })
}

// 获取记录返回
root.methods.re_getRecord = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data || !data.dataMap) return
  // console.warn('提现记录获取记录', data)

  this.records = data.dataMap.requests
  console.warn('this is records', this.records)

  this.records.length < this.limit && (this.loadingMoreShow = false)
  this.records.length >= this.limit && (this.loadingMoreShow = true)
  this.loadingMoreShowing = false
  this.loading = false
}
// 获取记录出错
root.methods.error_getRecord = function (err) {
  // console.warn("获取记录出错！", err)
}

// 加载更多
root.methods.loadingMore = function () {
  this.limit += this.limitNum
  this.loadingMoreShowing = true
  this.getRecord(this.limit)
}

// 状态
root.methods.computedState = function (state) {
  if (state === 'SUBMITTED') return this.$t('state_7')
  if (state === 'WAITING_FOR_APPROVAL') return this.$t('state_1')
  if (state === 'WAITING_FOR_WALLET') return this.$t('state_8')
  if (state === 'DENIED') return this.$t('state_3')
  if (state === 'PROCESSING') return this.$t('state_2')
  if (state === 'FAILED') return this.$t('state_4')
  if (state === 'CANCELLED') return this.$t('state_9')
  if (state === 'DONE') return this.$t('state_5')
  return '---'
}

// 是否可撤销
root.methods.canCancel = function (state) {
  if (state === 'SUBMITTED' || state === 'WAITING_FOR_APPROVAL' || state === 'WAITING_FOR_WALLET') return 1
  if (state === 'DENIED' || state === 'FAILED') return 2
  return 0
}

// 点击查看驳回理由
root.methods.clickToWatchReason = function (item) {
  this.lang === 'CH' && (this.cancelReason = item.errorMessage)
  this.lang !== 'CH' && (this.cancelReason = item.errorCode)
  this.popWindowState = true
}

// 点击撤销
root.methods.clickCancel = function (item) {
  this.popWindowOpen = true
  this.cancelId = item.id
}


// 撤销确认
root.methods.confirmCancel = function () {
  this.$http.send('POST_CANCEL_WITHDRAWALS', {
    bind: this,
    params: {
      withdrawRequestId: this.cancelId
    },
    callBack: this.re_confirmCancel,
    errorHandler: this.error_confirmCancel,
  })
  this.cancelIng = true
}

// 点击撤销返回
root.methods.re_confirmCancel = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.warn('撤单返回', data)
  this.cancelIng = false
  if (data.errorCode) {
    if (data.errorCode === 1) {
      this.popWindowOpen = false
      this.popText = '用户未登录'
      this.popType = 0
      this.popOpen = true
      this.getRecord(this.limit)
    }
    if (data.errorCode === 2) {
      this.popWindowOpen = false
      this.popText = '找不到对应记录'
      this.popType = 0
      this.popOpen = true
      this.getRecord(this.limit)
    }
    if (data.errorCode === 3) {
      this.popWindowOpen = false
      this.popText = '当前状态不可撤销'
      this.popType = 0
      this.popOpen = true
      this.getRecord(this.limit)
    }
    return
  }
  this.popWindowOpen = false
  this.popText = this.$t('popText_1')
  this.popType = 1
  this.popOpen = true
  this.getRecord(this.limit)
}

// 点击撤销错误
root.methods.error_confirmCancel = function (err) {
  console.warn('撤单出错', err)
  this.cancelIng = false
  this.popWindowOpen = false
  this.popText = this.$t('popText_2')
  this.popType = 0
  this.popOpen = true
}

// 点击查找
root.methods.clickCheck = function (item) {

  let currencyObj = this.$store.state.currency.get(item.currency)

  // 如果是ETH的
  if (item.currency === 'ETH' || (currencyObj && currencyObj.addressAliasTo === 'ETH')) {
    window && window.open(`https://etherscan.io/tx/${item.tx}`)
    return
  }

  if (item.currency === 'ACT' || (currencyObj && currencyObj.addressAliasTo === 'ACT')) {
    window && window.open(`https://browser.achain.com/#/tradeInfo/${item.tx}`)
    return
  }

  if (item.currency === 'EOSFORCEIO' || (currencyObj && currencyObj.addressAliasTo === 'EOSFORCEIO')) {
    window && window.open(`https://explorer.eosforce.io/#/transaction_detail_view/${item.tx}`)
    return
  }

  if (item.currency === 'OMNI' || (currencyObj && currencyObj.addressAliasTo === 'OMNI')) {
    window && window.open(`https://www.omniexplorer.info/tx/${item.tx}`)
    return
  }

  if (item.currency === 'EOSIO' || (currencyObj && currencyObj.addressAliasTo === 'EOSIO')) {
    window && window.open(`https://eosflare.io/tx/${item.tx}`)
    return
  }

  if (item.currency === 'TRX' || (currencyObj && currencyObj.addressAliasTo === 'TRX')) {
    window && window.open(`https://trx.tokenview.com/cn/tx/${item.tx}`)
    return
  }

  window && window.open(`https://blockchain.info/zh-cn/tx/${item.tx}`)

}

// 点击复制
root.methods.clickCopy = function (id) {
  let input = this.$refs[id][0]
  input.select()
  document.execCommand("copy")

  this.popType = 1
  this.popText = this.$t('copyRight')
  this.popOpen = true
}

// 关闭小框
root.methods.popClose = function () {
  this.popOpen = false
}

// 关闭popWindow
root.methods.closeWindow = function () {
  this.popWindowOpen = false
}

// 关闭撤销理由
root.methods.closeStatePop = function () {
  this.popWindowState = false
}
/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

export default root
