const root = {}
root.name = 'MobileContractAllRecords'
/*------------------------------ 组件 ------------------------------*/
root.components = {
 'Loading': resolve => require(['../vue/Loading.vue'], resolve),
  'HiddenDetail': resolve => require(['../vue/MobileHistoricalDetails'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading:true,
    capitalFlowList:[],
    capitalFlowListText:[],
    mobileInviteCode:[],
    capitalAssetSnapshot:[],
    // tradinghallLimit: 10,
    openType:2,
    historicaList:[],//历史成交
    historyOrder: [], //历史委托
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
    showPoster:false,
    orderId:'',
    clientOrderId:'',
    symbolPoster:'',
    // 海报url
    poster_url: '',
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
    // 信息提示
    popType: 0,
    popText: '',
    promptOpen: false,
    loadingImage:true,
  }
}

root.props = {};
// root.props.tradinghallLimit = {
//   type: Number
// }
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getHistorOrder()
  if(this.$route.query.isApp) {
    window.postMessage(JSON.stringify({
      method: 'setH5Back',
      parameters: {
        canGoH5Back:false
      }
    }))
  }
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}

// 检验是否是APP
root.computed.isApp = function () {
  return this.$route.query.isApp ? true : false
}

// 检验是否是安卓
root.computed.isAndroid = function () {
  return this.$store.state.isAndroid ? true : false
}
root.computed.serverTime = function () {
  return new Date().getTime();
}
//历史成交
root.computed.historicalTransaction = function () {
  return this.historicaList
}
//资金流水
root.computed.capitalFlowComputed = function () {
  return this.capitalFlowList
}
// 历史委托属性的计算后，排序之类的写在这里
root.computed.historyOrderComputed = function () {
  return this.historyOrder
}
// 历史委托属性的计算后，排序之类的写在这里
root.computed.mobileInviteCodeComputed = function () {
  return this.mobileInviteCode
}
// 邀请海报
root.computed.accountsComputed = function (index,item) {
  // 特殊处理
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
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
root.watch.currencyValue = function (newVal, oldVal){
  // let a = newVal
  // this.getAccount()
  // this.changeDate()
  this.getPosterImage()
}
root.watch.picIndex = function (newVal, oldVal){
  // this.getPosterImage()
}
/*---
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
//发送海报图片
root.methods.sendImgToApp = function(){
  if(this.$route.query.isApp) {

    window.postMessage(JSON.stringify({
      method: 'toSaveImage',
      parameters: this.poster_url || ''
    }))

    // if(!this.$store.state.authState.userId){
    //
    //   return
    // }
  }
}

root.methods.jumpToBack = function () {

  if(this.$route.query.isApp){
    window.postMessage(JSON.stringify({
      method: 'toHomePage'
    }))
    return
  }
  // history.go(-1)
  this.$router.push('/index/mobileTradingHallDetail')
}

// 切换合约各种记录头部
root.methods.changeOpenType = function(num){
  this.openType = num
  // console.log('this is store',this.$store.state.mobileHeaderTitle,this.$store.state.currencyChange)

  // if(num === 1){
  //   this.$router.push({'path':'/index/mobileContractAllRecords',query:{id:1}})
  //   this.$store.commit('changeMobileHeaderTitle', '');
  //   // this.getRecord()
  // }

  if(num===2){
    this.$router.push({'path':'/index/mobileContractAllRecords',query:{id:2}})
    this.$store.commit('changeMobileHeaderTitle', '');
    this.getHistorOrder()
  }
  if(num === 4) {
    this.$router.push({'path':'/index/mobileContractAllRecords',query:{id:4}})
    this.getHistorTrans()
  }

  if(num === 5) {
    this.$router.push({'path':'/index/mobileContractAllRecords',query:{id:5}})
    this.getCapitalFlow()
  }
  if(num === 6) {
    this.$router.push({'path':'/index/mobileContractAllRecords',query:{id:6}})
    this.getInviteCode()
  }
  if(num === 7) {
    this.$router.push({'path':'/index/mobileContractAllRecords',query:{id:7}})
    this.getAssetSnapshot()
  }

}


// 资金流水
root.methods.getCapitalFlow = function () {
  this.$http.send('GET_CAPITAL_FLOW',{
    bind: this,
    query:{
      // symbol:'BTCUSDT'
      timestamp:this.serverTime
    },
    callBack: this.re_getCapitalFlow,
    errorHandler:this.error_getCapitalFlow
  })
}
// 资金流水正确回调
root.methods.re_getCapitalFlow = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data && !data.data)return
  this.loading = false
  // console.info('data====',data.data)
  this.capitalFlowListText = data.data || []
  let filterCapitalFlowList = []
  this.capitalFlowListText.map(v=>{
    if (v.incomeType != 'COMMISSION_REBATE' && v.incomeType != 'INTERNAL_TRANSFER') {
      filterCapitalFlowList.push(v)
    }
  })
  this.capitalFlowList = filterCapitalFlowList
}
// 资金流水错误回调
root.methods.error_getCapitalFlow = function (err) {
  console.log('获取币安24小时价格变动接口',err)
}


// 资金流水
root.methods.getInviteCode = function () {
  this.$http.send('GET_INVITE_LEST',{
    bind: this,
    query:{},
    callBack: this.re_getInviteCode,
    errorHandler:this.error_getInviteCode
  })
}
// 资金流水正确回调
root.methods.re_getInviteCode = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data && !data.data)return
  this.loading = false
  // console.info('data====',data.data)
  this.mobileInviteCode = data.data || []
}
// 资金流水错误回调
root.methods.error_getInviteCode = function (err) {
  console.log('获取币安24小时价格变动接口',err)
}


// 历史成交
root.methods.getHistorTrans = function () {
  this.$http.send('GET_CAPITAL_DEAL',{
    bind: this,
    query:{
      symbol:'',
      timestamp:this.serverTime
    },
    callBack: this.re_getHistorTrans,
    errorHandler:this.error_getHistorTrans
  })
}
// 历史成交正确回调
root.methods.re_getHistorTrans = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data && !data.data)return
  this.loading = false
  // console.info('data====',data.data)
  this.historicaList = data.data


}
// 历史成交错误回调
root.methods.error_getHistorTrans = function (err) {
  console.log('获取币安24小时价格变动接口',err)
}


// 历史委托发送请求获取
root.methods.getHistorOrder = function () {
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
        symbol:'',
        timestamp:this.serverTime
      },
      callBack: this.re_getOrder,
      errorHandler: this.error_getOrder
    })
}
// 获取历史委托订单回调
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

// // 显示详情
root.methods.showDetail = function (order) {
  if (this.clickThis === order.orderId) {
    this.clickThis = -1
    return
  }
  this.clickThis = order.orderId
  this.historyOrder.length !== 0 && this.historyOrder.forEach(v=>{
    if(this.clickThis == v.orderId) {
      this.startTime = v.time - 1
      this.endTime = v.updateTime + 1
    }
  })

  if (this.clickThis === order.orderId && order.status == 'FILLED') {
    // this.$router.push('/index/mobileHistoricalDetails')
    this.$router.push({name:'mobileHistoricalDetails',query:{order:order,startTime:this.startTime,endTime:this.endTime}})
  }
  // console.info('this.firstTime===',this.startTime,this.endTime)
}


// 资金流水
root.methods.getAssetSnapshot = function () {
  this.$http.send('GET_ASSET_SNAPSHOT',{
    bind: this,
    query:{
      // symbol:'BTCUSDT'
      timestamp:this.serverTime
    },
    callBack: this.re_getAssetSnapshot,
    errorHandler:this.error_getAssetSnapshot
  })
}
// 资金流水正确回调
root.methods.re_getAssetSnapshot = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data && !data.data)return
  this.loading = false
  // console.info('data====',data.data)
  this.capitalAssetSnapshot = data.data || []
}
// 资金流水错误回调
root.methods.error_getAssetSnapshot = function (err) {
  console.log('获取币安24小时价格变动接口',err)
}




// 展示海报
root.methods.SHOW_POSTER = function (order) {
  this.showPoster = true;
  // this.initialPosition = index
  this.orderId = order.orderId
  this.clientOrderId = order.clientOrderId
  this.symbolPoster = order.symbol
  this.getPosterImage()
}
// 获取海报
root.methods.getPosterImage = function () {
  this.loadingImage=true
  let params = {
    orderId:this.orderId,
    clientOrderId:this.clientOrderId,
    symbol:this.symbolPoster,
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
    this.showPoster = false
    this.popText = '请您先登录再进行分享'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 2) {
    this.showPoster = false
    this.popText = '参数有误'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 3) {
    this.showPoster = false
    this.popText = '未查询到此订单'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 4) {
    this.showPoster = false
    this.popText = '该订单未全部成交不可分享'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 5) {
    this.showPoster = false
    this.popText = '选择的订单不是平仓单'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 6) {
    this.showPoster = false
    this.popText = '此时间段内未查询到此订单'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(res.code == 7) {
    this.showPoster = false
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
// 隐藏海报
root.methods.HIDE_POSTER = function () {
  this.showPoster = false;
}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

export default root
