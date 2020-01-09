const root = {}
root.name = 'SuperBeeIntroduction'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading.vue'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    introductionLoading: true,
    info: {},
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.initData()
}
root.mounted = function () {
}
root.beforeDestroy = function () {
}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
root.computed.lang = function () {
  return this.$store.state.lang || 'CH'
}
root.computed.symbol = function () {
  return this.$store.state.symbol
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
root.watch.symbol = function (newValue, oldValue) {
  if (newValue === oldValue) return
  this.introductionLoading = true
  this.initData()
}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
// 初始化资料请求
root.methods.initData = function () {
  let params = {}
  switch (this.lang) {
    case 'CA':
      params.languageId = 3
      break;
    case 'EN':
      params.languageId = 2
      break;
    case 'CH':
      params.languageId = 1
      break;
    default:
      params.languageId = 3
  }
  params.currency = this.symbol
  this.$http.send('GET_SUPER_BEE_INTRODUCTION', {
    bind: this,
    params: params
  }).then(({data}) => {
    typeof data === 'string' && (data = JSON.parse(data))
    this.introductionLoading = false
    console.warn('获取为蜜简介', data)
    this.info = data
  }).catch(e => {
    console.warn('获取为蜜简介失败')
  })
}


export default root
