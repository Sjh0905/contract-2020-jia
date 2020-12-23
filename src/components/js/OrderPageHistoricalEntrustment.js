const root = {}
root.name = 'OrderPageHistoricalEntrustment'

/*----------------------------- 组件 ------------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'HiddenDetail': resolve => require(['../vue/OrderPageHistoricalEntrustmentDetail'], resolve),
  'SharingInvitationPc': resolve => require(['../vue/SharingInvitationPc'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}

/*----------------------------- data ------------------------------*/

root.data = () => {
  return {
    loading: true,
    historyOrder: [],
    historyOrderSearch: [],
    tradHistoryOrder: [],
    clickThis: -1,

    limit: 50, //一次获取多少条数据
    offsetId: 0, //最后的订单id
    updatedAt:1,//最后的订单更新时间,默认为1
    showLoadingMore: true,//是否显示加载更多
    loadingMoreIng: false, //是否正在加载更多
    strtTime:0 , // 起始时间
    endTime:0 , // 结束时间
    workingTypeMap : {
      MARK_PRICE:"标记价格",
      CONTRACT_PRICE:"最新价格"
    },

    // 是否展示海报
    showPoster: false,
    initialPosition:0,
    loadingImage:true,
    poster_url:'',
    currencyValue:'勤劳致富，落袋为安',
    currencyValueDeficit:'这是什么，人间疾苦',
    // psSymbolArr:['BTCUSDT'],//,'ETHUSDT'
    accounts : [
      {'a':'勤劳致富，落袋为安'},
      {'a':'接着奏乐，接着舞'},
      {'a':'富贵险中求'},
      {'a':'感觉人生，到达巅峰'},
      {'a':'掐指一算，今天大赚'},
      {'a':'动如脱兔的，逃顶小能手'},
      {'a':'一键梭哈的，市价小能手'},
    ],
    accountsDeficit : [
      {'a':'这是什么，人间疾苦'},
      {'a':'多么痛，的领悟'},
      {'a':'我命由庄，不由我'},
      {'a':'庄终于，对我下手了'},
      {'a':'能亏才会赚，不信等着看'},
      {'a':'断臂求生的，止损小能手'},
      {'a':'舍己为人的，反指小能手'},
    ],
    isProfitLoss:true,
    // currencyValue:'勤劳致富，落袋为安',
    // accounts : [
    //   {'a':'勤劳致富，落袋为安'},
    //   {'a':'接着奏乐，接着舞'},
    //   {'a':'富贵险中求'},
    //   {'a':'感觉人生，到达巅峰'},
    //   {'a':'掐指一算，今天大赚'},
    //   {'a':'动如脱兔的，逃顶小能手'},
    //   {'a':'一键梭哈的，市价小能手'},
    //   {'a':'这是什么，人间疾苦'},
    //   {'a':'多么痛，的领悟'},
    //   {'a':'我命由庄，不由我'},
    //   {'a':'庄终于，对我下手了'},
    //   {'a':'能亏才会赚，不信等着看'},
    //   {'a':'断臂求生的，止损小能手'},
    //   {'a':'舍己为人的，反指小能手'},
    // ],
    orderId:0,
    clientOrderId:'',
    posterSymbol:'', //海报对应币对
    // 信息提示
    popType: 0,
    popText: '',
    promptOpen: false,
    interTimerPicker:null,
    pickerOptions: {
      disabledDate:(time) => {
        return this.dealDisabledDate(time)
      }
    }, // 日期设置对象(设置日历为一个月)

    Lieoptions:[
      {
        value: 'LIMIT',
        label: '限价单'
      }, {
        value: 'MARKET',
        label: '市价单'
      }, {
        value: 'STOP',
        label: '止损限价单'
      }, {
        value: 'STOP_MARKET',
        label: '止损市价单'
      }, {
        value: 'TAKE_PROFIT',
        label: '止盈限价单'
      }, {
        value: 'TAKE_PROFIT_MARKET',
        label: '止盈市价单'
      }

    ],
    LieoptionsUsdt:[
      {
        value: 'ETHUSDT',
        label: 'ETHUSDT'
      },
      {
        value: 'BTCUSDT',
        label: 'BTCUSDT'
      }
    ],
    value:'',
    valueUsdt:'',

  }
}

