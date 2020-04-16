const root = {}
root.name = 'MobileAssetWithdrawRecordDetail'

import Clipboard from "clipboard";

root.props = {}


root.data = function () {
  return {
    // toast窗口是否显示
    toastWindowFlag: false,

    // 弹窗
    popOpen: false,
    popType: 0,
    popText: '系统繁忙',

    // ajax请求撤销
    ajaxCancelFlag: false,

  }
}

root.components = {
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}

root.created = function () {
  // this.$store.commit('changeMobileHeaderTitle', this.$store.state.mobileRechargeRecordData.currency + '提现详情')
  if(!this.$store.state.mobileRechargeRecordData.currency) {
    this.$router.push({name: 'MobileAssetRechargeAndWithdrawRecord'})
  }
}

root.computed = {}
root.computed.rechargeDetailData = function () {
  return this.$store.state.mobileRechargeRecordData
}

root.methods = {};

root.methods.cancelSubmit = function () {
  this.toastWindowFlag = true
  // console.log(this.rechargeDetailData)
}

root.methods.yesClick = function () {
  if (this.ajaxCancelFlag === true) {
    return
  }
  this.$http.send('POST_CANCEL_WITHDRAWALS', {
    bind: this,
    params: {
      withdrawRequestId: this.rechargeDetailData.id
    },
    callBack: this.re_confirmCancel,
    errorHandler: this.error_confirmCancel,
  })
  this.ajaxCancelFlag = true
}

// 点击撤销返回
root.methods.re_confirmCancel = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.ajaxCancelFlag = false
  if (data.errorCode) {
    if (data.errorCode === 1) {
      this.toastWindowFlag = false
      this.popText = '用户未登录'
      this.popType = 0
      this.popOpen = true
    }
    if (data.errorCode === 2) {
      this.toastWindowFlag = false
      this.popText = '找不到对应记录'
      this.popType = 0
      this.popOpen = true
    }
    if (data.errorCode === 3) {
      this.toastWindowFlag = false
      this.popText = '当前状态不可撤销'
      this.popType = 0
      this.popOpen = true
    }
    return
  }
  this.toastWindowFlag = false
  this.popText = '撤单成功'
  this.popType = 1
  this.popOpen = true

  setTimeout(() => {
    this.$router.push({name: 'MobileAssetRechargeAndWithdrawRecord', query: {id: 2}})
  }, 1000)
}

// 点击撤销错误
root.methods.error_confirmCancel = function (err) {
  console.warn('撤单出错', err)
  this.ajaxCancelFlag = false
  this.toastWindowFlag = false
  this.popText = '系统异常'
  this.popType = 0
  this.popOpen = true
}


root.methods.closeClick = function () {
  this.toastWindowFlag = false
}

// 点击检查按钮
root.methods.jumpToCheckAddress = function (item) {
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

// 点击复制按钮
root.methods.copyValue = function () {
  let copyBtn = new Clipboard('.container-box-copy-btn');
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


// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}

export default root
