const root = {};

root.name = 'Record';


root.components = {
  'PageBar': resolve => require(['../../vue/BasePageBar'], resolve),
  'Loading': resolve => require(['../../vue/Loading'], resolve),
}

root.data = function () {
  return {
    recordType: 0, // 0是进行中 1是已中奖 2是未中奖

    ingSelectIndex: 1, // 进行中当前页
    ingMaxPage: 1, // 进行中最大数据量
    ingLimit: 10, // 进行中一页查询
    ingInit: false, // 初始化
    ingLoading: true, // 加载中
    h5IngLoading: true, // h5加载中

    winSelectIndex: 1, // 已中奖当前页
    winMaxPage: 1, // 已中奖最大数据量
    winLimit: 10, // 已中奖一页查询
    winInit: false, // 初始化
    winLoading: true, // 加载中
    h5WinLoading: true, // h5加载中

    loseSelectIndex: 1, // 未中奖当前页
    loseMaxPage: 1, // 未中奖最大数据量
    loseLimit: 10, // 未中奖一页查询
    loseInit: false, // 初始化
    loseLoading: true, // 加载中
    h5LoseLoading: true, // h5加载中


    recordList: [[], [], []], // 数据列表，0是进行中，1是已中奖，2是未中奖
    h5RecordList: [[], [], []], // 数据列表，0是进行中，1是已中奖，2是未中奖
    recordChange: false, // 作用是提高反应速度

    showPopupWindow: false, // 显示详情弹窗
    h5ShowPopupWindow: false, // h5显示详情弹窗
    checkItemLoading: true, // 查询中
    checkInfo: {}, // 查询回来的对象

    h5LoadingMore: false, // h5加载更多


  }
}

root.created = function () {
  this.isMobile && window.addEventListener('scroll', this.scrollToEnd)

  this.isMobile && this.$store.commit('changeMobileHeaderTitle', '参与记录');
  // 进行中
  this.postIngRecord()
  // 已中奖
  this.postWinRecord()
  // 未中奖
  this.postLoseRecord()


}
root.beforeDestroy = function () {
  window.removeEventListener('scroll', this.scrollToEnd)
}

root.computed = {}
// 语言
root.computed.lang = function () {
  return this.$store.state.lang
}
// 是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
// 是否登录
root.computed.isLogin = function () {
  return this.$store.state.authMessage && this.$store.state.authMessage.userId || ''
}
// 当前列表
root.computed.currentRecordList = function () {
  let ans = this.recordChange // 作用是提高反应速度
  return this.recordList[this.recordType]
}
// 当前列表长度
root.computed.currentRecordListLength = function () {
  let ans = this.recordChange // 作用是提高反应速度
  return this.currentRecordList.length
}

// h5当前列表长度
root.computed.h5CurrentRecordListLength = function () {
  let ans = this.recordChange // 作用是提高反应速度
  return this.h5CurrentRecordList.length
}

// h5当前列表
root.computed.h5CurrentRecordList = function () {
  let ans = this.recordChange // 作用是提高反应速度
  return this.h5RecordList[this.recordType]
}

// 当前是否加载中
root.computed.loading = function () {
  let ans = false
  switch (this.recordType) {
    case 0:
      ans = this.ingLoading
      break;
    case 1:
      ans = this.winLoading
      break;
    case 2:
      ans = this.loseLoading
      break;
    default:
      ans = this.ingLoading
  }
  return ans
}

// 当前是否加载中
root.computed.h5Loading = function () {
  let ans = false
  switch (this.recordType) {
    case 0:
      ans = this.h5IngLoading
      break;
    case 1:
      ans = this.h5WinLoading
      break;
    case 2:
      ans = this.h5LoseLoading
      break;
    default:
      ans = this.h5IngLoading
  }
  return ans
}


root.watch = {}


root.methods = {}

// 点击切换页签
root.methods.changeTag = function (n) {
  if (parseInt(n) === this.recordType) return
  this.recordType = parseInt(n)
}

// 获取进行中 ticketStatus 3
root.methods.postIngRecord = function () {
  if (!this.isLogin) return
  this.ingLoading = true
  let ticketStatus = 3, offset = (this.ingSelectIndex - 1) * this.ingLimit + 1, limit = this.ingLimit
  let params = {
    ticketStatus: ticketStatus,
    offset: offset,
    limit: limit
  }
  this.$http.send('POST_MY_PREDICT_RECORD', {
    bind: this,
    params: params
  }).then(({data}) => {
    typeof data === 'string' && (data = JSON.parse(data))
    console.warn('获取列表', data)
    this.ingLoading = false
    this.h5IngLoading = false
    this.h5LoadingMore = false
    this.recordChange = !this.recordChange

    this.ingMaxPage = data.dataMap && Math.ceil(data.dataMap.totalNumber / this.ingLimit) || 1
    this.recordList[0] = data.dataMap && data.dataMap.predictRecordList || []


    if (this.isMobile) {
      data.dataMap && data.dataMap.predictRecordList && this.h5RecordList[0].push(...data.dataMap.predictRecordList)
    }

  }).catch(e => {
    console.warn('获取列表出错', e)
  })
}

