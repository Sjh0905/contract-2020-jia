const root = {}
root.name = 'OverviewOfAssets'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupT': resolve => require(['../vue/PopupT'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading: false,
    // 内部划转页面弹窗
    popWindowOpen1:false,
    bibiAccount:'币币账户',
    account:'我的钱包'

  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {}

root.mounted = function () {}

root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 当前语言
root.computed.lang = function () {
  return this.$store.state.lang;
}

/*------------------------------ 观察 -------------------------------*/
root.watch = {}

/*------------------------------ 方法 -------------------------------*/
root.methods = {}

root.methods.openTransfer = function () {
  this.popWindowOpen1 = true
}

// 划转输入框交换位置
root.methods.changeAccount = function () {
  let empty = ''
  empty = this.bibiAccount
  this.bibiAccount = this.account
  this.account = empty
}

root.methods.popWindowClose1 = function () {
  this.popWindowOpen1 = false
  // this.click_rel_em()
}

root.methods.click_rel_em = function () {
  this.popWindowOpen1 = false
}
root.methods.commit = function () {
  this.popWindowOpen1 = false
}


export default root
