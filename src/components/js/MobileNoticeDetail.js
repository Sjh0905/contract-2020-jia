const root = {}

root.name = 'MobileNoticeDetail'


root.data = function () {
  return {
    loading: true, // 加载中

    canSend: true, // 是否可以发送ajax

    noticeInfo: {}, // 获取公告详情内容
    isApp:false,
    isIOS:false
  }
}

root.created = function () {
  this.changeWindow()
  this.$store.commit('changeMobileHeaderTitle', '公告详情');
  this.getNoticeInfo();
  // 关闭公告小红点
  this.$store.commit('changeNoticeRedPoint',false);
}

root.computed = {}

// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}

root.methods = {}

// 判断路由是否为app
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

root.methods.changeWindow = function () {
  if(this.isMobile === true){
    return
  }
  let id = this.$route.query.id
  console.log('id',id)
  this.$router.push({name: 'noticeDetail',query:{id: id}})
}

root.methods.getNoticeInfo = function() {
  let id = this.$route.query.id
  if(this.canSend === false){
    return
  }

  this.canSend = false;

  let params = {
    "noticeId": id,
  }

  this.$http.send('MOBILE_POST_NOTICE_DETAIL', {
    bind: this,
    params: params,
    callBack: this.re_getNoticeInfo,
    errorHandler: this.error_getNoticeInfo
  })
}

root.methods.re_getNoticeInfo = function(data) {
  // console.log(data)
  this.setNoticeRedPoint()
  this.loading = false;
  this.noticeInfo = data;
  this.$refs.noticeInfoContent.innerHTML = data.content;

}

root.methods.error_getNoticeInfo = function(err) {
  console.log(err)
}

// 已看过公告，去除小红点
root.methods.setNoticeRedPoint = function () {
  this.$http.send('GET_HAVE_READ_NOTICE', {
    bind: this,
    params: {
      languageId: 1,
    },
    callBack: this.re_setNoticeRedPoint,
    errorHandler: this.error_setNoticeRedPoint
  })
}

root.methods.re_setNoticeRedPoint = function (data) {
  console.log('关掉小红点获取data',data)
  this.$store.commit('changeNoticeRedPoint',false);
}

root.methods.error_setNoticeRedPoint = function (err) {
  console.log('关掉小红点获取err',err)
}

export default root