// 获取已中奖 ticketStatus 5
root.methods.postWinRecord = function () {
  if (!this.isLogin) return
  this.winLoading = true
  let ticketStatus = 5, offset = (this.winSelectIndex - 1) * this.winLimit + 1, limit = this.winLimit
  let params = {
    ticketStatus: ticketStatus,
    offset: offset,
    limit: limit
  }
  this.$http.send('POST_MY_PREDICT_RECORD', {
    bind: this,
    params: params
  }).then(({data}) => {
    typeof data === 'string' && (data = JSON.parse(data))
    console.warn('获取列表', data)
    this.winLoading = false
    this.h5WinLoading = false
    this.h5LoadingMore = false

    this.recordChange = !this.recordChange

    this.winMaxPage = data.dataMap && Math.ceil(data.dataMap.totalNumber / this.winLimit) || 1
    this.recordList[1] = data.dataMap && data.dataMap.predictRecordList || []

    if (this.isMobile) {
      data.dataMap && data.dataMap.predictRecordList && this.h5RecordList[1].push(...data.dataMap.predictRecordList)
    }

  }).catch(e => {
    console.warn('获取列表出错', e)
  })
}

// 获取未中奖 ticketStatus 6
root.methods.postLoseRecord = function () {
  if (!this.isLogin) return
  this.loseLoading = true
  let ticketStatus = 6, offset = (this.loseSelectIndex - 1) * this.loseLimit + 1, limit = this.loseLimit
  let params = {
    ticketStatus: ticketStatus,
    offset: offset,
    limit: limit
  }
  this.$http.send('POST_MY_PREDICT_RECORD', {
    bind: this,
    params: params
  }).then(({data}) => {
    typeof data === 'string' && (data = JSON.parse(data))
    console.warn('获取列表', data)
    this.loseLoading = false
    this.h5LoseLoading = false
    this.h5LoadingMore = false
    this.recordChange = !this.recordChange


    this.loseMaxPage = data.dataMap && Math.ceil(data.dataMap.totalNumber / this.loseLimit) || 1
    this.recordList[2] = data.dataMap && data.dataMap.predictRecordList || []

    if (this.isMobile) {
      data.dataMap && data.dataMap.predictRecordList && this.h5RecordList[2].push(...data.dataMap.predictRecordList)
    }

  }).catch(e => {
    console.warn('获取列表出错', e)
  })
}

// 点击查看
root.methods.clickToCheckDetail = function (item) {
  this.showPopupWindow = true
  this.checkItemLoading = true
  this.postDetail(item)
}
// h5点击查看
root.methods.h5ClickToCheckDetail = function (item) {
  this.h5ShowPopupWindow = true
  this.checkItemLoading = true
  this.postDetail(item)
}

// 查看详情
root.methods.postDetail = function (item) {
  let ticketStatus = 3
  switch (this.recordType) {
    case 0:
      ticketStatus = 3
      break;
    case 1:
      ticketStatus = 5
      break;
    case 2:
      ticketStatus = 6
      break;
    default:
      ticketStatus = 3
  }
  let params = {
    projectId: item.projectId,
    periodNumber: item.periodNumber,
    participateTime: item.participateTime,
    ticketStatus: ticketStatus
  }
  this.$http.send('POST_MY_PREDICT_RECORD_DETAIL', {
    bind: this,
    params: params
  })
    .then(({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      // 获取详细数据
      console.warn('获取详细数据', data)
      this.h5LoadingMore = false
      this.checkItemLoading = false
      this.checkInfo = data.dataMap && data.dataMap || {}


    })
    .catch(e => {
      console.warn('获取详细数据出错', e)
    })
}


// 进行中点击分页
root.methods.ingChangeIndex = function (n) {
  this.ingSelectIndex = n
  this.postIngRecord()
}

// 已中奖点击分页
root.methods.winChangeIndex = function (n) {
  this.winSelectIndex = n
  this.postWinRecord()
}

// 未中奖点击分页
root.methods.loseChangeIndex = function (n) {
  this.loseSelectIndex = n
  this.postLoseRecord()
}

// h5滑动
root.methods.scrollToEnd = function (event) {
  console.warn('haha')

  if (this.h5LoadingMore) return
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

  if (scrollTop + $(window).height() >= $(document).height()) {
    this.h5LoadingMore = true
    switch (this.recordType) {
      case 0:
        if (this.ingSelectIndex + 1 > this.ingMaxPage) break;
        this.ingSelectIndex++
        this.postIngRecord()
        break;
      case 1:
        if (this.winSelectIndex + 1 > this.winMaxPage) break;
        this.winSelectIndex++
        this.postWinRecord()
        break;
      case 2:
        if (this.loseSelectIndex + 1 > this.loseMaxPage) break;
        this.loseSelectIndex++
        this.postLoseRecord()
        break;
      default:
        if (this.ingSelectIndex + 1 > this.ingMaxPage) break;
        this.ingSelectIndex++
        this.postIngRecord()
    }
  }
}

// 关闭弹窗
root.methods.closePopupWindow = function () {
  this.showPopupWindow = false
}
// h5的关闭弹窗
root.methods.closeH5PopupWindow = function () {
  this.h5ShowPopupWindow = false
}

// 修改显示规则
root.methods.changePredictNumber = function (arr) {
  if (!Array.isArray(arr)) return ''
  let str = this.$t('comma')
  return arr.filter(v => typeof v !== 'null').join(str)
}


// 格式化时间
root.methods.formatDateUtils = function (time, type = 'YYYY-MM-DD hh:mm:ss') {
  return this.$globalFunc.formatDateUitl(time, type)
}


export default root;
