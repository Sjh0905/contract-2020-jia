const root = {}

root.name = 'PersonalCenter'

root.components = {
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
}

root.data = function () {
  return {
    showSuperBee: false
  }
}
root.created = function () {
  // 获取是否是超级为蜜
  // this.getSuperBeeInfo()
  console.log('this is my userId',this.centerUid)
}


root.computed = {}


// 是否登录
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
// userID
root.computed.centerUid = function () {
  return this.$store.state.authMessage.userId
}

root.methods = {}
// 获取是否是超级为蜜
root.methods.getSuperBeeInfo = function () {
  this.$http.send('GET_SUPER_BEE_STATE', {
    bind: this
  }).then(({data}) => {
    typeof data === 'string' && (data = JSON.parse(data))
    console.warn('获取为蜜状态', data)
    this.showSuperBee = data.dataMap && data.dataMap.isSuperBee || false
  }).catch(e => {
    // console.warn('获取为蜜状态失败', e)
  })
}

export default root
