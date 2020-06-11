const root = {}

root.name = 'fundAward'

/*-------------------------- components begin ------------------------------*/

root.components = {
  'Loading': resolve => require(['../../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../../vue/PopupPrompt'], resolve),
  // 'BasePageBar': resolve => require(['../vue/BasePageBar'], resolve),

}


/*-------------------------- data begin ------------------------------*/

root.data = function () {
  return {
    loading: true,
    firstLoad: false,
    loadingNext: false,

    limit: 10,
    limitNum: 10,//一次加载多少条
    fromIndex: 1,
    toIndex: 10,

    fundListLists: [],


    popType: 0,
    popText: '',
    popOpen: false,

    currentPage: 1, //分页选择当前页
    // page_size: 1, // 总页数

    total:100,

    currentIndex:1,
    activePage:1,
    pageSize:30,
    // 本页最后一条ID
    lastId:0,
    // grcObj:{},

    loadingMoreShow:true,
    loadingMoreShowing: false,

  }
}

/*-------------------------- 计算 begin------------------------------*/
root.computed = {}

// 计算后的记录
root.computed.computedRecord = function () {
  return this.fundListLists
}

// 获取语言，中文为0，外文为1
root.computed.lang = function () {
  return this.$store.state.lang == 'CH' ? 0 : 1
}

// 获取userId
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}


/*-------------------------- 生命周期 begin------------------------------*/
root.created = function () {
  this.getFundList()
}


/*-------------------------- 方法 begin------------------------------*/
root.methods = {}

// 获取基金奖励记录
root.methods.getFundList = function (limit) {
  this.$http.send('FUND_RECORDS_LISTS', {
    bind: this,
    callBack: this.re_getFundList,
    errorHandler: this.error_getFundList,
  })
}
// 获取平台奖励记录回调
root.methods.re_getFundList = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.loading = false
  this.firstLoad = true
  this.loadingNext = false
  console.log('this is data', data)
  if (data.errorCode) return

  this.fundListLists = data.dataMap.list
  this.fundListLists.length < this.limit && (this.loadingMoreShow = false)
  this.fundListLists.length >= this.limit && (this.loadingMoreShow = true)
  this.loadingMoreShowing = false
  this.loading = false
  // this.page_size = data.dataMap.size   // 总页数
}
// 获取平台奖励记录出错
root.methods.error_getFundList = function (err) {
  console.warn('获取平台奖励出错', err)
}

// 关闭弹窗
root.methods.loadingMore = function () {
  this.limit += this.limitNum
  this.loadingMoreShowing = true
  this.getFundList(this.limit)
}

// 关闭弹窗
root.methods.popClose = function () {
  this.popOpen = false
}

// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD hh:mm:ss')
}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/


export default root
