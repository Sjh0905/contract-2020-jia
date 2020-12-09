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
    clickThis: -1,

    limit: 100, //一次获取多少条数据
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
    accounts : [
      {'a':'勤劳致富，落袋为安'},
      {'a':'接着奏乐，接着舞'},
      {'a':'富贵险中求'},
      {'a':'感觉人生，到达巅峰'},
      {'a':'掐指一算，今天大赚'},
      {'a':'动如脱兔的，逃顶小能手'},
      {'a':'一键梭哈的，市价小能手'},
      {'a':'这是什么，人间疾苦'},
      {'a':'多么痛，的领悟'},
      {'a':'我命由庄，不由我'},
      {'a':'庄终于，对我下手了'},
      {'a':'能亏才会赚，不信等着看'},
      {'a':'断臂求生的，止损小能手'},
      {'a':'舍己为人的，反指小能手'},
    ],
    orderId:'',
    // 信息提示
    popType: 0,
    popText: '',
    promptOpen: false,
  }
}

root.props = {};
root.props.tradinghallLimit = {
  type: Number
}

/*----------------------------- 计算 ------------------------------*/
root.watch = {}
root.watch.currencyValue = function (newVal, oldVal){
  // let a = newVal
  // this.getAccount()
  this.getPosterImage()
}
root.watch.picIndex = function (newVal, oldVal){
  // this.getPosterImage()
}



root.computed = {}
// 历史属性的计算后，排序之类的写在这里
root.computed.historyOrderComputed = function () {
  return this.historyOrder
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
root.computed.picIndex = function () {
  let a = this.accounts.map(item => item.a).indexOf(this.currencyValue) + 1
  return a || 1
}
// 当前货币对
root.computed.symbol = function () {
  return this.$store.state.symbol;
}
//不加下划线币对
root.computed.capitalSymbol = function () {
  return this.$globalFunc.toOnlyCapitalLetters(this.symbol);
}

/*----------------------------- 生命周期 ------------------------------*/


root.created = function () {
  // console.warn('历史订单！！！')
  // console.log('this.$route=======historicalEntrust',this.$route.name)
  this.getOrder()
}

/*----------------------------- 方法 ------------------------------*/


root.methods = {}
// 发送请求获取
root.methods.getOrder = function () {
  // if (!this.$store.state.authState.userId) {
  //   this.loading = false
  //   return
  // }
  // this.loading = true

  this.$http.send('GET_CAPITAL_ALL_FLOW',
    {
      bind: this,
      query: {
        // updatedAt:this.updatedAt,//最后的订单更新时间
        // offsetId: this.offsetId, //最后一条订单的id
        // limit: (this.tradinghallLimit===10) ? this.tradinghallLimit : this.limit, //一次请求多少条订单
        // limit: 10, //一次请求多少条订单
        // isFinalStatus: true //是否是历史订单
        symbol:this.capitalSymbol,
        timestamp:this.serverTime
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
  this.historyOrder = data.data
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
      this.startTime = v.time - 1
      this.endTime = v.updateTime + 1
    }
  })
  // console.info('this.firstTime===',this.startTime,this.endTime)
}

// 点击加载更多
root.methods.clickLoadingMore = function () {
  this.loadingMoreIng = true
  this.getOrder()
}

// 点击加载更多
root.methods.toOrderHistory = function () {
  this.$router.push({name:'historicalEntrust'})
}

//海报
// 展示海报
root.methods.SHOW_POSTER = function (orderId) {
  this.orderId = orderId
  this.showPoster = true;
  this.getPosterImage()
}

// 隐藏海报
root.methods.HIDE_POSTER = function () {
  this.showPoster = false;
}
// 获取海报
root.methods.getPosterImage = function () {
  // console.info(this.changeDate())
  // return
  this.loadingImage=true
  let params = {
    orderId:this.orderId,
    symbol:this.capitalSymbol,
    picIndex:this.picIndex || 0,
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
