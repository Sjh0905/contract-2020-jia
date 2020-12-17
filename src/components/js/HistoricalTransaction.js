const root = {}
root.name = 'HistoricalTransaction'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading:true,
    historicaList:[],
    tradinghallLimit: 10,
    interTimerPicker:'',
    pickerOptions: {
      disabledDate:(time) => {
        return this.dealDisabledDate(time)
      }
    }, // 日期设置对象

    LieoptionsUsdt:[
      {
        value: 'ETHUSDT',
        label: 'ETHUSDT'
      }, {
        value: 'BTCUSDT',
        label: 'BTCUSDT'
      }
    ],
    value:'',
    valueUsdt:'',
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getHistorTrans()

  this.pickerOptions.disabledDate = function (time) {
    // 设置可选择的日期为今天之后的一个月内
    let curDate = (new Date()).getTime()
    // 这里算出一个月的毫秒数,这里使用30的平均值,实际中应根据具体的每个月有多少天计算
    // let day = 30 * 24 * 3600 * 1000;//只支持查询当天以前30天
    let day =  24 * 3600 * 1000;//只支持查询当天
    let Months = curDate - day;
    return time.getTime() > Date.now() || time.getTime() < Months;
    // return time.getTime() > Date.now();

    // 设置选择的日期小于当前的日期,小于返回true,日期不可选
    // return time.getTime() < Date.now() - 8.64e7
  }
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 所有币对精度信息
root.computed.quoteScale_list = function () {
  let quoteScale_obj = {};
  let quoteScale_list = this.$store.state.quoteConfig;
  quoteScale_list.forEach(v => {
    quoteScale_obj[v.name] = {quoteScale: v.quoteScale, baseScale: v.baseScale};
  })
  return quoteScale_obj;
}
// 用户id，判断是否登录
root.computed.userId = function () {
  return this.$store.state.authState.userId
}
root.computed.historicalTransaction = function () {
  return this.historicaList
}
root.computed.serverTime = function () {
  return new Date().getTime();
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
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}

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

// 历史成交
root.methods.getHistorTrans = function () {
  this.$http.send('GET_CAPITAL_DEAL',{
    bind: this,
    query:{
      // timestamp:this.serverTime
      startTime:this.interTimerPicker[0] || '',
      endTime:this.interTimerPicker[1] + 24 * 3599 * 1000 || '',
      symbol:this.valueUsdt || '',
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

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/
export default root