root.props = {};
root.props.tradinghallLimit = {
  type: Number
}

/*----------------------------- 生命周期 ------------------------------*/


root.created = function () {
  // console.warn('历史订单！！！')
  // console.log('this.$route=======historicalEntrust',this.$route.name)
  // 历史委托使用搜索接口，交易页使用获取订单接口
  if(this.$route.name == 'historicalEntrust') {
    this.getOrderHistory()
  }
  if(this.$route.name != 'historicalEntrust'){
    this.getOrder()
  }
  this.pickerOptions.disabledDate = function (time) {
    // 设置可选择的日期为今天之后的一个月内
    let curDate = (new Date()).getTime()
    // 这里算出一个月的毫秒数,这里使用30的平均值,实际中应根据具体的每个月有多少天计算
    let day = 30 * 24 * 3600 * 1000;
    let Months = curDate - day;
    return (time.getTime()) > Date.now()  || time.getTime() <= Months;

    // 设置选择的日期小于当前的日期,小于返回true,日期不可选
    // return time.getTime() < Date.now() - 8.64e7
  }

}

/*----------------------------- 计算 ------------------------------*/
root.watch = {}
root.watch.currencyValue = function (newVal, oldVal){
  // let a = newVal
  // this.getAccount()
  this.getPosterImage()
}
root.watch.currencyValueDeficit = function (newVal, oldVal){
  // let a = newVal
  // this.getAccount()
  this.getPosterImage()
}
root.watch.picIndex = function (newVal, oldVal){
  // this.getPosterImage()
}


// root.watch.isProfitLoss = function (newVal, oldVal){
//     // this.getPosterImage()
// }
root.watch.interTimerPicker = function (newVal, oldVal) {
  if(newVal == oldVal) return
  if(newVal == null && this.value == '' && this.valueUsdt == ''){
    this.clearEmpty()
    this.getOrderHistory()
  }
}
root.watch.value = function (newVal, oldVal) {
  if(newVal == oldVal) return
  if(this.interTimerPicker == null && newVal == '' && this.valueUsdt == ''){
    this.clearEmpty()
    this.getOrderHistory()
  }
}
root.watch.valueUsdt = function (newVal, oldVal) {
  if(newVal == oldVal) return
  if(this.interTimerPicker == null && this.value == '' && newVal == ''){
    this.clearEmpty()
    this.getOrderHistory()
  }
}


root.computed = {}
// 历史属性的计算后，排序之类的写在这里
root.computed.historyOrderComputed = function () {
  return this.historyOrder || []
}
root.computed.tradHistory = function () {
  return this.tradHistoryOrder || []
}
// 历史属性的计算后，排序之类的写在这里
root.computed.historyOrderSearchComputed = function () {
  return this.historyOrderSearch || []
}
// 获取登录状态
root.computed.userId = function () {
  return this.$store.state.authState.userId
}

// 所有币对精度信息
root.computed.quoteScale_list = function () {
  let quoteScale_obj = {};
  let quoteScale_list = this.$store.state.quoteConfig;
  quoteScale_list.forEach(v => {
    quoteScale_obj[v.name] = {quoteScale: v.quoteScale, baseScale: v.baseScale};
  })
  return quoteScale_obj;
}
root.computed.serverTime = function () {
  return new Date().getTime();
}
root.computed.accountsComputed = function (index,item) {
  // // 特殊处理
  // this.accounts.map(item => item.a).indexOf(this.currencyValue)
  // this.picIndex = this.accounts.map(item => item.a).indexOf(this.currencyValue)
  // console.info('this.accounts=======aaaaa',c+1)
  return this.accounts
}
root.computed.accountsComputedDeficit = function (index,item) {
  // // 特殊处理
  return this.accountsDeficit
}
// root.computed.picIndex = function () {
//   let a = this.accounts.map(item => item.a).indexOf(this.currencyValue) + 1
//   return a || 1
// }
root.computed.picIndex = function () {
  if (this.isProfitLoss) {
    let a = this.accounts.map(item => item.a).indexOf(this.currencyValue) + 1
    return a || 1
  }else {
    let a = this.accountsDeficit.map(item => item.a).indexOf(this.currencyValueDeficit) + 8
    return a || 8
  }

}
// 当前货币对
root.computed.symbol = function () {
  return this.$store.state.symbol;
}
//不加下划线币对
root.computed.capitalSymbol = function () {
  return this.$globalFunc.toOnlyCapitalLetters(this.symbol);
}
//不加下划线币对集合
root.computed.sNameList = function () {
  return this.$store.state.sNameList || []
}


