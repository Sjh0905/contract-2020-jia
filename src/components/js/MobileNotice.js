const root = {}

root.name = 'MobileNotice'


root.data = function () {
  return {
    loading: true, // 加载中

    canGetMore: false, // 显示获取更多按钮

    noticeList:[], // 存储所有公告列表数据
    offset: 0, // 从多少条开始显示
    maxResults: 10, // 一次获取多少条数据

    canSend: true, // 是否可以发送ajax

  }
}

root.created = function () {
  this.changeWindow()
  this.$store.commit('changeMobileHeaderTitle', '公告中心');
  this.getNoticeList()
  // 关闭公告小红点
  this.$store.commit('changeNoticeRedPoint',false);
}

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}

root.computed = {}

root.computed = {}
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}


root.methods = {}

// 如果用户是复制地址
root.methods.changeWindow = function () {
  if(this.isMobile === true){
    return
  }
  this.$router.push({name: 'noticeCenter'})
}

// 初始获取公告列表
root.methods.getNoticeList = function() {
  if(this.canSend === false){
    return
  }

  this.canSend = false;

  let params = {
    "offset": this.offset,
    "maxResults": this.maxResults,
    // todo h5国际化
    "languageId": 1,
  }

  this.$http.send('MOBILE_POST_NOTICE_LIST', {
    bind: this,
    params: params,
    callBack: this.re_getNoticeList,
    errorHandler: this.error_getNoticeList
  })
}

root.methods.re_getNoticeList = function(data) {
  this.noticeList = this.noticeList.concat(data);
  this.setNoticeRedPoint()
  // console.log('data',this.noticeList);
  if(data.length>=this.maxResults){
    this.canGetMore = true;
  }
  if(data.length<this.maxResults){
    this.canGetMore = false;
  }
  this.offset = this.offset + this.maxResults

  this.loading = false;
  this.canSend = true;
}

root.methods.error_getNoticeList = function(err) {
  // console.log(err);
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

// 获取更多公告列表
root.methods.getMoreNotice = function() {
  if(this.canSend === false){
    return
  }

  this.canSend = false;

  let params = {
    "offset": this.offset,
    "maxResults": this.maxResults,
    // todo h5国际化
    "languageId": 1,
  }

  this.$http.send('MOBILE_POST_NOTICE_LIST', {
    bind: this,
    params: params,
    callBack: this.re_getNoticeList,
    errorHandler: this.error_getNoticeList
  })
}

// 点击公告列表跳转公告详情页
root.methods.noticeToDetail = function(res) {
  // this.$router.push({name: 'mobileNoticeDetail',query: {id: id}})
  // window.open(res)
  // window.location.href=res
  console.log(res)
  this.$router.push({path: '/index/mobileNoticeDetail', query: {id:res}})
}



export default root
