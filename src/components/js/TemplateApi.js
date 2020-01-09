const root = {}

root.components = {
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}

root.name = 'TemplateApi'

root.data = function () {
  return {
    ip: '',
    description: '',
    canTrade: false,
    canWithdraw: false,

    popType: 0,
    popOpen: false,
    popText: '系统繁忙',

    sending: false,

    apiKey: '',
    apiSecret: ''

  }
}


root.methods = {}
root.methods.addApiKey = function () {
  this.$http.send('ADD_API_KEY', {
    bind: this,
    params: {
      ip: this.ip,
      description: this.description,
      canTrade: this.canTrade,
      canWithdraw: this.canWithdraw
    },
    callBack: this.re_addApiKey,
    errorHandler: this.error_addApiKey
  })
  this.sending = true

}


root.methods.re_addApiKey = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))

  this.popText = '添加成功'
  this.popType = 1
  this.popOpen = true

  console.warn('data', data)

  this.apiKey = data.dataMap.apiKey.apiKey
  this.apiSecret = data.dataMap.apiKey.apiSecret

  this.sending = false

}
root.methods.error_addApiKey = function (err) {
  console.warn("出错！", err)
  this.popText = '修改出错'
  this.popType = 0
  this.popOpen = true
  this.sending = false
}

root.methods.popClose = function () {
  this.popOpen = false
}


export default root