/*----------------------------- 方法 ------------------------------*/


root.methods = {}
// 监听到输入框的值变化，将这些值设置为初始值
root.methods.clearEmpty = function () {
  this.historyOrder = []
  this.offsetId = 0
  this.limit = 50
  this.interTimerPicker = null
  this.value =''
  this.valueUsdt =''
}
// 单独处理时间的函数
root.methods.dealDisabledDate = function (time) {
  // time.getTime是把选中的时间转化成自1970年1月1日 00:00:00 UTC到当前时间的毫秒数
  // Date.now()是把今天的时间转化成自1970年1月1日 00:00:00 UTC到当前时间的毫秒数,这样比较好比较
  // return的值,true是不可以操作选择,false可以操作选择,比如下面这个判断就只能选择今天之后的时间
  return time.getTime() < Date.now() - 8.64e7

  // 这里减8.64e7的作用是,让今天的日期可以选择,如果不减的话,今天的日期就不可以选择,判断中写<= 也是没用的,一天的毫秒数就是8.64e7
  // return time.getTime() <= Date.now()
  // return time.getTime() < Date.now() - 8.64e7
}



// 发送请求获取
/*root.methods.getOrderSearch = function () {
  // this.pickerOptions.disabledDate
  this.$http.send('GET_CAPITAL_SEARCH', {
      bind: this,
      query: {
        startTime:this.interTimerPicker[0] || '',  //搜索日历的第一个时间
        endTime:this.interTimerPicker[1] + 24 * 3599 * 1000 || '', //搜索日历的第二个时间，加上当天的数据
        type:this.value || '',
        symbol:this.valueUsdt || '',
      },
      callBack: this.re_getOrderSearch,
      errorHandler: this.error_getOrderSearch
    })
}
// 获取历史订单回调
root.methods.re_getOrderSearch = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  this.historyOrderSearch = data.data || []

  this.loading = false
  // 加载更多中
  this.loadingMoreIng = false

  // 如果获取
  data.data.length !== 0 && (this.offsetId = data.data[data.data.length - 1].id)
  data.data.length !== 0 && (this.updatedAt = data.data[data.data.length - 1].updatedAt)

  // 是否显示加载更多
  // console.warn('this is order length', data.orders.length, this.limit)
  if (data.data.length < this.limit) {
    this.showLoadingMore = false
  }
}
// 错误处理
root.methods.error_getOrderSearch = function (err) {
  console.warn("获取错误", err)
}*/

// 发送请求获取
root.methods.getOrderHistory = function () {
  let query
  if(this.interTimerPicker == null && this.value == '' && this.valueUsdt == ''){
    query = {
      offset:this.offsetId,
      limit:this.limit,
      symbol: '',
    }
  }else{
    query = {
      startTime:this.interTimerPicker == null ? '' :this.interTimerPicker[0] ,  //搜索日历的第一个时间
      endTime:this.interTimerPicker == null ? '' :this.interTimerPicker[1] + 24 * 3599 * 1000, //搜索日历的第二个时间，加上当天的数据
      type:this.value || '',
      symbol:this.valueUsdt || '',
    }
  }

  // this.pickerOptions.disabledDate
  this.$http.send('GET_CAPITAL_SEARCH', {
    bind: this,
    query,
    // query: {
    //   offset:this.offsetId,
    //   limit:50,
    //   symbol: '',
    // },
    callBack: this.re_getOrderHistory,
    errorHandler: this.error_getOrderHistory
  })
}
// 获取历史订单回调
root.methods.re_getOrderHistory = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  this.loading = false
  if(this.interTimerPicker != null || this.value != '' || this.valueUsdt != ''){
    this.historyOrder = data.data || []
    return
  }
  //清空搜索完的数据，否则会在尾部增加

  this.historyOrder.push(...data.data)

  // 加载更多中
  this.loadingMoreIng = false

  // 如果获取
  data.data.length !== 0 && (this.offsetId = data.data[data.data.length - 1].id)
  // data.data.length !== 0 && (this.updatedAt = data.data[data.data.length - 1].updatedAt)

  // 是否显示加载更多
  // console.warn('this is order length', data.orders.length, this.limit)
  if (data.data.length < this.limit) {
    this.showLoadingMore = false
  }
}
// 错误处理
root.methods.error_getOrderHistory = function (err) {
  console.warn("获取错误", err)
}

