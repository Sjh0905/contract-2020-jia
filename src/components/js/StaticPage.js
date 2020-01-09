const root = {}
root.name = 'StaticPage'

/*------------------------------ 组件 -------------------------------*/

root.components = {
  'IndexHeader': resolve => require(['../vue/IndexHeader'], resolve),
  'IndexFooter': resolve => require(['../vue/IndexFooter'], resolve),
}

root.data = function () {
  return {
    isApp: false,

    isIOS: false,
  }
}

root.created = function () {

  this.isAppQuery()


  this.isIOSQuery()
}

root.methods = {}
// 判断是否是app打开
root.methods.isAppQuery = function (query) {
  if(this.$route.query.isApp) {
    this.isApp = true
  } else {
    this.isApp = false
  }
}


// 判断是否是ios打开
root.methods.isIOSQuery = function () {
  if(this.$route.query.isIOS) {
    this.isIOS = true
  } else {
    this.isIOS = false
  }
}


export default root
