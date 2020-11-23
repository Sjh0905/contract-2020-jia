import logo from '../../assets/qrcode_icon_logo.png'
const root = {}
root.name = "IndexFooter"


root.data = function () {
  return {
  	logo: logo,
    size: 97,
    bgColor: '#fff',
    fgColor: '#000',
    value: '',


  }
}

root.components = {
	'Qrcode': resolve => require(['qrcode-vue'], resolve),
}

root.created = function () {

}

root.mounted = function () {
  this.value = this.staticUrl + '/AppDownload/'
  this.size = 97 /  window.devicePixelRatio

  // 默认跳至顶部
  this.$router.afterEach((to, from, next) => {
    window.scrollTo(0, 0)
  })

}

root.computed = {}

root.computed.lang = function () {
  // 返回语言
  return this.$store.state.lang
}

root.computed.langNum = function () {

  if (this.lang === 'CH') {
    this.jttext = '简体中文';
    return 1
  }
  if (this.lang === 'CHT') {
    this.jttext = '繁体中文';
    return 2
  }
  if (this.lang === 'CA') {
    this.jttext = 'English';
    return 3
  }
  return 1
}

root.computed.staticUrl = function () {
  return this.$store.state.static_url
}

// 是否登录
root.computed.isLogin = function () {
  if (this.$store.state.authMessage.userId !== '') return true
  return false
}

// 是否是加入我们页面
root.computed.isJoinus = function () {
  console.log("joinus-qqqqqqqqqqq---------"+this.$store.state.joinus);
  return this.$store.state.joinus
}

root.methods = {}

root.methods.tiaoz = function (num) {
  if(num == 1){
    //跳转到注册页面
    this.$router.push({name: 'register'})
  }else if(num == 2){
    //跳转到交易大厅页面
    this.$router.push({name: 'tradingHall', params: {symbol: this.$store.state.symbol}})
  }

}

root.methods.viewpdf = function () {
  window.open("https://ziniu.oss-cn-beijing.aliyuncs.com/Introduction.pdf");
}

root.methods.goToNoticeCenter = function (id) {
  // if(this.$route.name  == 'notice') {
  //   this.$eventBus.notify({key: 'GET_NOTICE_LIST'},id);
  // }
  window.location.replace(this.$store.state.contract_url +'index/notice?columnId=3')
  // this.$router.push({name: 'notice', query: {columnId: id}})
}
// 帮助中心
root.methods.goToNoticeHelp = function () {
  window.location.replace(this.$store.state.contract_url +'index/notice?columnId=1')
}
// 帮助中心
root.methods.goToNoticeGuide = function () {
  window.location.replace(this.$store.state.contract_url +'index/notice?columnId=2')
}
// 帮助中心
root.methods.goToNoticeNotice = function () {
  window.location.replace(this.$store.state.contract_url +'index/notice?columnId=0')
}
export default root
