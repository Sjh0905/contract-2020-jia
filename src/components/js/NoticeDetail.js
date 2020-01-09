const root = {}
root.name = 'NoticeDetail'

/*---------------------- 组件 -----------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}
/*---------------------- data -----------------------*/
root.data = function () {
  return {
    loading: true, //加载中
    noticeDetail: {}
  }
}
/*---------------------- 生命周期 -----------------------*/
root.created = function () {
  this.changeWindow()
  // 如果没有通过query传id，则退回去
  if (!this.$route.query.id) {
    this.$router.push({name: 'noticeCenter'})
  }
  this.getNoticeDetail()
  // 关闭公告小红点
  this.$store.commit('changeNoticeRedPoint',false);
  // console.log(this.noticeDetail,'heiheihei')
  // console.log(this.$route)
}
/*---------------------- 计算 -----------------------*/
root.computed = {}

// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}

// 语言选项
root.computed.languageId = function () {
  if (this.$store.state.lang === 'CH') return 1
  if (this.$store.state.lang === 'EN') return 2
  if (this.$store.state.lang === 'CA') return 3
  return 1
}
/*---------------------- 观察 -----------------------*/
root.watch = {}
/*---------------------- 方法 -----------------------*/
root.methods = {}
root.methods.changeWindow = function () {
  if(this.isMobile === false){
    return
  }
  let id = this.$route.query.id
  // console.log('id',id)
  this.$router.push({name: 'mobileNoticeDetail',query:{id: id}})
}

// 获取公告详情
root.methods.getNoticeDetail = function () {
  this.$http.send('POST_NOTICE_DETAIL', {
    bind: this,
    params: {
      noticeId: this.$route.query.id
    },
    callBack: this.re_getNoticeDetail,
    errorHandler: this.error_getNoticeDetail,
  })
}
// 获取公告详情回调
root.methods.re_getNoticeDetail = function (data) {
  // console.warn('获取公告!!!', data)
  // typeof data === 'string' && (data = JSON.parse(data))
  this.noticeDetail = data
  this.$refs.articleDetail.innerHTML = data.content
  // console.warn('this is ref',this.$refs)
  this.setNoticeRedPoint()
  this.loading = false
}
// 获取公告详情报错
root.methods.error_getNoticeDetail = function (err) {
  // console.warn('获取公告详情报错', err)
}

// 已看过公告，去除小红点
root.methods.setNoticeRedPoint = function () {
  this.$http.send('GET_HAVE_READ_NOTICE', {
    bind: this,
    params: {
      languageId: this.languageId,
    },
    callBack: this.re_setNoticeRedPoint,
    errorHandler: this.error_setNoticeRedPoint
  })
}

root.methods.re_setNoticeRedPoint = function (data) {
  // console.log('关掉小红点获取data',data)
  this.$store.commit('changeNoticeRedPoint',false);
}

root.methods.error_setNoticeRedPoint = function (err) {
  // console.log('关掉小红点获取err',err)
}

// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD')
}

root.methods.formatDateUitll = function(time) {
  return this.$globalFunc.formatDateUitl(time, 'hh:mm:ss')
}
// 回到公告中心
root.methods.goBack = function () {
  this.$router.push({name: 'noticeCenter'})
}

export default root
