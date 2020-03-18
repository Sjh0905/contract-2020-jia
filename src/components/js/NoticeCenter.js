const root = {}

root.name = 'NoticeCenter'
/*---------------------- 组件 -----------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}

/*---------------------- data -----------------------*/
root.data = function () {
  return {
    noticeList: [], //公告列表
    offset: 0,//从第几个开始
    maxResults: 10, //请求个数

    // noticeDetail: {},

    loading: true, //加载中


    loadingMore: true,//加载更多
    loadingMoreIng: false,//加载更多中


  }
}

/*---------------------- 生命周期 -----------------------*/
root.created = function () {
  this.getNoticeList()
  // 关闭公告小红点
  this.$store.commit('changeNoticeRedPoint',false);

  this.$eventBus.listen(this, 'GET_NOTICE_LIST', this.getNoticeList);
  console.log('this.$route生命周期NoticeCenter=======',this.$route.name)
}

/*---------------------- 计算 -----------------------*/
root.computed = {}
// 语言
root.computed.lang = function () {
  return this.$store.state.lang
}
// 语言选项
root.computed.languageId = function () {
  if (this.$store.state.lang === 'CH') return 1
  if (this.$store.state.lang === 'EN') return 2
  if (this.$store.state.lang === 'CA') return 3
  return 1
}
// 计算后的公告列表
root.computed.computedNoticeList = function () {
  return this.noticeList
}

root.computed.routeId = function(){
  return this.$route.query.id
}

/*---------------------- 观察 -----------------------*/
root.watch = {}
// 如果切换语言，重新请求
root.watch.lang = function (oldVal, newVal) {
  if (oldVal !== newVal) {
    this.noticeList = []
    this.offset = 0
    this.loadingMore = true
    this.loading = true
    this.getNoticeList()

  }
}


/*---------------------- 方法 -----------------------*/
root.methods = {}

// 获取公告列表
root.methods.getNoticeList = function (id) {
  if(id >= 0){
    this.noticeList = []
  }
  this.$http.send('POST_NOTICE_LIST', {
    bind: this,
    params: {
      offset: this.offset,
      maxResults: this.maxResults,
      languageId: this.languageId,
      columnId:this.$route.query.columnId || id
    },
    callBack: this.re_getNoticeList,
    errorHandler: this.error_getNoticeList
  })
}
// 获取公告列表回调
root.methods.re_getNoticeList = function (data) {
  console.log(data)
  typeof data === 'string' && (data = JSON.parse(data))
  // if(this.$route.query.columnId != '0') return

  if(this.loading) {
    this.setNoticeRedPoint()
  }

  // console.warn('this is data', data)
  this.noticeList.push(...data)
  // console.warn('this is noticeList', this.noticeList)
  // 关闭加载更多
  if (data.length < this.maxResults) {
    this.loadingMore = false
  }

  // 加载更多中
  this.loadingMoreIng = false
  this.loading = false


}
// 获取公告列表出错
root.methods.error_getNoticeList = function (err) {
  // console.warn('获取公告列表出错', err)
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

// 加载更多
root.methods.clickToLoadingMore = function () {
  this.offset = this.offset + this.maxResults
  this.loadingMoreIng = true
  this.getNoticeList()
}

// 点击详情
root.methods.clickToDetail = function (id) {
  this.$router.push({name: 'noticeDetail', query: {id: id}})
  // console.log(this.routeId)
  // console.log(id)
}

// // 格式化时间
// root.methods.formatDateUitl = function (time) {
//   return this.$globalFunc.formatDateUitl(time, 'MM-DD')
// }

// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD')
}

root.methods.formatDateUitll = function(time) {
  return this.$globalFunc.formatDateUitl(time, 'hh:mm:ss')
}

// 标题最多显示40个字符
root.methods.maxTitleLength = function (src) {
  let ans = src
  if (src.length > 40) {
    ans = src.slice(0, 40) + '...'
  }
  return ans
}

export default root
