const root = {}
root.name = 'TransferRecord'

/*-------------------------- components begin ------------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}

/*-------------------------- data begin ------------------------------*/

root.data = function () {
  return {
    loading: true,

    limit: 10,
    limitNum: 10,

    transferLists: [],
    records:[],

    loadingMoreShow: true,
    loadingMoreShowing: false,

    popType: 0,
    popText: '',
    popOpen: false
  }
}

/*-------------------------- 计算 begin------------------------------*/
root.computed = {}

root.computed.computedTransferLists = function () {
  return []
}


/*-------------------------- 生命周期 begin------------------------------*/


root.created = function () {
  // this.getTransferList()
}


/*-------------------------- 方法 begin------------------------------*/
root.methods = {}
// 获取转账记录
root.methods.getTransferList = function (currency) {
  if (currency) {

  }
  this.$http.send("GET_TRANSFER_LIST", {
    bind: this,
    query: {
      currency: '',
      pageSize: 10
    },
    callBack: this.re_getTransferList,
    errorHandler: this.error_getTransferList
  })
}

// 获取记录返回，类型为{}
root.methods.re_getTransferList = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  // console.warn('获取记录', data)
  this.transferLists = data.dataMap.userTransferRecordList

  if (this.transferLists.length < this.limit) {
    this.loadingMoreShow = false
  }
  this.loadingMoreShowing = false
  this.loading = false
}

// 获取记录出错
root.methods.error_getTransferList = function (err) {
  console.warn("转账获取记录出错！", err)
}

// 点击拷贝
root.methods.clickCopy = function (id) {
  let input = this.$refs[id][0]
  input.select()
  document.execCommand("copy")
  this.popType = 1
  this.popText = this.$t('copyRight')
  this.popOpen = true
}

// 点击查找
root.methods.clickCheck = function (item) {
  let currencyObj = this.$store.state.currency.get(item.currency)

  // 如果是ETH的
  if (item.currency === 'ETH' || (currencyObj && currencyObj.addressAliasTo === 'ETH')) {
    window && window.open(`https://etherscan.io/tx/${item.uniqueId}`)
    return
  }

  if (item.currency === 'ACT' || (currencyObj && currencyObj.addressAliasTo === 'ACT')) {
    window && window.open(`https://browser.achain.com/#/tradeInfo/${item.uniqueId}`)
    return
  }

  if (item.currency === 'EOSFORCEIO' || (currencyObj && currencyObj.addressAliasTo === 'EOSFORCEIO')) {
    window && window.open(`https://explorer.eosforce.io/#/transaction_detail_view/${item.uniqueId}`)
    return
  }

  if (item.currency === 'OMNI' || (currencyObj && currencyObj.addressAliasTo === 'OMNI')) {
    window && window.open(`https://www.omniexplorer.info/tx/${item.uniqueId}`)
    return
  }

  if (item.currency === 'EOSIO' || (currencyObj && currencyObj.addressAliasTo === 'EOSIO')) {
    window && window.open(`https://eosflare.io/tx/${item.uniqueId}`)
    return
  }


  window && window.open(`https://blockchain.info/zh-cn/tx/${item.uniqueId}`)


}

// 状态
root.methods.state = function (item) {

  let msg = ''

  switch (item.status) {
    case 'PENDING':
      msg = this.$t('recharge_status_1') + `(${item.confirms}/${item.minimumConfirms})`
      break;
    case 'DEPOSITED':
      msg = this.$t('recharge_status_2')
      break;
    case 'CANCELLED':
      msg = this.$t('recharge_status_3')
      break;
    case 'WAITING_FOR_APPROVAL':
      msg = this.$t('recharge_status_4')
      break;
    case 'DENIED':
      msg = this.$t('recharge_status_5')
      break;
    default:
      msg = '---'
  }

  return msg

}

root.methods.loadingMore = function () {
  this.limit += this.limitNum
  this.loadingMoreShowing = true
  this.getRecord()
}


root.methods.popClose = function () {
  this.popOpen = false
}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/


export default root

