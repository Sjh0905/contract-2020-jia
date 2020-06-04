const root = {};

root.name = 'MobileHeatList';

root.components = {
  // 'Loading': resolve => require(['../../vue/Loading'], resolve),
}

root.data = function () {
  return {
    loading: false,
    dataList: [],
    isApp:false,
    isIOS:false
  }
}

root.created = function () {
  this.isIOSQuery()
  this.getInitPage()
}

root.computed = {};

root.watch = {};


root.methods = {};


root.methods.ReturnToActivePage = function () {
  this.$router.push('/index/newH5homePage')
}


root.methods.getInitPage = function () {
  this.$http.send('', {
    bind: this,
    params: {

    },
    callBack: this.re_getInitPage
  })
}

root.methods.re_getInitPage = function (res) {

  typeof(res) == 'string' && (res = JSON.parse(res));
}

// 判断是否是ios打开
root.methods.isIOSQuery = function () {
  if(this.$route.query.isIOS) {
    this.isIOS = true
  } else {
    this.isIOS = false
  }
}

export default root;