// 发送请求获取（交易页历史委托）
root.methods.getOrder = function () {
  // if (!this.$store.state.authState.userId) {
  //   this.loading = false
  //   return
  // }
  // this.loading = true

  this.$http.send('GET_CAPITAL_ALL_FLOW', {
      bind: this,
      query: {
        // updatedAt:this.updatedAt,//最后的订单更新时间
        // orderId: this.orderId, //最后一条订单的id
        // limit: (this.tradinghallLimit===10) ? this.tradinghallLimit : this.limit, //一次请求多少条订单
        limit: this.tradinghallLimit, //一次请求多少条订单
        // isFinalStatus: true //是否是历史订单
        symbol:'',
        // timestamp:this.serverTime
      },
      callBack: this.re_getOrder,
      errorHandler: this.error_getOrder
    })
}
// 获取历史订单回调
root.methods.re_getOrder = function (data) {
  // this.historyOrder.push(...data.data.filter(
  //   v => {
  //     return ((v.status === 'PARTIAL_CANCELLED') || (v.status === 'FULLY_CANCELLED') || (v.status === 'FULLY_FILLED'))
  //   }
  // ))
  this.tradHistoryOrder = data.data
  this.loading = false
  /*// 加载更多中
  this.loadingMoreIng = false

  // 如果获取
  data.data.length !== 0 && (this.orderId = data.data[data.data.length - 1].orderId)
  // data.data.length !== 0 && (this.updatedAt = data.data[data.data.length - 1].updatedAt)

  // 是否显示加载更多
  // console.warn('this is order length', data.orders.length, this.limit)
  if (data.data.length < this.limit) {
    this.showLoadingMore = false
  }*/

}
// 错误处理
root.methods.error_getOrder = function (err) {
  console.warn("获取错误", err)
}

// 订单状态
root.methods.getStatus = function (order) {
  if (order.status === 'PARTIAL_CANCELLED') return this.$t('orderPageHistoricalEntrustmentDetail.partialCancelled',
    {point: ((order.filledAmount / order.amount) * 100).toFixed(2) < 0.01 ? '<0.01' : ((order.filledAmount / order.amount) * 100).toFixed(2)})
  // `撤单（成交 ${((order.filledAmount / order.amount) * 100).toFixed(2) < 0.01 ? '<0.01' : ((order.filledAmount / order.amount) * 100).toFixed(2)}%）` //部分成功
  if (order.status === 'FULLY_CANCELLED') return this.$t('orderPageHistoricalEntrustmentDetail.fullyCancelled')
  if (order.status === 'FULLY_FILLED') return this.$t('orderPageHistoricalEntrustmentDetail.fullyFilled')
}

// 可以显示详情
root.methods.canShowDetail = function (order) {
  if (order.status === 'PARTIAL_CANCELLED') return true
  if (order.status === 'FULLY_CANCELLED') return false
  if (order.status === 'FULLY_FILLED') return true
}

// // 显示详情
root.methods.showDetail = function (id) {
  if (this.clickThis === id) {
    this.clickThis = -1
    return
  }
  this.clickThis = id
  this.historyOrder.length !== 0 && this.historyOrder.forEach(v=>{
    if(this.clickThis == v.orderId) {
      this.startTime = v.updateTime - 1
      this.endTime = v.updateTime + 1
    }
  })
  // console.info('this.firstTime===',this.startTime,this.endTime)
}

// 点击加载更多
root.methods.clickLoadingMore = function () {
  this.loadingMoreIng = true
  this.getOrderHistory()
}

// 点击加载更多
root.methods.toOrderHistory = function () {
  this.$router.push({name:'historicalEntrust'})
}

