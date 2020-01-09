const root = {}
root.name = 'PersonalCenterSecurityLog'

/*------------------------ data --------------------------*/
root.data = function () {
  return {
    loading: false,


    offset: 0, //
    limit: 15,

    logRecord: [], //记录

    loadingMoreShow: true, //是否显示加载更多
    loadingMoreIng: false, //是否正在加载更多

  }
}


/*------------------------ 组件 --------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PageBar': resolve => require(['../vue/BasePageBar'], resolve),
}


/*------------------------ 生命周期 --------------------------*/
root.created = function () {
  this.getLogRecord()
}

/*------------------------ 计算 --------------------------*/
root.computed = {}


/*------------------------ 方法 --------------------------*/
root.methods = {}

// 获取安全日志记录
root.methods.getLogRecord = function () {
  this.$http.send('POST_LOG_RECORD', {
    bind: this,
    params: {
      offset: this.offset,
      maxResults: this.limit,
    },
    callBack: this.re_getLogRecord,
    errorHandler: this.error_getLogRecord,
  })
}


// 获取安全日志记录回调
root.methods.re_getLogRecord = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.warn('获取安全日志记录', data)

  this.logRecord.push(...data.dataMap.loginRecords)


  if (data.dataMap.loginRecords.length < this.limit) {
    this.loadingMoreShow = false
  }


  this.offset = this.offset + this.limit

  this.loading = false
  this.loadingMoreIng = false
}
// 获取安全日志记录出错
root.methods.error_getLogRecord = function (err) {
  console.warn('安全日志记录出错', err)
}

// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD hh:mm:ss')
}

// 加载更多
root.methods.clickToLoadMore = function () {
  this.loadingMoreIng = true
  this.getLogRecord()
}

export default root
