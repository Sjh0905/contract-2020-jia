const root = {}
root.name = 'InvitOpenContract'
/*------------------------------ 组件 ------------------------------*/
root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    invitCodeInput:'',
    isSelect: 1,
    name_0:'',
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  if (this.$route.query.uid) {
    this.invitCodeInput = this.$route.query.uid
  }
  this.isFirstVisit()
}
root.mounted = function () {
  // let isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;
  // if (isAndroid){
  //   var win_h = document.documentElement.clientHeight,
  //     that = this
  //   window.addEventListener('resize', function () {
  //     if(document.documentElement.clientHeight < win_h){
  //       that.footer = false		// 控制隐藏
  //     }else{
  //       that.footer = true			// 控制显示
  //     }
  //   });
  // }
}
root.beforeDestroy = function () {
  // window.removeEventListener("resize")
}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
// 用户id，判断是否登录
root.computed.userId = function () {
  return this.$store.state.authState.userId
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
// 开通合约账户
root.methods.openContract = function () {
  if(this.isSelect) return
  if(!this.$globalFunc.testNumber(this.invitCodeInput)){
    this.name_0 = '请输入正确的邀请码'
    return
  }
  this.$router.push('/index/MobileTradingHall')
}
// 登录并开通
root.methods.goToLogin = function () {
  if(this.isSelect) return
  if(!this.$globalFunc.testNumber(this.invitCodeInput)){
    this.name_0 = '请输入正确的邀请码'
    return
  }
  if(!this.invitCodeInput){
    this.name_0 = '请输入邀请码'
    return
  }
  window.location.replace(this.$store.state.contract_url + 'index/sign/login?type=contract&uid='+this.$route.query.uid);
  // console.info('登录并开通')
}
// 注册并开通
root.methods.goToRegister = function () {
  if(this.isSelect) return
  if(!this.$globalFunc.testNumber(this.invitCodeInput)){
    this.name_0 = '请输入正确的邀请码'
    return
  }
  if(!this.invitCodeInput){
    this.name_0 = '请输入邀请码'
    return
  }
  window.location.replace(this.$store.state.contract_url + 'index/register?type=contract&uid='+this.$route.query.uid);
  // console.info('注册并开通')
}
// 改变输入框的选择状态
root.methods.changeSelect = function (type) {
  this.isSelect = type
}
// 关闭后跳转首页
root.methods.contractOpen = function () {
  window.location.replace(this.$store.state.contract_url + 'index/newH5homePage');
}
// 第一次进入是否弹窗
root.methods.isFirstVisit = function () {
  // this.$http.send('POST_MANAGE_TIME', {
  this.$http.send('POST_MANAGE_API',{
    bind: this,
    callBack: this.re_isFirstVisit
  })
}
root.methods.re_isFirstVisit = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  // if (data.code == 1000) {
  //   this.$router.push({'path': '/index/contractRiskWarning'})
  // }
  if(data.code != 1000){
    this.$router.push({'path': '/index/mobileTradingHall'})
  }

  /*//APP测试专用
  setTimeout(()=>{
    this.$router.push({'path': '/index/contractRiskWarning'})
  },5000)*/

  // this.$router.push({'path': '/index/contractRiskWarning'})
  // } else {
  //   this.$router.push({'path':'index/mobileTradingHallDetail'})
  //   // this.$router.push({'path':'/index/contractRiskWarning'})
  // }
}
export default root