//海报
// 展示海报
root.methods.SHOW_POSTER = function (order) {
  this.orderId = order.orderId
  this.clientOrderId = order.clientOrderId
  this.posterSymbol = order.symbol
  this.showPoster = true;
  // this.getPosterImage()
  this.getPosterImageLoss()
}

// 隐藏海报
root.methods.HIDE_POSTER = function () {
  this.showPoster = false;
}


// 获取海报
root.methods.getPosterImageLoss = function () {
  // console.info(this.changeDate())
  // return
  this.poster_url = ''
  let params = {
    orderId:this.orderId,
    clientOrderId:this.clientOrderId,
    symbol:this.posterSymbol,
  }
  this.$http.send('POST_ASSET_LOSS', {
    bind: this,
    params: params,
    callBack: this.re_getPosterImageLoss,
    errorHandler: this.error_getPosterImageLoss
  })
}
root.methods.re_getPosterImageLoss = function (res) {
 this.isProfitLoss = res.data.isProfitLoss
  if (this.isProfitLoss == true) {
    this.getPosterImage()
  }else{
    this.getPosterImage()
  }
  if(res.code == 1) {
    this.showPoster = false;
    this.popText = '请您先登录再进行分享'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 2) {
    this.showPoster = false;
    this.popText = '参数有误'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 3) {
    this.showPoster = false;
    this.popText = '未查询到此订单'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 4) {
    this.showPoster = false;
    this.popText = '该订单未全部成交不可分享'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 5) {
    this.showPoster = false;
    this.popText = '选择的订单不是平仓单'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 6) {
    this.showPoster = false;
    this.popText = '此时间段内未查询到此订单'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 7) {
    this.showPoster = false;
    this.popText = '该笔订单不是平仓单，实现盈亏是0，无法分享'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  // if(res.code == 200){
  //   let urls = res.data
  //   setTimeout(function(){
  //     this.loadingImage = false
  //   }.bind(this),2000)
  //   this.poster_url = urls;
  // }

}

// 获取海报
root.methods.getPosterImage = function () {
  // console.info(this.changeDate())
  // return
  this.loadingImage=true
  let params = {
    orderId:this.orderId,
    clientOrderId:this.clientOrderId,
    symbol:this.posterSymbol,
    picIndex:this.picIndex,
  }
  this.$http.send('POST_ASSET_SNAPSHOT', {
    bind: this,
    params: params,
    callBack: this.re_getPosterImage,
    errorHandler: this.error_getPosterImage
  })
}
root.methods.re_getPosterImage = function (res) {
  if(res.code == 1) {
    this.showPoster = false;
    this.popText = '请您先登录再进行分享'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 2) {
    this.showPoster = false;
    this.popText = '参数有误'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 3) {
    this.showPoster = false;
    this.popText = '未查询到此订单'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 4) {
    this.showPoster = false;
    this.popText = '该订单未全部成交不可分享'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 5) {
    this.showPoster = false;
    this.popText = '选择的订单不是平仓单'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 6) {
    this.showPoster = false;
    this.popText = '此时间段内未查询到此订单'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 7) {
    this.showPoster = false;
    this.popText = '该笔订单不是平仓单，实现盈亏是0，无法分享'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 200){
    let urls = res.data
    setTimeout(function(){
      this.loadingImage = false
    }.bind(this),2000)
    this.poster_url = urls;
  }

}

// 关闭提示信息
root.methods.closePrompt = function () {
  this.promptOpen = false;
}
root.methods.error_getPosterImage = function (err) {
  console.warn('err',err)
}
root.methods.error_getPosterImageLoss = function (err) {
  console.warn('err',err)
}
// 2020.11.16. ccc
/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

/*---------------------- 加法运算 begin ---------------------*/
root.methods.accAdd = function (num1, num2) {
  return this.$globalFunc.accAdd(num1, num2)
}
/*---------------------- 加法运算 end ---------------------*/

/*---------------------- 减法运算 begin ---------------------*/
root.methods.accMinus = function (num1, num2) {
  return this.$globalFunc.accMinus(num1, num2)
}
/*---------------------- 减法运算 end ---------------------*/

export default root
