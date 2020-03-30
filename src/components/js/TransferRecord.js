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
    popOpen: false,

    // 判断收款人和付款人的显示
    Judgment:false  //false为收款人，true为付款人
  }
}

/*-------------------------- 计算 begin------------------------------*/
root.computed = {}

root.computed.computedTransferLists = function () {
  return this.transferLists
}

// 获取userId
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}

/*-------------------------- 生命周期 begin------------------------------*/


root.created = function () {
  this.getTransferList()
}


/*-------------------------- 方法 begin------------------------------*/
root.methods = {}

// 获取转账记录
root.methods.getTransferList = function () {
  // if (currency) {
  // }
  this.$http.send("GET_TRANSFER_LIST", {
    bind: this,
    callBack: this.re_getTransferList,
    errorHandler: this.error_getTransferList
  })
}
// 获取记录返回，类型为{}
root.methods.re_getTransferList = function (data) {
  // data = {
  //   "dataMap": {
  //     "userTransferRecordList": [
  //       {
  //         "amount": 64978565.212093204,
  //         "createdAt": 26874119.996328756,
  //         "currency": "labore veniam amet",
  //         "dateTime": "consectetur reprehende",
  //         "description": "est ipsum",
  //         "fee": -69152500.97831321,
  //         "flowType": "voluptate cillum sunt in dolore",
  //         "fromEmail": "dolor",
  //         "fromUserId": 39938509.49169183,
  //         "id": 44854775.59664419,
  //         "name": "consequat culpa dolor in in",
  //         "status": "amet",
  //         "toEmail": "consectetur",
  //         "toUserId": 82758398.29890534,
  //         "transferId": "sunt",
  //         "updatedAt": -21656862.098530143,
  //         "version": -39525910.375112526
  //       },
  //     ],
  //     "errorCode": "83926916.88406259",
  //     "result": "quis"
  //   }
  // }
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  console.log('获取记录', data)
  this.transferLists = data.dataMap.userTransferRecordList

  this.transferLists.forEach(v=>{
    v.transferId ? (this.Judgment = true) : (this.Judgment = false)
  })

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

// // 判断字段
// root.methods.transferInOrOut = function (item) {
//   console.log(item)
//   item.fromUserId ? (this.Judgment = true):(this.Judgment = false)
//
//   // switch (item.status) {
//   //   case 'PENDING':
//   //     msg = this.$t('recharge_status_1') + `(${item.confirms}/${item.minimumConfirms})`
//   //     break;
//   //   case 'DEPOSITED':
//   //     msg = this.$t('recharge_status_2')
//   //     break;
//   //   case 'CANCELLED':
//   //     msg = this.$t('recharge_status_3')
//   //     break;
//   //   case 'WAITING_FOR_APPROVAL':
//   //     msg = this.$t('recharge_status_4')
//   //     break;
//   //   case 'DENIED':
//   //     msg = this.$t('recharge_status_5')
//   //     break;
//   //   default:
//   //     msg = '---'
//   // }
//
//   // return msg
//
// }


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
  this.getTransferList()
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

