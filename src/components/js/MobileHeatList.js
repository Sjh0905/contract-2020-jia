const root = {};

root.name = 'MobileHeatList';

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}

root.data = function () {
  return {
    loading: true,
    heatList: [],
    isApp:false,
    isIOS:false
  }
}

root.created = function () {
  this.getHeatList()
  this.isIOSQuery()
}

root.computed = {};
// 获取userId
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}

root.watch = {};


root.methods = {};


root.methods.ReturnToActivePage = function () {
  this.$router.push('/index/newH5homePage')
}


root.methods.getHeatList = function () {
  this.$http.send('GET_HEAT_LIST', {
    bind: this,
    urlFragment: this.userId,
    // query:{
    //   gname: this.gname
    // },
    callBack: this.re_getHeatList
  })
}

root.methods.re_getHeatList = function (data) {

  typeof(data) == 'string' && (data = JSON.parse(data));
  console.info('data======sssss',data)
  this.heatList = data.data
  this.loading = false
}

// 判断是否是ios打开
root.methods.isIOSQuery = function () {
  if(this.$route.query.isIOS) {
    this.isIOS = true
  } else {
    this.isIOS = false
  }
}


// 保留小数点后8位
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
export default root;
