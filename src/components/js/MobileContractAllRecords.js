const root = {}
root.name = 'MobileContractAllRecords'
/*------------------------------ 组件 ------------------------------*/
root.components = {
 // 'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
  'HiddenDetail': resolve => require(['../vue/MobileHistoricalDetails'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading:true,
    capitalFlowList:[],
    capitalFlowListText:[],
    mobileInviteCode:[],
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
    }
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
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

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
  this.$http.send('',{
    bind: this,
    query:{
      // symbol:'BTCUSDT'
      timestamp:this.serverTime
    },
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
      symbol:'BTCUSDT',
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
        symbol:'BTCUSDT',
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
    this.$router.push({name:'mobileHistoricalDetails',query:{order:this.order,startTime:this.startTime,endTime:this.endTime}})
  }
  // console.info('this.firstTime===',this.startTime,this.endTime)
}






/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

export default root
