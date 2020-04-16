const root = {}
root.name = 'MobileAssetRechargeRecordDetail'

import Clipboard from "clipboard";

root.props = {}


root.data = function () {
  return {
    // 弹窗
    popOpen: false,
    popType: 0,
    popText: '系统繁忙',


  }
}

root.components = {
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}


root.created = function () {
  this.$store.commit('changeMobileHeaderTitle', this.$store.state.mobileRechargeRecordData.currency + '充值详情')

  if(!this.$store.state.mobileRechargeRecordData.currency) {
    this.$router.push({name: 'MobileAssetRechargeAndWithdrawRecord'})
  }
}

root.mounted = function () {
  // var that = this
  // this.btn = new Clipboard('.container-box-copy-btn');
  // this.btn.on('success', function (e) {
  //   console.info('Text:', e.text);
  //   e.clearSelection();
  //   console.log('成功')
  //
  //   that.popOpen = true
  //   that.popType = 1
  //   that.popText = '复制成功'
  //
  // });
  // this.btn.on('error', function (e) {
  //   console.log('失败')
  //   that.popOpen = true
  //   that.popType = 0
  //   that.popText = '复制失败'
  // });
}
root.beforeDestroy = function () {
  // this.btn && this.btn.off('success')
  // this.btn && this.btn.off('error')
}


root.computed = {}
root.computed.rechargeDetailData = function () {
  return this.$store.state.mobileRechargeRecordData
}


root.methods = {};


// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}

// 点击检查按钮
root.methods.jumpToCheckAddress = function (item) {


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

  if (item.currency === 'TRX' || (currencyObj && currencyObj.addressAliasTo === 'TRX')) {
    window && window.open(`https://trx.tokenview.com/cn/tx/${item.uniqueId}`)
    return
  }


  window && window.open(`https://blockchain.info/zh-cn/tx/${item.uniqueId}`)


  // if (this.rechargeDetailData.currency === 'BTC') {
  //   window && window.open(`https://blockchain.info/block/${item.uniqueId}`)
  //   return
  // }
  // window && window.open(`https://etherscan.io/tx/${item.uniqueId}`)

}


// 状态
root.methods.state = function (item) {

  let msg = ''

  switch (item.status) {
    case 'PENDING':
      msg = '等待区块确认' + `(${item.confirms}/${item.minimumConfirms})`
      break;
    case 'DEPOSITED':
      msg = '充值成功'
      break;
    case 'CANCELLED':
      msg = '废弃区块'
      break;
    case 'WAITING_FOR_APPROVAL':
      msg = '等待审核'
      break;
    case 'DENIED':
      msg = '审核未通过'
      break;
    default:
      msg = '---'
  }

  return msg
}


// 点击复制按钮
root.methods.copyValue = function () {
  let copyBtn = new Clipboard('.container-box-copy-btn');
  let that = this
  copyBtn.on('success', function (e) {
    console.log(e)
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

// 保留小数点后8位
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}



export default root
